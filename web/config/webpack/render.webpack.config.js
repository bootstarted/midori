import {compose} from 'ramda';
import nodeExternals from 'webpack-node-externals';
import {output} from 'webpack-partial';

import base from './partial/base';

const createConfig = compose(
  output({
    library: 'render',
    libraryTarget: 'commonjs2',
  }),
  base({name: 'render', target: 'node'}),
);

export default createConfig({
  externals: [nodeExternals()],
});
