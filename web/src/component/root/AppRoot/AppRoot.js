// Import modules ==============================================================
import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';
import {compose} from 'ramda';
import {hot} from 'react-hot-loader';

// Import components ===========================================================
import LandingView from '/component/view/LandingView';
import ApiReferenceView from '/component/view/ApiReferenceView';
import ExamplesView from '/component/view/ExamplesView';
import GettingStartedView from '/component/view/GettingStartedView';
import NotFoundView from '/component/view/NotFoundView';

import * as theme from '/config/theme.config';

import '/globalStyles';

const AppRoot = () => {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/" component={LandingView} />
          <Route path="/api-reference" component={ApiReferenceView} />
          <Route path="/examples" component={ExamplesView} />
          <Route path="/getting-started" component={GettingStartedView} />
          <Route component={NotFoundView} />
        </Switch>
      </ThemeProvider>
    </React.Fragment>
  );
};

AppRoot.rootElementId = 'app';

export default compose(hot(module))(AppRoot);

if (module.hot) {
  if (module.hot.status() === 'apply') {
    // eslint-disable-next-line no-console
    console.log('🚒  Hot reload AppRoot');
  }
}
