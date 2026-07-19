import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

// Captures the dashboard under every registered language, plus its empty and
// error states. The Definition of Done requires the surface to be rendered and
// looked at: gate-green is not design-reviewed, and this project has twice
// shipped something that passed every gate while rendering wrongly.

const BASE = process.env['BASE_URL'] ?? 'http://localhost:4200';
const OUT = 'test-results/dashboard';
const LANGUAGES = ['rdk-default', 'obsidian', 'evolute'];

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
  const page = await browser.newPage({ viewport: { width: 1500, height: 1050 } });

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

    for (const [label, query] of [
      ['default', ''],
      ['empty', '?dashboard=empty'],
      ['error', '?dashboard=error'],
    ]) {
      await page.goto(`${BASE}/app/dashboard${query}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('.dash__sub', { timeout: 15_000 });
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${OUT}/${language}--${label}.png`, fullPage: true });
    }

    const anchors = await page.locator('.kpi--anchor').count();
    console.log(`${language.padEnd(12)} captured 3 states | emphasis surfaces: ${anchors}`);
  }

  console.log(errors.length ? `console errors:\n  ${errors.join('\n  ')}` : 'no console errors');
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
