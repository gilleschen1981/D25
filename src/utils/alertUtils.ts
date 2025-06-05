import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert function that works on both web and native platforms
 * 
 * @param title Alert title
 * @param message Alert message
 * @param buttons Optional buttons configuration (defaults to a single "OK" button)
 */
export function showAlert(
  title: string, 
  message: string, 
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>
) {
  if (Platform.OS === 'web') {
    // For web, use the browser's alert or confirm dialog
    if (!buttons || buttons.length <= 1) {
      // Simple alert with OK button
      window.alert(`${title}\n\n${message}`);
      
      // Call the onPress handler of the first button if it exists
      if (buttons && buttons[0] && buttons[0].onPress) {
        buttons[0].onPress();
      }
    } else {
      // Confirm dialog for multiple buttons
      const confirmResult = window.confirm(`${title}\n\n${message}`);
      
      // Find the appropriate button to trigger based on the result
      if (confirmResult) {
        // User clicked OK - find the non-cancel button (usually the first one)
        const confirmButton = buttons.find(btn => btn.style !== 'cancel');
        if (confirmButton && confirmButton.onPress) {
          confirmButton.onPress();
        }
      } else {
        // User clicked Cancel - find the cancel button
        const cancelButton = buttons.find(btn => btn.style === 'cancel');
        if (cancelButton && cancelButton.onPress) {
          cancelButton.onPress();
        }
      }
    }
  } else {
    // For native platforms, use React Native's Alert
    Alert.alert(
      title,
      message,
      buttons || [{ text: 'OK' }]
    );
  }
}