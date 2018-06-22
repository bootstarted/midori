// Import modules ==============================================================
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router';
import {ServerStyleSheet, StyleSheetManager} from 'styled-components';

// Import components ===========================================================
import AppRoot from '/component/root/AppRoot';
import Page from '/component/static/Page';

// Import local utils ==========================================================
import extractAssets from './extractAssets';

const renderPage = (props) =>
  ReactDOMServer.renderToStaticMarkup(
    <Page rootElementId={AppRoot.rootElementId} {...props} />,
  );

const renderApp = async ({path, stats}) => {
  const routerContext = {};
  const sheet = new ServerStyleSheet();

  const markup = ReactDOMServer.renderToString(
    <StaticRouter location={path} context={routerContext}>
      <StyleSheetManager sheet={sheet.instance}>
        <AppRoot />
      </StyleSheetManager>
    </StaticRouter>,
  );

  if (routerContext.url) {
    const status = routerContext.action === 'REPLACE' ? 301 : 302;
    return {
      status,
      redirect: routerContext.url,
      markup: '',
    };
  }

  const page = renderPage({
    assets: extractAssets(stats),
    head: [sheet.getStyleElement()],
    markup,
  });
  return {
    status: routerContext.status || 200,
    markup: `<!DOCTYPE html>${page}`,
  };
};

export default renderApp;
