import { Platform, Alert } from 'react-native';
import { showAlert } from '../../src/utils/alertUtils';

// Mock React Native's Alert and Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios', // 默认为iOS，可以在测试中修改
  },
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock window.alert and window.confirm for web tests
const mockAlert = jest.fn();
const mockConfirm = jest.fn();

Object.defineProperty(window, 'alert', {
  writable: true,
  value: mockAlert,
});

Object.defineProperty(window, 'confirm', {
  writable: true,
  value: mockConfirm,
});

describe('alertUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAlert.mockClear();
    mockConfirm.mockClear();
    (Alert.alert as jest.Mock).mockClear();
  });

  describe('showAlert on native platforms', () => {
    beforeEach(() => {
      (Platform as any).OS = 'ios';
    });

    it('should call Alert.alert with title and message', () => {
      showAlert('Test Title', 'Test Message');

      expect(Alert.alert).toHaveBeenCalledWith(
        'Test Title',
        'Test Message',
        [{ text: 'OK' }]
      );
    });

    it('should call Alert.alert with custom buttons', () => {
      const buttons = [
        { text: 'Cancel', style: 'cancel' as const },
        { text: 'OK', onPress: jest.fn() }
      ];

      showAlert('Test Title', 'Test Message', buttons);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Test Title',
        'Test Message',
        buttons
      );
    });

    it('should handle single button with onPress', () => {
      const onPress = jest.fn();
      const buttons = [{ text: 'OK', onPress }];

      showAlert('Test Title', 'Test Message', buttons);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Test Title',
        'Test Message',
        buttons
      );
    });

    it('should handle multiple buttons', () => {
      const onCancel = jest.fn();
      const onConfirm = jest.fn();
      const buttons = [
        { text: 'Cancel', style: 'cancel' as const, onPress: onCancel },
        { text: 'Delete', style: 'destructive' as const, onPress: onConfirm }
      ];

      showAlert('Delete Item', 'Are you sure?', buttons);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Delete Item',
        'Are you sure?',
        buttons
      );
    });
  });

  describe('showAlert on web platform', () => {
    beforeEach(() => {
      (Platform as any).OS = 'web';
    });

    it('should call window.alert for simple alert', () => {
      showAlert('Test Title', 'Test Message');

      expect(mockAlert).toHaveBeenCalledWith('Test Title\n\nTest Message');
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('should call window.alert and execute onPress for single button', () => {
      const onPress = jest.fn();
      const buttons = [{ text: 'OK', onPress }];

      showAlert('Test Title', 'Test Message', buttons);

      expect(mockAlert).toHaveBeenCalledWith('Test Title\n\nTest Message');
      expect(onPress).toHaveBeenCalled();
    });

    it('should call window.confirm for multiple buttons', () => {
      const onCancel = jest.fn();
      const onConfirm = jest.fn();
      const buttons = [
        { text: 'OK', onPress: onConfirm },
        { text: 'Cancel', style: 'cancel' as const, onPress: onCancel }
      ];

      mockConfirm.mockReturnValue(true); // User clicks OK

      showAlert('Test Title', 'Test Message', buttons);

      expect(mockConfirm).toHaveBeenCalledWith('Test Title\n\nTest Message');
      expect(onConfirm).toHaveBeenCalled();
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('should handle confirm dialog when user cancels', () => {
      const onCancel = jest.fn();
      const onConfirm = jest.fn();
      const buttons = [
        { text: 'OK', onPress: onConfirm },
        { text: 'Cancel', style: 'cancel' as const, onPress: onCancel }
      ];

      mockConfirm.mockReturnValue(false); // User clicks Cancel

      showAlert('Test Title', 'Test Message', buttons);

      expect(mockConfirm).toHaveBeenCalledWith('Test Title\n\nTest Message');
      expect(onCancel).toHaveBeenCalled();
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it('should handle confirm dialog without cancel button', () => {
      const onConfirm = jest.fn();
      const buttons = [
        { text: 'OK', onPress: onConfirm },
        { text: 'Delete', style: 'destructive' as const }
      ];

      mockConfirm.mockReturnValue(true);

      showAlert('Test Title', 'Test Message', buttons);

      expect(mockConfirm).toHaveBeenCalledWith('Test Title\n\nTest Message');
      expect(onConfirm).toHaveBeenCalled();
    });

    it('should handle confirm dialog when no buttons have onPress', () => {
      const buttons = [
        { text: 'OK' },
        { text: 'Cancel', style: 'cancel' as const }
      ];

      mockConfirm.mockReturnValue(true);

      showAlert('Test Title', 'Test Message', buttons);

      expect(mockConfirm).toHaveBeenCalledWith('Test Title\n\nTest Message');
      // Should not throw error when no onPress handlers
    });
  });

  describe('Edge cases', () => {

    it('should handle empty buttons array on web', () => {
      (Platform as any).OS = 'web';
      
      showAlert('Test Title', 'Test Message', []);

      expect(mockAlert).toHaveBeenCalledWith('Test Title\n\nTest Message');
    });

    it('should handle undefined buttons on native', () => {
      (Platform as any).OS = 'ios';
      
      showAlert('Test Title', 'Test Message', undefined);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Test Title',
        'Test Message',
        [{ text: 'OK' }]
      );
    });

    it('should handle undefined buttons on web', () => {
      (Platform as any).OS = 'web';
      
      showAlert('Test Title', 'Test Message', undefined);

      expect(mockAlert).toHaveBeenCalledWith('Test Title\n\nTest Message');
    });

    it('should handle empty title and message', () => {
      (Platform as any).OS = 'web';
      
      showAlert('', '');

      expect(mockAlert).toHaveBeenCalledWith('\n\n');
    });
  });

  describe('Button styles', () => {
    beforeEach(() => {
      (Platform as any).OS = 'web';
    });

    it('should prioritize non-cancel button for confirm action', () => {
      const onCancel = jest.fn();
      const onConfirm = jest.fn();
      const buttons = [
        { text: 'Cancel', style: 'cancel' as const, onPress: onCancel },
        { text: 'Delete', style: 'destructive' as const, onPress: onConfirm },
        { text: 'OK', onPress: jest.fn() }
      ];

      mockConfirm.mockReturnValue(true);

      showAlert('Test Title', 'Test Message', buttons);

      // Should call the first non-cancel button (Delete)
      expect(onConfirm).toHaveBeenCalled();
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('should handle multiple cancel buttons', () => {
      const onCancel1 = jest.fn();
      const onCancel2 = jest.fn();
      const buttons = [
        { text: 'Cancel1', style: 'cancel' as const, onPress: onCancel1 },
        { text: 'Cancel2', style: 'cancel' as const, onPress: onCancel2 }
      ];

      mockConfirm.mockReturnValue(false);

      showAlert('Test Title', 'Test Message', buttons);

      // Should call the first cancel button
      expect(onCancel1).toHaveBeenCalled();
      expect(onCancel2).not.toHaveBeenCalled();
    });
  });
});
