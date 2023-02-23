import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import SensorComponentsPage from './sensor.page-object';
import SensorUpdatePage from './sensor-update.page-object';
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

describe('Sensor e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let sensorComponentsPage: SensorComponentsPage;
  let sensorUpdatePage: SensorUpdatePage;
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
    sensorComponentsPage = new SensorComponentsPage();
    sensorComponentsPage = await sensorComponentsPage.goToPage(navBarPage);
  });

  it('should load Sensors', async () => {
    expect(await sensorComponentsPage.title.getText()).to.match(/Sensors/);
    expect(await sensorComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Sensors', async () => {
    const beforeRecordsCount = (await isVisible(sensorComponentsPage.noRecords)) ? 0 : await getRecordsCount(sensorComponentsPage.table);
    sensorUpdatePage = await sensorComponentsPage.goToCreateSensor();
    await sensorUpdatePage.enterData();

    expect(await sensorComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(sensorComponentsPage.table);
    await waitUntilCount(sensorComponentsPage.records, beforeRecordsCount + 1);
    expect(await sensorComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await sensorComponentsPage.deleteSensor();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(sensorComponentsPage.records, beforeRecordsCount);
      expect(await sensorComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(sensorComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
