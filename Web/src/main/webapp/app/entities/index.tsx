import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Home from './home';
import Room from './room';
import Permission from './permission';
import Device from './device';
import Log from './log';
import Controller from './controller';
import Sensor from './sensor';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}home`} component={Home} />
      <ErrorBoundaryRoute path={`${match.url}room`} component={Room} />
      <ErrorBoundaryRoute path={`${match.url}permission`} component={Permission} />
      <ErrorBoundaryRoute path={`${match.url}device`} component={Device} />
      <ErrorBoundaryRoute path={`${match.url}log`} component={Log} />
      <ErrorBoundaryRoute path={`${match.url}controller`} component={Controller} />
      <ErrorBoundaryRoute path={`${match.url}sensor`} component={Sensor} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
