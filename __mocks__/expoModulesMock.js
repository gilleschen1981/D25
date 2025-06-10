// Mock Expo native modules
jest.mock('expo-modules-core', () => ({
  NativeModulesProxy: {},
  EventEmitter: {
    addListener: jest.fn(),
    removeAllListeners: jest.fn(),
  },
}), { virtual: true });

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  useURL: jest.fn(),
}));

jest.mock('expo-font', () => ({
  useFonts: jest.fn().mockReturnValue([true, null]),
}));

jest.mock('expo-system-ui', () => ({}));

jest.mock('expo-web-browser', () => ({}));

jest.mock('expo-av', () => ({}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  documentDirectory: '/mock-document-directory/',
  readAsStringAsync: jest.fn().mockResolvedValue('{}'),
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
  deleteAsync: jest.fn().mockResolvedValue(undefined),
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true }),
  makeDirectoryAsync: jest.fn().mockResolvedValue(undefined),
  readDirectoryAsync: jest.fn().mockResolvedValue([]),
  downloadAsync: jest.fn().mockResolvedValue({ uri: 'downloaded-file-uri' }),
}));

// Mock @expo/vector-icons directly instead of requiring another file
jest.mock('@expo/vector-icons', () => {
  const createIconSet = (name) => {
    const IconComponent = (props) => ({
      type: 'Icon',
      props: {
        ...props,
        testID: `${name}-icon-${props.name || 'unknown'}`
      }
    });
    
    IconComponent.Button = (props) => ({
      type: 'IconButton',
      props: {
        ...props,
        testID: `${name}-icon-button-${props.name || 'unknown'}`
      }
    });
    
    return IconComponent;
  };

  return {
    AntDesign: createIconSet('AntDesign'),
    Entypo: createIconSet('Entypo'),
    EvilIcons: createIconSet('EvilIcons'),
    Feather: createIconSet('Feather'),
    FontAwesome: createIconSet('FontAwesome'),
    FontAwesome5: createIconSet('FontAwesome5'),
    Fontisto: createIconSet('Fontisto'),
    Foundation: createIconSet('Foundation'),
    Ionicons: createIconSet('Ionicons'),
    MaterialCommunityIcons: createIconSet('MaterialCommunityIcons'),
    MaterialIcons: createIconSet('MaterialIcons'),
    Octicons: createIconSet('Octicons'),
    SimpleLineIcons: createIconSet('SimpleLineIcons'),
    Zocial: createIconSet('Zocial'),
    createIconSet: () => createIconSet('Custom')
  };
});


