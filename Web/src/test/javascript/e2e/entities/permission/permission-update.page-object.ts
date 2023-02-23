import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class PermissionUpdatePage {
  pageTitle: ElementFinder = element(by.id('smartinumApp.permission.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  permissionInput: ElementFinder = element(by.css('input#permission-permission'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setPermissionInput(permission) {
    await this.permissionInput.sendKeys(permission);
  }

  async getPermissionInput() {
    return this.permissionInput.getAttribute('value');
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }

  async enterData() {
    await waitUntilDisplayed(this.saveButton);
    await this.setPermissionInput('permission');
    expect(await this.getPermissionInput()).to.match(/permission/);
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
