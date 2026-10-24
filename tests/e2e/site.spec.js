const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const homepages = ['', 'en/', 'th/'];
const articles = [
  'kasvit/amarantti/',
  'en/plants/amaranth/',
  'th/plants/amaranth/',
];

for (const route of [...homepages, ...articles]) {
  test(`loads ${route || 'Finnish homepage'} without browser errors`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const route of articles) {
  test(`${route} has working article navigation and audio`, async ({ page }) => {
    await page.goto(route);

    const toc = page.locator('[data-article-toc]');
    await expect(toc).toBeVisible();
    const tocSummary = toc.locator('summary');
    await tocSummary.click();
    const firstLink = toc.locator('a').first();
    await expect(firstLink).toBeVisible();
    const targetId = decodeURIComponent(new URL(await firstLink.getAttribute('href'), 'http://localhost').hash.slice(1));
    await expect(page.locator(`[id=${JSON.stringify(targetId)}]`)).toHaveCount(1);

    const playButton = page.locator('[data-audio-player] button');
    await playButton.click();
    await expect(playButton).toHaveAttribute('aria-pressed', 'true');
    await playButton.click();
    await expect(playButton).toHaveAttribute('aria-pressed', 'false');
  });

}

for (const route of [...homepages, ...articles]) {
  test(`${route || 'Finnish homepage'} meets automated WCAG 2.2 AA checks`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map(({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      elements: nodes.map(node => node.target),
    }))).toEqual([]);
  });
}

test('navigation is keyboard reachable and language links resolve', async ({ page }) => {
  await page.goto('kasvit/amarantti/');
  const languageNav = page.locator('.article-languages');
  const englishLink = languageNav.locator('a[hreflang="en"]');
  await expect(englishLink).toHaveAttribute('href', '/Ravinto/en/plants/amaranth/');
  await expect(languageNav.locator('a[hreflang="th"]')).toHaveAttribute('href', '/Ravinto/th/plants/amaranth/');
  for (const link of await languageNav.locator('a').all()) {
    const href = await link.getAttribute('href');
    expect((await page.request.get(href)).status()).toBe(200);
  }

  await englishLink.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/Ravinto\/en\/plants\/amaranth\//);

  const tocSummary = page.locator('[data-article-toc] summary');
  await tocSummary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-article-toc] a').first()).toBeVisible();

  const playButton = page.locator('[data-audio-player] button');
  await playButton.focus();
  await page.keyboard.press('Enter');
  await expect(playButton).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Enter');
  await expect(playButton).toHaveAttribute('aria-pressed', 'false');
});

test('sitemap is served as XML and points at Ravinto URLs', async ({ request }) => {
  const response = await request.get('sitemap.xml');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('xml');
  const sitemap = await response.text();
  expect(sitemap).toContain('https://ozirix-dev.github.io/Ravinto/');
  expect(sitemap).not.toContain('https://ozirix-dev.github.io/en/');
});
