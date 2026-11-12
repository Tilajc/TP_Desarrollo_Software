/* eslint-disable no-undef */
// @ts-check
import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error(
    'Missing E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD. Define them in .env.e2e or as environment variables.'
  );
}

test('admin logs in, creates a subject and a topic, then deletes the subject (cascade)', async ({
  page,
}) => {
  const runId = Date.now();
  const subjectName = `E2E Subject ${runId}`;
  const topicName = `E2E Topic ${runId}`;

  const subjectCard = page
    .locator('[data-slot="card"]')
    .filter({ hasText: subjectName });
  const topicCard = page
    .locator('[data-slot="card"]')
    .filter({ hasText: topicName });

  await test.step('admin logs in', async () => {
    await page.goto('/login');

    await page.getByPlaceholder('pepe@garcia.com').fill(ADMIN_EMAIL);
    await page.getByPlaceholder('********').fill(ADMIN_PASSWORD);
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
    await expect(page.getByRole('button', { name: 'Usuarios' })).toBeVisible();
  });

  await test.step('admin creates a subject', async () => {
    await page.getByRole('link', { name: 'Materias' }).click();
    await expect(page).toHaveURL('/subjects');
    await expect(page.getByRole('heading', { name: 'Materias' })).toBeVisible();

    await page.getByRole('button', { name: '+ Crear Materia' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Nueva Materia')).toBeVisible();
    await dialog.getByLabel('Nombre de la Materia').fill(subjectName);
    await dialog
      .getByLabel('Descripción')
      .fill('Created by the Playwright e2e test');
    await dialog.getByRole('button', { name: 'Confirmar' }).click();

    await expect(dialog).toBeHidden();
    await expect(subjectCard).toBeVisible();
  });

  await test.step('admin creates a topic inside the subject', async () => {
    await subjectCard.getByRole('button', { name: 'Temas' }).click();
    await expect(page).toHaveURL(/\/subjects\/[^/]+\/topics$/);
    await expect(
      page.getByRole('heading', { name: `Temas de ${subjectName}` })
    ).toBeVisible();

    await page.getByRole('button', { name: '+ Crear Tema' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Nuevo Tema')).toBeVisible();
    await dialog.getByLabel('Nombre del Tema').fill(topicName);
    await dialog.getByRole('button', { name: 'Confirmar' }).click();

    await expect(dialog).toBeHidden();
    await expect(topicCard).toBeVisible();
  });

  await test.step('admin deletes the subject, which also deletes its topics', async () => {
    const topicsUrl = page.url();

    await page.getByRole('button', { name: '← Volver a Materias' }).click();
    await expect(page).toHaveURL('/subjects');
    await expect(subjectCard).toBeVisible();

    await subjectCard.locator('[data-variant="destructive"]').click();

    const dialog = page.getByRole('dialog');
    await expect(
      dialog.getByText(`¿Deseas eliminar la materia "${subjectName}"?`)
    ).toBeVisible();
    await dialog.getByRole('button', { name: 'Confirmar' }).click();

    await expect(dialog).toBeHidden();
    await expect(subjectCard).toHaveCount(0);

    await page.goto(topicsUrl);
    await expect(page.getByText(topicName)).toHaveCount(0);
  });
});
