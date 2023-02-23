import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import ControllerUpdatePage from './controller-update.page-object';

const expect = chai.expect;
export class ControllerDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('smartinumApp.controller.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-controller'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class ControllerComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('controller-heading'));
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
    await navBarPage.getEntityPage('controller');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateController() {
    await this.createButton.click();
    return new ControllerUpdatePage();
  }

  async deleteController() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const controllerDeleteDialog = new ControllerDeleteDialog();
    await waitUntilDisplayed(controllerDeleteDialog.deleteModal);
    expect(await controllerDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/smartinumApp.controller.delete.question/);
    await controllerDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(controllerDeleteDialog.deleteModal);

    expect(await isVisible(controllerDeleteDialog.deleteModal)).to.be.false;
  }
}
