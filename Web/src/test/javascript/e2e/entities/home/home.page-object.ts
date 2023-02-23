import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import HomeUpdatePage from './home-update.page-object';

const expect = chai.expect;
export class HomeDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('smartinumApp.home.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-home'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class HomeComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('home-heading'));
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
    await navBarPage.getEntityPage('home');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateHome() {
    await this.createButton.click();
    return new HomeUpdatePage();
  }

  async deleteHome() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const homeDeleteDialog = new HomeDeleteDialog();
    await waitUntilDisplayed(homeDeleteDialog.deleteModal);
    expect(await homeDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/smartinumApp.home.delete.question/);
    await homeDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(homeDeleteDialog.deleteModal);

    expect(await isVisible(homeDeleteDialog.deleteModal)).to.be.false;
  }
}
