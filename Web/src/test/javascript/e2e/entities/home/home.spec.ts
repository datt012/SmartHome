import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import HomeComponentsPage from './home.page-object';
import HomeUpdatePage from './home-update.page-object';
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

describe('HomePage e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let homeComponentsPage: HomeComponentsPage;
  let homeUpdatePage: HomeUpdatePage;
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
    homeComponentsPage = new HomeComponentsPage();
    homeComponentsPage = await homeComponentsPage.goToPage(navBarPage);
  });

  it('should load Homes', async () => {
    expect(await homeComponentsPage.title.getText()).to.match(/Homes/);
    expect(await homeComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Homes', async () => {
    const beforeRecordsCount = (await isVisible(homeComponentsPage.noRecords)) ? 0 : await getRecordsCount(homeComponentsPage.table);
    homeUpdatePage = await homeComponentsPage.goToCreateHome();
    await homeUpdatePage.enterData();

    expect(await homeComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(homeComponentsPage.table);
    await waitUntilCount(homeComponentsPage.records, beforeRecordsCount + 1);
    expect(await homeComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await homeComponentsPage.deleteHome();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(homeComponentsPage.records, beforeRecordsCount);
      expect(await homeComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(homeComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
