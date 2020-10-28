module.exports.getWebpackConfig = (config, options) => ({
  ...config,
  entry: {
    ...config.entry,
    'monaco-kusto': '@kusto/monaco-kusto/release/esm/kusto.worker.js',
  },
  resolve: {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'vs/language/kusto/kustoMode': '@kusto/monaco-kusto/release/esm/kustoMode',
      'bridge.min': '@kusto/monaco-kusto/release/esm/bridge.min',
      'kusto.javascript.client.min': '@kusto/monaco-kusto/release/esm/kusto.javascript.client.min.js',
      'Kusto.Language.Bridge.min': '@kusto/monaco-kusto/release/esm/Kusto.Language.Bridge.min.js',
      'Kusto': '@kusto/monaco-kusto/release/esm/Kusto.Language.Bridge.min.js',
      'monaco.contribution': '@kusto/monaco-kusto/release/esm/monaco.contribution',
    },
  },
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /bridge\.js/,
        parser: { system: false },
      },
      {
        test: /kusto\.javascript\.client\.min\.js/,
        parser: { system: false },
      },
      {
        test: /Kusto\.Language\.Bridge\.min\.js/,
        parser: { system: false },
      },
      {
        test: /kustoLanguageService/,
        parser: { system: false },
        // loader: function loader(source) {
        //   source = `var Kusto = require("@kusto/language-service-next/Kusto.Language.Bridge.min");\n${source}`;
        //   return source.replace(/importScripts.*/g, '');
        // },
      },
      {
        test: /Kusto\.Language\.Bridge\.min/,
        loader: 'exports-loader?exports=window.Kusto!imports-loader?imports=bridge.min,kusto.javascript.client.min',
      },
      {
        test: /kustoMonarchLanguageDefinition/,
        loader: 'imports-loader?imports=Kusto',
      },
    ],
  },
});
