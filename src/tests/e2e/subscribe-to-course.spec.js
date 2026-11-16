/* eslint-disable no-undef */
// @ts-check
import { test, expect } from '@playwright/test';

const USER_EMAIL = process.env.E2E_USER_EMAIL || process.env.E2E_ADMIN_EMAIL;
const USER_PASSWORD =
  process.env.E2E_USER_PASSWORD || process.env.E2E_ADMIN_PASSWORD;

if (!USER_EMAIL || !USER_PASSWORD) {
  throw new Error(
    'Missing E2E credentials. Define E2E_USER_EMAIL/E2E_USER_PASSWORD (or E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD) in .env.e2e.'
  );
}

test('user explores available courses by subject, subscribes, inspects course topics and unsubscribes', async ({
  page,
}) => {
  let targetCourseName = '';

  await test.step('user logs in', async () => {
    await page.goto('/login');

    await page.getByPlaceholder('pepe@garcia.com').fill(USER_EMAIL);
    await page.getByPlaceholder('********').fill(USER_PASSWORD);
    await expect(
      page.locator('input[name="cf-turnstile-response"]')
    ).toHaveValue(/.+/, { timeout: 15_000 });

    const [loginResponse] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/auth/login') && res.request().method() === 'POST'
      ),
      page.getByRole('button', { name: 'Ingresar' }).click(),
    ]);

    const body = await loginResponse.text();
    expect(loginResponse.status(), `Login failed: ${body}`).toBe(200);

    await expect(page).toHaveURL('/');
  });

  await test.step('explorar cursos disponibles y elegir materia', async () => {
    await page.getByRole('link', { name: 'Suscripciones' }).click();
    await expect(page).toHaveURL('/subscriptions');
    await expect(
      page.getByRole('heading', { name: 'Suscripciones' })
    ).toBeVisible();

    const availableCourseCard = page
      .locator('[data-slot="card"]')
      .filter({ has: page.getByRole('button', { name: 'Suscribirme' }) })
      .first();

    await expect(
      availableCourseCard,
      'Debe existir al menos un curso creado por otro usuario disponible para suscribirse'
    ).toBeVisible();

    targetCourseName =
      (await availableCourseCard
        .locator('[data-slot="card-title"]')
        .innerText()) || '';

    const searchInput = page.getByPlaceholder('Buscar por materia o autor...');
    await searchInput.fill(targetCourseName);
    await expect(availableCourseCard).toBeVisible();
  });

  await test.step('suscribirse al curso seleccionado', async () => {
    const courseCard = page
      .locator('[data-slot="card"]')
      .filter({ hasText: targetCourseName })
      .first();

    const [subscribeResponse] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/course-subscriptions') &&
          res.request().method() === 'POST'
      ),
      courseCard.getByRole('button', { name: 'Suscribirme' }).click(),
    ]);

    expect([200, 201]).toContain(subscribeResponse.status());
    await expect(
      courseCard.getByRole('button', { name: /Suscripto · Abrir/i })
    ).toBeVisible();
  });

  await test.step('acceder al curso suscripto y verificar sus temas', async () => {
    const courseCard = page
      .locator('[data-slot="card"]')
      .filter({ hasText: targetCourseName })
      .first();

    await courseCard
      .getByRole('button', { name: /Suscripto · Abrir/i })
      .click();

    await expect(page).toHaveURL(/\/subscriptions\/[^/]+$/);
    await expect(
      page.getByRole('heading', { name: targetCourseName })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Temas' })).toBeVisible();
  });

  await test.step('limpieza: darse de baja del curso para dejar el estado inicial', async () => {
    await page
      .getByRole('button', { name: '← Volver a Suscripciones' })
      .click();
    await expect(page).toHaveURL('/subscriptions');

    await page.getByRole('button', { name: /Mis suscripciones/i }).click();

    const subscribedCard = page
      .locator('[data-slot="card"]')
      .filter({ hasText: targetCourseName })
      .first();

    await subscribedCard.getByRole('button', { name: 'Darme de baja' }).click();

    const dialog = page.getByRole('dialog');
    await expect(
      dialog.getByText(`¿Deseas darte de baja del curso "${targetCourseName}"?`)
    ).toBeVisible();
    await dialog.getByRole('button', { name: 'Confirmar' }).click();

    await expect(dialog).toBeHidden();
  });
});
