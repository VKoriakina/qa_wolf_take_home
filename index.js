// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

function convertToMinutes(timeStr) {
  const [value, unit] = timeStr.split(' ');
  if (unit.startsWith('minute')) {
    return parseInt(value);
  } else if (unit.startsWith('hour')) {
    return parseInt(value) * 60;
  }
  return 0;
}

function isSortedByNewestToOldest(posts) {
  const first100Posts = posts.slice(0, 100);
  for (let i = 0; i < first100Posts.length - 1; i++) {
    const current = convertToMinutes(first100Posts[i]);
    const next = convertToMinutes(first100Posts[i + 1]);
    if (current > next) {
      return false;
    }
  }
  return true;
}

async function sortHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://news.ycombinator.com/newest");
  let allNewPosts = [];
  while (allNewPosts.length < 100) {
    const newPosts = await page.locator('//span[@class="age"]/child::*').allInnerTexts();
    allNewPosts = allNewPosts.concat(newPosts);
    if (allNewPosts.length < 100) {
      await page.locator('//a[@class="morelink"]').click();
      await page.waitForLoadState('networkidle');
    }
  }
  const first100NewPosts = allNewPosts.slice(0, 100);
  console.log("First 100 New Posts:", first100NewPosts);
  console.log("Total Number of First 100 New Posts:", first100NewPosts.length);

  const result = isSortedByNewestToOldest(first100NewPosts);
  console.log(`Are the first 100 articles sorted from newest to oldest? ${result ? 'Yes' : 'No'}`);

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
