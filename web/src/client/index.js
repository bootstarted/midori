import {BrowserRouter} from 'react-router-dom';
import AppRoot from '/component/root/AppRoot';

const renderApp = () => {
  const root = document.getElementById(AppRoot.rootElementId);

  if (!root) {
    throw new Error('AppRoot root node missing');
  }

  ReactDOM.hydrate(
    <HeadProvider>
      <HeadPortal />
      <BrowserRouter>
        <AppRoot store={store} />
      </BrowserRouter>
    </HeadProvider>,
    root,
  );
};

renderApp();
