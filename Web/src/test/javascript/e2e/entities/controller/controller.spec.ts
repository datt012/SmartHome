import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ControllerComponentsPage from './controller.page-object';
import ControllerUpdatePage from './controller-update.page-object';
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

describe('Controller e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let controllerComponentsPage: ControllerComponentsPage;
  let controllerUpdatePage: ControllerUpdatePage;
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
    controllerComponentsPage = new ControllerComponentsPage();
    controllerComponentsPage = await controllerComponentsPage.goToPage(navBarPage);
  });

  it('should load Controllers', async () => {
    expect(await controllerComponentsPage.title.getText()).to.match(/Controllers/);
    expect(await controllerComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Controllers', async () => {
    const beforeRecordsCount = (await isVisible(controllerComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(controllerComponentsPage.table);
    controllerUpdatePage = await controllerComponentsPage.goToCreateController();
    await controllerUpdatePage.enterData();

    expect(await controllerComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(controllerComponentsPage.table);
    await waitUntilCount(controllerComponentsPage.records, beforeRecordsCount + 1);
    expect(await controllerComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await controllerComponentsPage.deleteController();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(controllerComponentsPage.records, beforeRecordsCount);
      expect(await controllerComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(controllerComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
