import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

// Renders the design-language comparison page and captures it, so the protocol's
// swap-invariance claim can be reviewed visually rather than taken on trust.
//
// /showcase is auth-gated. A mock JWT is injected directly rather than driving
// the login form: this script is a rendering harness, not an auth test, and the
// dev mock interceptor accepts b64url tokens shaped like the real thing.

const BASE = process.env['BASE_URL'] ?? 'http://localhost:4200';
const OUT = 'test-results/language-comparison';

function mockJwt(): string {
  const b64url = (o: unknown) =>
    Buffer.from(JSON.stringify(o)).toString('base64url').replace(/=+$/, '');
  const exp = Math.floor(Date.now() / 1000) + 60 * 60;
  return [
    b64url({ alg: 'HS256', typ: 'JWT' }),
    b64url({ sub: 'screenshot', email: 'test@rdk.dev', roles: ['admin'], exp }),
    'signature-not-verified-in-dev',
  ].join('.');
}

async function main(): Promise<void> {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));

  // localStorage needs an origin before it can be written.
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const token = mockJwt();
  await page.evaluate(
    ([access, refresh]) => {
      localStorage.setItem('rdk_access_token', access);
      localStorage.setItem('rdk_refresh_token', refresh);
    },
    [token, token],
  );

  await page.goto(`${BASE}/showcase/protocol/languages`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.panel', { timeout: 15_000 });

  const panels = await page.locator('.panel').count();
  const ids = await page.locator('.panel').evaluateAll((els) =>
    els.map((e) => e.getAttribute('data-theme')),
  );

  await page.screenshot({ path: `${OUT}/all-languages.png`, fullPage: true });

  for (const id of ids) {
    if (!id) continue;
    await page.locator(`.panel[data-theme="${id}"]`).screenshot({ path: `${OUT}/${id}.png` });
  }

  // Greyscale render: theEvolute's Redundant Signal pattern claims meaning
  // survives without colour. This makes that claim inspectable.
  await page.addStyleTag({ content: 'html { filter: grayscale(1) !important; }' });
  await page.screenshot({ path: `${OUT}/all-languages-greyscale.png`, fullPage: true });

  console.log(`panels: ${panels} → ${ids.join(', ')}`);
  console.log(errors.length ? `console errors:\n  ${errors.join('\n  ')}` : 'no console errors');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
