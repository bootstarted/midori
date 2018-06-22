// Import modules ==============================================================
import React from 'react';
import {filter, map, pipe, defaultTo} from 'ramda';
import serialize from 'htmlescape';

const scripts = pipe(
  defaultTo([]),
  filter((asset) => /\.js$/.test(asset.name)),
  map((asset) => <script src={asset.url} key={asset.name} />),
);

const styles = pipe(
  defaultTo([]),
  filter((asset) => /\.css$/.test(asset.name)),
  map((asset) => (
    <link rel="stylesheet" type="text/css" href={asset.url} key={asset.name} />
  )),
);

const Page = ({rootElementId, assets, markup, state, head}) => {
  // See: https://github.com/joshbuchea/HEAD
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          content="width=device-width, initial-scale=1.0, user-scalable=no"
          name="viewport"
        />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        {head}
        {styles(assets.index)}
      </head>
      <body>
        <div
          id={rootElementId}
          className="root"
          dangerouslySetInnerHTML={{__html: markup}}
        />
        {typeof state !== 'undefined' && (
          <script
            type="text/json"
            id="state"
            dangerouslySetInnerHTML={{__html: serialize(state)}}
          />
        )}
        {scripts(assets.index)}
      </body>
    </html>
  );
};

export default Page;
