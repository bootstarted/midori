import {compose, assoc, identity} from 'ramda';
import nearest from 'find-nearest-file';
import path from 'path';
import webpack from 'webpack';

import {output, plugin} from 'webpack-partial';

import babel from './babel';
import source from './source';

import CleanPlugin from 'clean-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

const context = path.dirname(nearest('package.json'));
const __DEV__ = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const normalizePublicPath = (path) => {
  if (path.charAt(path.length - 1) !== '/') {
    return `${path}/`;
  }
  return path;
};

// eslint-disable-next-line complexity
const base = ({name, target, prefix = ''}) => {
  return compose(
    (config) =>
      plugin(
        new CleanPlugin([config.output.path], {
          root: config.context,
        }),
        config,
      ),

    plugin(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ),

    assoc('mode', __DEV__ ? 'development' : 'production'),

    assoc('devtool', __DEV__ || target === 'node' ? 'source-map' : 'false'),

    plugin(new webpack.HashedModuleIdsPlugin()),
    __DEV__ ? plugin(new CaseSensitivePathsPlugin()) : identity,

    babel(),
    source(),

    // ========================================================================
    // Optimization
    // ========================================================================
    __DEV__
      ? identity
      : compose(plugin(new webpack.optimize.ModuleConcatenationPlugin())),

    // ========================================================================
    // Output Settings
    // ========================================================================
    output({
      publicPath: normalizePublicPath(process.env.ASSET_URL || prefix),
      path: path.join(context, 'dist', name),
      ...(!__DEV__ && target === 'web'
        ? {
            filename: path.join(prefix, '[name].[hash].js'),
            chunkFilename: path.join(prefix, '[name].[hash].js'),
          }
        : {
            filename: path.join(prefix, '[name].js'),
            chunkFilename: path.join(prefix, '[name].js'),
          }),
    }),

    // Define the build root context as the nearest directory containing a
    // `package.json` file. This is be the absolute path to the project root.
    assoc('context', context),
    assoc('target', target),
    assoc('name', name),

    // Define an entry chunk. A `name` property must be defined on the initial
    // config object.
    assoc('entry', {
      index: [
        ...(__DEV__ || target === 'node'
          ? [require.resolve('source-map-support/register')]
          : []),
        path.join(context, 'src', `${name}`),
      ],
    }),
  );
};

export default base;
