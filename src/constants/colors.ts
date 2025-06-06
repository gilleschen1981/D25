// constants/colors.ts
export const Colors = {
  primary: '#4CAF50',
  secondary: '#2196F3',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#F44336',
  divider: '#E0E0E0',
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
  },
};

export const generateRandomLightColor = () => {
  // 生成随机的浅色
  const r = Math.floor(Math.random() * 56) + 200; // 200-255
  const g = Math.floor(Math.random() * 56) + 200; // 200-255
  const b = Math.floor(Math.random() * 56) + 200; // 200-255
  return `rgb(${r}, ${g}, ${b})`;
};
