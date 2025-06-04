module.exports = {
  preset: 'react-native',  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [    // Add uuid to the list of modules that should be transformed
    'node_modules/(?!(uuid|react-native|@react-native|react-native-.*|@react-navigation/.*|@expo|expo|expo-.*)/)'  ],
  setupFiles: [    './node_modules/react-native-gesture-handler/jestSetup.js'
  ]
};






