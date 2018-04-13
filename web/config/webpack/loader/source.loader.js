import {custom as babel} from 'babel-loader';

module.exports = babel(() => {
  return {
    config({options}) {
      return {
        ...options,
        ast: true,
      };
    },
    result(result) {
      return {
        code: `
          export const ast = ${JSON.stringify(result.ast)};
          export const code = ${JSON.stringify(result.code)};
        `,
      };
    },
  };
});
