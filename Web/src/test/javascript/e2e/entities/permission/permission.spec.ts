import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import PermissionComponentsPage from './permission.page-object';
import PermissionUpdatePage from './permission-update.page-object';
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

describe('Permission e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let permissionComponentsPage: PermissionComponentsPage;
  let permissionUpdatePage: PermissionUpdatePage;
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
    permissionComponentsPage = new PermissionComponentsPage();
    permissionComponentsPage = await permissionComponentsPage.goToPage(navBarPage);
  });

  it('should load Permissions', async () => {
    expect(await permissionComponentsPage.title.getText()).to.match(/Permissions/);
    expect(await permissionComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Permissions', async () => {
    const beforeRecordsCount = (await isVisible(permissionComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(permissionComponentsPage.table);
    permissionUpdatePage = await permissionComponentsPage.goToCreatePermission();
    await permissionUpdatePage.enterData();

    expect(await permissionComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(permissionComponentsPage.table);
    await waitUntilCount(permissionComponentsPage.records, beforeRecordsCount + 1);
    expect(await permissionComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await permissionComponentsPage.deletePermission();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(permissionComponentsPage.records, beforeRecordsCount);
      expect(await permissionComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(permissionComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
