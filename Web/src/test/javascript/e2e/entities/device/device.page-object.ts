import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import DeviceUpdatePage from './device-update.page-object';

const expect = chai.expect;
export class DeviceDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('smartinumApp.device.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-device'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class DeviceComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('device-heading'));
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
    await navBarPage.getEntityPage('device');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateDevice() {
    await this.createButton.click();
    return new DeviceUpdatePage();
  }

  async deleteDevice() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const deviceDeleteDialog = new DeviceDeleteDialog();
    await waitUntilDisplayed(deviceDeleteDialog.deleteModal);
    expect(await deviceDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/smartinumApp.device.delete.question/);
    await deviceDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(deviceDeleteDialog.deleteModal);

    expect(await isVisible(deviceDeleteDialog.deleteModal)).to.be.false;
  }
}
