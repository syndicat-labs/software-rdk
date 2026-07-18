import { test, expect } from '@playwright/test';

// Inject a minimal non-expired JWT so the auth guard passes without a real backend.
// Payload: { sub: 'test-user', roles: ['admin'], exp: far future }
const FAKE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  btoa(JSON.stringify({ sub: 'test-user', roles: ['admin'], exp: 9999999999 })).replace(/=/g, '') +
  '.fake-signature';

async function injectAuth(page: any) {
  await page.goto('/');
  await page.evaluate((token: string) => {
    localStorage.setItem('rdk_access_token', token);
    localStorage.setItem('rdk_refresh_token', token);
  }, FAKE_JWT);
}

test.describe.serial('New showcase pages', () => {
  test('invoice variants — all 6 variants render', async ({ page }) => {
    await injectAuth(page);
    await page.goto('/showcase/new-design-ideas/invoice-variants');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/invoice-variants.png', fullPage: true });

    for (const num of ['/01', '/02', '/03', '/04', '/05', '/06']) {
      await expect(page.getByText(num)).toBeVisible();
    }
    await expect(page.getByText('Document Split')).toBeVisible();
    await expect(page.getByText('Dark Financial Anchor')).toBeVisible();
    await expect(page.getByText('Industrial Spec Sheet')).toBeVisible();
  });

  test('frosted glass — token strip and both surface sections render', async ({ page }) => {
    await injectAuth(page);
    await page.goto('/showcase/new-design-ideas/frosted-glass');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/frosted-glass.png', fullPage: true });

    await expect(page.getByText('On dark surfaces')).toBeVisible();
    await expect(page.getByText('On light / neutral surfaces')).toBeVisible();
    await expect(page.getByText('--obs-surface-glass').first()).toBeVisible();
    await expect(page.getByText('Glass surface rules')).toBeVisible();
  });
});
