module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    // Add uuid to the list of modules that should be transformed
    'node_modules/(?!(uuid|react-native|@react-native|react-native-.*|@react-navigation/.*|@expo|expo|expo-.*)/)'
  ],
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './__mocks__/expoModulesMock.js'
  ],
  // Fix the moduleNameMapper regex pattern
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "expo-router": "<rootDir>/__mocks__/expo-router.js"
  }
};






