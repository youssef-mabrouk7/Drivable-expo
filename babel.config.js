module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'react-native' }]
    ],
    plugins: [
      'react-native-reanimated/plugin',
      '@babel/plugin-transform-template-literals',
    ],
  };
}; 