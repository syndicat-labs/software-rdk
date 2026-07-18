import { test, expect } from '@playwright/test';

test.describe('Smoke — unauthenticated flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear tokens before each test so the app always starts unauthenticated.
    // Navigate to / first so localStorage is accessible, then reload to
    // re-bootstrap the Angular app after the clear.
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('landing page renders hero headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('protected route /app/dashboard redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/app/dashboard');
    // Angular SPA route guard runs after bootstrap — wait for redirect
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page renders sign-in form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('login shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/required/i).first()).toBeVisible();
  });

  test('login shows error for invalid email format', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Email').blur();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('showcase route redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/showcase');
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });
});
