const puppeteer = require('puppeteer');

// Declare browser and page that will contain the demo page
let browser;
let page;

/**
 * This section is dedicated to tests the insertion of a formula in the froala3 demo.
 * It should test the MT formula insertion and the CT formula insertion
 */
describe('Insert Formula. TAG = Insert',
  () => {
    // Execute before all the file tests to define the browser with puppeteer
    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: false,
        timeout: 10000,
        devtools: false,
        slowMo: 0,
        defaultViewport: null,
      });
    });

    // Execute afterall the tests of the file to close the browser
    afterAll(async () => {
      browser.close();
    });

    // Execute before each test of the file to open the demo page
    beforeEach(async () => {
      jest.setTimeout(10000); // Large timeouts seem to be necessary. Default timeout to 5000ms
      page = (await browser.pages())[0]; // eslint-disable-line prefer-destructuring
      await page.goto('http://localhost:8004/', { waitUntil: 'load', timeout: 0 });
    });

    /**
     * Execute after each test of the file to close the demo page
     * to avoid boycott between different tests in the same file.
     */
    afterEach(async () => {
      await browser.newPage();
      page = (await browser.pages())[0]; // eslint-disable-line prefer-destructuring
      await page.close();
    });

    /**
     * Validate alignment of a formula after insertion
     * @TODO: Check the inserted elements are in the correct order
     */
    test('Insert Formula test', async () => {
      // Wait for the wiris plugin to be fully loaded
      await page.waitForSelector('#wirisEditor-1', { visible: true }); // eslint-disable-line

      // Write a text just at the beggining of the editor
      // and get the offset
      await page.type('[id="editor"] > div.fr-wrapper > div.fr-element', '2222', { delay: 0 }); // eslint-disable-line no-useless-escape
      // eslint-disable-next-line arrow-body-style
      const offsetText = await page.evaluate(() => {
        return document.getSelection().getRangeAt(0).startOffset;
      });

      // Insert a formula after the text writed before
      await page.click('#wirisEditor-1');
      await page.waitForSelector('[id="wrs_content_container\[0\]"] > div > div.wrs_formulaDisplayWrapper > div.wrs_formulaDisplay'); // eslint-disable-line no-useless-escape
      // wait for the wiris modal to be loaded
      await page.waitFor(1000);
      await page.type('[id="wrs_content_container\[0\]"] > div > div.wrs_formulaDisplayWrapper > div.wrs_formulaDisplay', '2+2', { delay: 0 }); // eslint-disable-line no-useless-escape
      await page.click('[id="wrs_modal_button_accept[0]"]');

      // Save the offset of the inserted formula
      const offsetFormula = await page.evaluate(() => { // eslint-disable-line arrow-body-style
        return document.getSelection().getRangeAt(0).startOffset;
      });
      expect(offsetText).toBe(4);
      expect(offsetFormula).toBe(2);
    });

    /**
     * Separar test nterior en dos per no tenir dos expect en 1
     * i així si falla, sabe ron i quin ha fallat
     */
    test('Test separate 1', async () => {
      await page.waitForSelector('#wirisEditor-1', { visible: true }); // eslint-disable-line
      await page.type('[id="editor"] > div.fr-wrapper > div.fr-element', '2222', { delay: 0 }); // eslint-disable-line no-useless-escape
      // eslint-disable-next-line arrow-body-style
      const offsetText = await page.evaluate(() => {
        return document.getSelection().getRangeAt(0).startOffset;
      });
      expect(offsetText).toBe(4);
    });

    /**
     * Validate alignment of a formula after insertion
     * @TODO: Check the inserted elements are in the correct order
     */
    test('Test separate 2', async () => {
      await page.waitForSelector('#wirisEditor-1', { visible: true }); // eslint-disable-line
      await page.type('[id="editor"] > div.fr-wrapper > div.fr-element', '2222', { delay: 0 }); // eslint-disable-line no-useless-escape
      await page.click('#wirisEditor-1');
      await page.waitForSelector('[id="wrs_content_container\[0\]"] > div > div.wrs_formulaDisplayWrapper > div.wrs_formulaDisplay'); // eslint-disable-line no-useless-escape
      await page.waitFor(1000);
      // wait for the wiris modal to be loaded
      await page.type('[id="wrs_content_container\[0\]"] > div > div.wrs_formulaDisplayWrapper > div.wrs_formulaDisplay', '1+2', { delay: 0 }); // eslint-disable-line no-useless-escape
      await page.click('[id="wrs_modal_button_accept[0]"]');
      // eslint-disable-next-line arrow-body-style
      const offsetFormula = await page.evaluate(() => {
        return document.getSelection().getRangeAt(0).startOffset;
      });
      expect(offsetFormula).toBe(2);
    });
  });
