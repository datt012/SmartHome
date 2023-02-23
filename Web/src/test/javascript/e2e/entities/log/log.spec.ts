import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import LogComponentsPage from './log.page-object';
import LogUpdatePage from './log-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Log e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let logComponentsPage: LogComponentsPage;
  let logUpdatePage: LogUpdatePage;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();
    await signInPage.username.sendKeys(username);
    await signInPage.password.sendKeys(password);
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    logComponentsPage = new LogComponentsPage();
    logComponentsPage = await logComponentsPage.goToPage(navBarPage);
  });

  it('should load Logs', async () => {
    expect(await logComponentsPage.title.getText()).to.match(/Logs/);
    expect(await logComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Logs', async () => {
    const beforeRecordsCount = (await isVisible(logComponentsPage.noRecords)) ? 0 : await getRecordsCount(logComponentsPage.table);
    logUpdatePage = await logComponentsPage.goToCreateLog();
    await logUpdatePage.enterData();

    expect(await logComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(logComponentsPage.table);
    await waitUntilCount(logComponentsPage.records, beforeRecordsCount + 1);
    expect(await logComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await logComponentsPage.deleteLog();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(logComponentsPage.records, beforeRecordsCount);
      expect(await logComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(logComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
