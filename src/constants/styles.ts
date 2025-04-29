// constants/styles.ts
import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2, // Android阴影
    shadowColor: '#000', // iOS阴影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  }
});