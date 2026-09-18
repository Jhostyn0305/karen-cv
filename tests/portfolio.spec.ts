import { test, expect } from '@playwright/test';

test('desktop: 3D, filters, modal and comparison controls', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Karen');
  await expect(page.locator('.skill-card')).toHaveCount(6);
  await expect(page.locator('.gallery-card:visible')).toHaveCount(3);
  await expect(page.locator('.comparison-disclosure')).not.toHaveAttribute('open');
  const experience = page.locator('.experience-item').first();
  await experience.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(experience.locator('.experience-description')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(experience.locator('.experience-description')).not.toBeVisible();
  await expect(page.locator('#tooth-scene')).toHaveClass(/scene-ready/, { timeout: 20000 });
  await page.getByRole('button', { name: 'Pausar movimiento' }).click();
  await expect(page.locator('#motion-toggle')).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Activar movimiento' }).click();
  await page.getByRole('button', { name: 'Sector anterior', exact: true }).click();
  await expect(page.locator('.gallery-card:visible')).toHaveCount(3);
  await expect(page.locator('.gallery-count')).toHaveText('3 registros fotográficos');
  await page.locator('.gallery-card:visible').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#dialog-title')).toHaveText('Detalle del sector anterior');
  await page.getByRole('button', { name: 'Registro siguiente', exact: true }).click();
  await expect(page.locator('#dialog-counter')).toHaveText('2 / 3');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#dialog-counter')).toHaveText('1 / 3');
  await page.getByRole('button', { name: 'Ampliar detalle', exact: true }).click();
  await expect(page.locator('.dialog-image-stage')).toHaveClass(/is-zoomed/);
  await page.getByRole('button', { name: 'Ver imagen completa', exact: true }).click();
  await expect(page.locator('.dialog-image-stage')).not.toHaveClass(/is-zoomed/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.gallery-card:visible').first()).toBeFocused();
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await expect(page.locator('.gallery-card:visible')).toHaveCount(3);
  await page.getByRole('button', { name: /Ver galería completa/ }).click();
  await expect(page.locator('.gallery-card:visible')).toHaveCount(8);
  await expect(page.locator('.gallery-more')).toBeHidden();
  await page.locator('.comparison-disclosure > summary').click();
  await page.getByRole('button', { name: 'Ver toma 1', exact: true }).click();
  await expect(page.getByRole('slider')).toHaveValue('0');
  await page.getByRole('button', { name: 'Ver toma 2', exact: true }).click();
  await expect(page.getByRole('slider')).toHaveValue('100');
  await page.getByRole('slider').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('slider')).toHaveValue('99');
  const box = await page.locator('.comparison').boundingBox();
  if (!box) throw new Error('Comparison missing');
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.73, box.y + box.height / 2, { steps: 10 });
  await page.mouse.up();
  expect(Number(await page.getByRole('slider').inputValue())).toBeGreaterThan(70);
  expect(Number(await page.getByRole('slider').inputValue())).toBeLessThan(76);
  await expect(page.locator('.comparison')).toHaveAttribute('style', /--split: 7/);
  await page.evaluate(async () => { await document.fonts.ready; });
  // Reveal each section before taking the full-page review image.
  for (const section of await page.locator('.reveal').all()) await section.scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.querySelectorAll<HTMLImageElement>('main img')).map(image => { image.loading = 'eager'; return image.decode(); }));
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'tmp/desktop.png', fullPage: true });
  await page.locator('.hero').screenshot({ path: 'tmp/hero.png' });
  await page.locator('.results-section').screenshot({ path: 'tmp/comparison.png' });
  await page.getByRole('button', { name: 'Registro 08', exact: true }).click();
  await expect(page.locator('.comparison-before-photo image')).toHaveAttribute('href', '/images/evidencias/8.jpg');
  await expect(page.getByRole('slider')).toHaveValue('50');
  await expect(page.locator('#comparison-original')).toHaveAttribute('href', '/images/evidencias/8.jpg');
  await page.locator('#galeria').screenshot({ path: 'tmp/clinical-gallery.png' });
  expect(errors).toEqual([]);
  const cv = await page.request.get('/documents/CV-Karen-Taimal.pdf');
  expect(cv.ok()).toBeTruthy();
});

test('mobile and reduced motion stay readable and operable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#tooth-scene')).toHaveClass(/scene-ready/, { timeout: 20000 });
  await expect(page.locator('#motion-toggle')).toBeDisabled();
  await expect(page.locator('#motion-toggle')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole('button', { name: 'Sector posterior', exact: true }).click();
  await expect(page.locator('.gallery-card:visible')).toHaveCount(3);
  await page.locator('.gallery-card:visible').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar imagen' }).click();
  await page.locator('.comparison-disclosure > summary').click();
  await page.getByRole('button', { name: 'Ver toma 2', exact: true }).click();
  await expect(page.getByRole('slider')).toHaveValue('100');
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.querySelectorAll<HTMLImageElement>('main img')).map(image => { image.loading = 'eager'; return image.decode(); }));
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'tmp/mobile.png', fullPage: true });
  await page.locator('.hero').screenshot({ path: 'tmp/mobile-hero.png' });
  for (const width of [360, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});

test('touch comparator responds to taps on mobile', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('http://localhost:4321');
  await page.locator('.comparison-disclosure > summary').click();
  await page.locator('.comparison').scrollIntoViewIfNeeded();
  const box = await page.locator('.comparison').boundingBox();
  if (!box) throw new Error('Comparison missing');
  await page.touchscreen.tap(box.x + box.width * 0.25, box.y + box.height / 2);
  const value = Number(await page.getByRole('slider').inputValue());
  expect(value).toBeGreaterThan(20);
  expect(value).toBeLessThan(30);
  await context.close();
});

test('WebGL unavailable retains the illustration and working content', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, type: string, ...args: any[]) {
      if (type.includes('webgl')) return null;
      return original.apply(this, [type, ...args] as any);
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.locator('.tooth-fallback')).toBeVisible();
  await page.locator('.comparison-disclosure > summary').click();
  await page.getByRole('button', { name: 'Ver toma 2', exact: true }).click();
  await expect(page.getByRole('slider')).toHaveValue('100');
});
