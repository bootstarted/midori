import {compose} from 'ramda';
import {join} from 'path';
import {plugin} from 'webpack-partial';
import PagesPlugin from 'pages-webpack-plugin';

import base from './partial/base';

const createConfig = compose((config) => {
  return plugin(
    new PagesPlugin({
      name: '[path][name].[ext]',
      paths: ['/', '/error/404', '/error/500'],
      mapStatsToProps: (stats) => {
        return {stats: stats.toJson({assets: true, chunks: true})};
      },
      render: require(join(config.context, 'dist', 'render')).default,
    }),
    config,
  );
}, base({name: 'client', target: 'web', prefix: 'asset'}));

export default createConfig({});
