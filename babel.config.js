module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      // Add Tamagui Babel plugin here
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'], // Include Tamagui components
          config: './tamagui.config.ts', // Path to Tamagui config file
          logTimings: true,
          // Adjust disableExtraction as needed for your environment
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
      // Add other plugins as needed
    ],
  };
};
