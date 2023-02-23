import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import RoomComponentsPage from './room.page-object';
import RoomUpdatePage from './room-update.page-object';
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

describe('Room e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let roomComponentsPage: RoomComponentsPage;
  let roomUpdatePage: RoomUpdatePage;
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
    roomComponentsPage = new RoomComponentsPage();
    roomComponentsPage = await roomComponentsPage.goToPage(navBarPage);
  });

  it('should load Rooms', async () => {
    expect(await roomComponentsPage.title.getText()).to.match(/Rooms/);
    expect(await roomComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Rooms', async () => {
    const beforeRecordsCount = (await isVisible(roomComponentsPage.noRecords)) ? 0 : await getRecordsCount(roomComponentsPage.table);
    roomUpdatePage = await roomComponentsPage.goToCreateRoom();
    await roomUpdatePage.enterData();

    expect(await roomComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(roomComponentsPage.table);
    await waitUntilCount(roomComponentsPage.records, beforeRecordsCount + 1);
    expect(await roomComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await roomComponentsPage.deleteRoom();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(roomComponentsPage.records, beforeRecordsCount);
      expect(await roomComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(roomComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
