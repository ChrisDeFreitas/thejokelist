const log = console.log

const {Builder, By, Key, until} = require('selenium-webdriver');

log(`
selenium-webdriver test
- will open, then close browser to complete test
- no messages sent to console
`)

;(async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('http://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
})();