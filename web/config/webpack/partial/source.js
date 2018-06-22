import path from 'path';
import {loader} from 'webpack-partial';

const __DEV__ = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export default () => (config) => {
  return loader(
    {
      loader: require.resolve('../loader/source.loader'),
      include: [path.join(config.context, '..', 'src')],
      test: /\.js$/,
      options: {
        plugins: [
          '@babel/plugin-syntax-flow',
          '@babel/plugin-syntax-class-properties',
          '@babel/plugin-syntax-object-rest-spread',
        ],
        babelrc: false,
        cacheDirectory: __DEV__,
      },
    },
    config,
  );
};
