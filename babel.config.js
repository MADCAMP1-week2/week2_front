module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // ← 반드시 마지막 줄에 위치할 것
};
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:metro-react-native-babel-preset'], 
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@screens':    './src/screens',
            '@components': './src/components',
            '@hooks':      './src/hooks',
            '@api':        './src/api',
            '@store':      './src/store',
            '@services':   './src/services',
            '@contexts':   './src/contexts',
          },
          extensions: [
            '.js',
            '.jsx',
            '.json',
          ],
        },
      ],

      'react-native-reanimated/plugin',
    ],
  };
};
