import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import home, {
  HomeState
} from 'app/entities/home/home.reducer';
// prettier-ignore
import room, {
  RoomState
} from 'app/entities/room/room.reducer';
// prettier-ignore
import permission, {
  PermissionState
} from 'app/entities/permission/permission.reducer';
// prettier-ignore
import device, {
  DeviceState
} from 'app/entities/device/device.reducer';
// prettier-ignore
import log, {
  LogState
} from 'app/entities/log/log.reducer';
// prettier-ignore
import controller, {
  ControllerState
} from 'app/entities/controller/controller.reducer';
// prettier-ignore
import sensor, {
  SensorState
} from 'app/entities/sensor/sensor.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly home: HomeState;
  readonly room: RoomState;
  readonly permission: PermissionState;
  readonly device: DeviceState;
  readonly log: LogState;
  readonly controller: ControllerState;
  readonly sensor: SensorState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  home,
  room,
  permission,
  device,
  log,
  controller,
  sensor,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
});

export default rootReducer;
