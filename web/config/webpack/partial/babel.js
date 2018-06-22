import path from 'path';
import fs from 'fs';
import {loader} from 'webpack-partial';
import {map} from 'ramda';

const getTargets = (target) => {
  switch (target) {
    case 'node':
      return {node: 'current'};
    case 'web':
    default:
      return undefined;
  }
};

const __DEV__ = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export default () => (config) => {
  const babelConfig = JSON.parse(
    fs.readFileSync(path.join(config.context, '.babelrc')),
  );
  const target = config.target;
  return loader(
    {
      loader: 'babel-loader',
      include: [
        path.join(config.context, 'src'),
        path.join(config.context, 'lib'),
        path.join(config.context, 'config'),
      ],
      test: /\.js$/,
      options: {
        ...babelConfig,
        presets: map((entry) => {
          const [name, config] = Array.isArray(entry) ? entry : [entry, {}];
          if (name === '@babel/preset-env') {
            return [
              name,
              {
                ...config,
                modules: false,
                useBuiltIns: 'usage',
                ignoreBrowserslistConfig: target === 'node',
                targets: getTargets(target),
                include: [
                  ...(config.include || []),
                  // While newer versions of node support this, `webpack` does
                  // not because it uses `acorn`. So adjust accordingly.s
                  'proposal-object-rest-spread',
                ],
              },
            ];
          }
          return entry;
        }, babelConfig.presets),
        cacheDirectory: __DEV__,
      },
    },
    config,
  );
};
