import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';

import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown icon="th-list" name="Entities" id="entity-menu" data-cy="entity" style={{ maxHeight: '80vh', overflow: 'auto' }}>
    <MenuItem icon="asterisk" to="/home">
      Home
    </MenuItem>
    <MenuItem icon="asterisk" to="/room">
      Room
    </MenuItem>
    <MenuItem icon="asterisk" to="/permission">
      Permission
    </MenuItem>
    <MenuItem icon="asterisk" to="/device">
      Device
    </MenuItem>
    <MenuItem icon="asterisk" to="/log">
      Log
    </MenuItem>
    <MenuItem icon="asterisk" to="/controller">
      Controller
    </MenuItem>
    <MenuItem icon="asterisk" to="/sensor">
      Sensor
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
