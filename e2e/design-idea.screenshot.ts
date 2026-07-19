import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

// Captures one design idea under each registered language, so that "a design
// idea carries a philosophy" is inspectable rather than asserted. Also captures
// an idea only Obsidian has expressed, to check the gap state renders instead
// of silently substituting another language's work.

const BASE = process.env['BASE_URL'] ?? 'http://localhost:4200';
const OUT = 'test-results/design-ideas';
const LANGUAGES = ['rdk-default', 'obsidian', 'evolute'];
const IDEA = process.env['IDEA'] ?? 'pricing-section';
const GAP_IDEA = 'erp-dashboard';

function mockJwt(): string {
  const b64url = (o: unknown) =>
    Buffer.from(JSON.stringify(o)).toString('base64url').replace(/=+$/, '');
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return [
    b64url({ alg: 'HS256', typ: 'JWT' }),
    b64url({ sub: 'screenshot', email: 'test@rdk.dev', roles: ['admin'], exp }),
    'signature-not-verified-in-dev',
  ].join('.');
}

async function main(): Promise<void> {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });

  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const token = mockJwt();

  for (const language of LANGUAGES) {
    await page.evaluate(
      ([access, refresh, theme]) => {
        localStorage.setItem('rdk_access_token', access);
        localStorage.setItem('rdk_refresh_token', refresh);
        localStorage.setItem('rdk_theme', theme);
      },
      [token, token, language],
    );

    await page.goto(`${BASE}/showcase/new-design-ideas/${IDEA}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.idea-head__title', { timeout: 15_000 });
    // The variant is lazily imported; wait for either the content or the gap.
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${IDEA}--${language}.png`, fullPage: true });

    await page.goto(`${BASE}/showcase/new-design-ideas/${GAP_IDEA}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const gap = await page.locator('.idea-gap').count();
    console.log(`${language.padEnd(12)} ${IDEA}: captured | ${GAP_IDEA}: ${gap ? 'GAP shown' : 'variant rendered'}`);
    if (gap) await page.screenshot({ path: `${OUT}/${GAP_IDEA}--${language}-gap.png` });
  }

  console.log(errors.length ? `console errors:\n  ${errors.join('\n  ')}` : 'no console errors');
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
