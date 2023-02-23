import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Home from './home';
import HomeDetail from './home-detail';
import HomeUpdate from './home-update';
import HomeDeleteDialog from './home-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={HomeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={HomeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={HomeDetail} />
      <ErrorBoundaryRoute path={match.url} component={Home} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={HomeDeleteDialog} />
  </>
);

export default Routes;
