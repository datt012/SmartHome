import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import DeviceComponentsPage from './device.page-object';
import DeviceUpdatePage from './device-update.page-object';
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

describe('Device e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let deviceComponentsPage: DeviceComponentsPage;
  let deviceUpdatePage: DeviceUpdatePage;
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
    deviceComponentsPage = new DeviceComponentsPage();
    deviceComponentsPage = await deviceComponentsPage.goToPage(navBarPage);
  });

  it('should load Devices', async () => {
    expect(await deviceComponentsPage.title.getText()).to.match(/Devices/);
    expect(await deviceComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Devices', async () => {
    const beforeRecordsCount = (await isVisible(deviceComponentsPage.noRecords)) ? 0 : await getRecordsCount(deviceComponentsPage.table);
    deviceUpdatePage = await deviceComponentsPage.goToCreateDevice();
    await deviceUpdatePage.enterData();

    expect(await deviceComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(deviceComponentsPage.table);
    await waitUntilCount(deviceComponentsPage.records, beforeRecordsCount + 1);
    expect(await deviceComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await deviceComponentsPage.deleteDevice();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(deviceComponentsPage.records, beforeRecordsCount);
      expect(await deviceComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(deviceComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
