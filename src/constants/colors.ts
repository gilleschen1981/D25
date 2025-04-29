// constants/colors.ts
export const Colors = {
  // 主色调
  primary: '#2196F3',       // 按钮/高亮色
  secondary: '#4CAF50',    // 进行中状态
  background: '#F5F5F5',   // 页面背景
  surface: '#FFFFFF',      // 卡片背景
  text: {
    primary: '#212121',    // 主要文字
    secondary: '#757575',  // 次要文字
    disabled: '#BDBDBD',   // 禁用状态
  },
  status: {
    pending: '#FFC107',    // 待办状态
    done: '#9E9E9E',       // 完成状态
  },
  divider: '#E0E0E0',      // 分隔线
};

export const generateRandomLightColor = () => {
  // Generate light colors by keeping high values for RGB
  const r = 200 + Math.floor(Math.random() * 55);
  const g = 200 + Math.floor(Math.random() * 55);
  const b = 200 + Math.floor(Math.random() * 55);
  return `rgb(${r}, ${g}, ${b})`;
};