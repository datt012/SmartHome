import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Log from './log';
import LogDetail from './log-detail';
import LogUpdate from './log-update';
import LogDeleteDialog from './log-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={LogUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={LogUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={LogDetail} />
      <ErrorBoundaryRoute path={match.url} component={Log} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={LogDeleteDialog} />
  </>
);

export default Routes;
