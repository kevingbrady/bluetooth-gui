import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import CaptureViewerPage from './containers/CaptureViewerPage';
import DevicesPage from './containers/DevicesPage';
import ConnectionsPage from './containers/ConnectionsPage';

export default () => (
  <App>
    <div>
      <Switch>
        <Route path={routes.CONNECTIONS} component={ConnectionsPage} />
        <Route path={routes.DEVICES} component={DevicesPage} />
        <Route path={routes.CAPTURE_VIEWER} component={CaptureViewerPage} />
      </Switch>
    </div>
  </App>
);
