import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

// Captures the post-login toolkit presentation under every registered language:
// Home (populated bento + recents), Home empty state, Library (Blocks reframe
// with install/fork bar), and a Starters flow (pricing). Verifies the signal
// surfaces render with no console errors for each language.

const BASE = process.env['BASE_URL'] ?? 'http://localhost:4200';
const CHROME = process.env['CHROME_PATH'];
const OUT = 'test-results/toolkit';
const LANGUAGES = ['rdk-default', 'obsidian', 'evolute', 'gokul', 'paper', 'noir', 'launchline-obsidian'];

function mockJwt(): string {
  const b64url = (o: unknown) =>
    Buffer.from(JSON.stringify(o)).toString('base64url').replace(/=+$/, '');
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return [
    b64url({ alg: 'HS256', typ: 'JWT' }),
    b64url({ sub: 'screenshot', email: 'test@rdk.dev', roles: ['user'], exp }),
    'signature-not-verified-in-dev',
  ].join('.');
}

async function main(): Promise<void> {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
  const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });

  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  // Known dev-mode noise: with no backend on :3000 the dashboard layout fetch
  // fails at the browser/CSP layer. Filter it so "console error" evidence stays
  // meaningful for the surfaces under test.
  const insignificant = (text: string) =>
    text.includes('dashboard/layout') || text.includes('INFRASTRUCTURE_NETWORK_ERROR');

  const token = mockJwt();
  const recents = [
    { label: 'Checkout & payment', url: '/showcase/blocks/checkout', at: Date.now() - 60_000 },
    { label: 'Invoices', url: '/showcase/blocks/invoices', at: Date.now() - 120_000 },
    { label: 'Orders queue', url: '/showcase/blocks/orders', at: Date.now() - 300_000 },
  ];

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });

  for (const language of LANGUAGES) {
    await page.evaluate(
      ([access, refresh, theme]) => {
        localStorage.setItem('rdk_access_token', access);
        localStorage.setItem('rdk_refresh_token', refresh);
        localStorage.setItem('rdk_theme', theme);
      },
      [token, token, language],
    );

    // Home — populated bento hero with recents.
    await page.evaluate((r) => localStorage.setItem('rdk_command_recents_v1', JSON.stringify(r)), recents);
    await page.goto(`${BASE}/app/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForSelector('rdk-bento-home, .db__dashboard', { timeout: 15_000 });
    await page.waitForTimeout(700);
    const bentoCells = await page.locator('rdk-bento-home a[href], rdk-bento-home button').count();
    const recentsLinks = await page.locator('rdk-bento-home a.bento__link').count();
    const paletteHint = await page.getByText('⌘K').count();
    await page.screenshot({ path: `${OUT}/home-populated--${language}.png`, fullPage: true });

    // Home — empty state (no recents).
    await page.evaluate(() => localStorage.removeItem('rdk_command_recents_v1'));
    await page.goto(`${BASE}/app/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForSelector('rdk-bento-home, .db__dashboard', { timeout: 15_000 });
    await page.waitForTimeout(700);
    const recentsCleared = await page.locator('rdk-bento-home a.bento__link').count();
    const emptyCopy = await page.getByText('Nothing open yet').count();
    await page.screenshot({ path: `${OUT}/home-empty--${language}.png`, fullPage: true });

    // Library — Blocks reframe with the install/fork bar.
    await page.goto(`${BASE}/showcase/atoms/button`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.sc-header, rdk-showcase-block-actions', { timeout: 15_000 });
    await page.waitForTimeout(400);
    const installBar = await page.locator('rdk-showcase-block-actions').count();
    await page.screenshot({ path: `${OUT}/library-button--${language}.png`, fullPage: true });

    // Starters flow — pricing section.
    await page.goto(`${BASE}/showcase/new-design-ideas/pricing-section`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.idea-head__title', { timeout: 15_000 });
    await page.waitForTimeout(600);
    const pricingTitle = await page.locator('.idea-head__title').textContent();
    await page.screenshot({ path: `${OUT}/starters-pricing--${language}.png`, fullPage: true });

    const ok = bentoCells > 0 && recentsLinks === recents.length && recentsCleared === 0 && emptyCopy === 1 && installBar === 1;
    console.log(
      `${language.padEnd(12)} bento-cells:${bentoCells}` +
        ` recents-pop:${recentsLinks}/${recents.length} recents-empty:${recentsCleared} empty-copy:${emptyCopy}` +
        ` ⌘K:${paletteHint} install-bar:${installBar} pricing:"${pricingTitle?.trim()}" — ${ok ? 'OK' : 'CHECK REQUIRED'}`,
    );
  }

  const real = errors.filter((e) => !insignificant(e));
  console.log(real.length ? `console errors:\n  ${real.join('\n  ')}` : 'no console errors (only expected dev-mode dashboard/layout noise)');
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});