import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import RoomUpdatePage from './room-update.page-object';

const expect = chai.expect;
export class RoomDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('smartinumApp.room.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-room'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class RoomComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('room-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('room');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateRoom() {
    await this.createButton.click();
    return new RoomUpdatePage();
  }

  async deleteRoom() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const roomDeleteDialog = new RoomDeleteDialog();
    await waitUntilDisplayed(roomDeleteDialog.deleteModal);
    expect(await roomDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/smartinumApp.room.delete.question/);
    await roomDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(roomDeleteDialog.deleteModal);

    expect(await isVisible(roomDeleteDialog.deleteModal)).to.be.false;
  }
}
