// constants/styles.ts
import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';

// 提取通用的阴影样式函数
const getShadowStyle = (elevation = 2, webOpacity = 0.1, iosOpacity = 0.1) => {
  return Platform.OS === 'android' 
    ? { elevation } 
    : Platform.OS === 'web' 
      ? { boxShadow: `0px ${elevation}px ${elevation * 2}px rgba(0, 0, 0, ${webOpacity})` }
      : {
          shadowColor: `rgba(0, 0, 0, ${iosOpacity})`,
          shadowOffset: { width: 0, height: elevation },
          shadowOpacity: 1,
          shadowRadius: elevation * 2,
        };
};

export const CommonStyles = StyleSheet.create({
  // 基础容器样式
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  
  // 卡片样式
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    ...getShadowStyle(2, 0.1, 0.1),
  },
  
  // 按钮样式
  timerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 输入框样式
  input: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  
  // 标题样式
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  
  // 列表容器
  listContainer: {
    padding: 16,
  },
  
  // 列表项样式 (Todo和Habit共享)
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    ...getShadowStyle(2, 0.2, 0.2),
  },
  
  // 列表项内容容器
  contentContainer: {
    flex: 1,
    marginRight: 16,
  },
  
  // 信息容器
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // 列表项标题
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: Colors.text.primary,
  },
  
  // 已完成项目的文本样式
  doneText: {
    textDecorationLine: 'line-through',
    color: Colors.text.disabled,
  },
  
  // 日期显示容器
  dueDateContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  
  // 日期标签
  dueDateLabel: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  
  // 日期值
  dueDateValue: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  
  // 番茄时间容器
  tomatoTimeContainer: {
    width: 60,
    marginRight: 16,
    alignItems: 'center',
  },
  
  // 番茄时间文本
  tomatoTimeText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  
  // 计数容器
  countContainer: {
    width: 60,
    marginRight: 16,
    alignItems: 'center',
  },
  
  // 计数文本
  countText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  
  // 开始按钮
  startButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  
  // 开始按钮文本
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  // 禁用按钮
  disabledButton: {
    backgroundColor: Colors.text.disabled,
  },
  
  // 删除按钮
  deleteButton: {
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: '85%',
    borderRadius: 8,
    marginBottom: 12,
  },
  
  // 空状态容器
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // 空状态文本
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  
  // 模态框样式
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  modalContent: {
    width: '80%',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 20,
    ...getShadowStyle(5, 0.25, 0.25),
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.text.primary,
  },
  
  // 按钮行
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  
  // 通用按钮
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  
  // 按钮文本
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  // 分组容器
  groupContainer: {
    marginBottom: 16,
  },
  
  // 分组头部
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginBottom: 8,
    ...getShadowStyle(2, 0.2, 0.2),
  },
  
  // 分组头部右侧
  groupHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // 分组标题
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  
  // 分组计数
  groupCount: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: 8,
  },
  
  // 计时器容器
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 计时器文本
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  
  // 按钮容器
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  // 设置项容器
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  
  // 设置项文本
  settingText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  
  // 设置分组
  settingGroup: {
    marginBottom: 24,
  },
  
  // 日记输入框
  diaryInput: {
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlignVertical: 'top',
    height: 300,
  },
  
  // 日记卡片
  diaryCard: {
    backgroundColor: '#FFFEF0',
    minHeight: 300,
  },
  
  // 取消按钮
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  
  // 保存按钮
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  
  // 标题输入框
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  
  // 设置项行
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  // 周期选择器容器
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  // 周期选项
  periodOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  
  // 选中的周期选项
  selectedPeriod: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  
  // 周期文本
  periodText: {
    color: Colors.text.primary,
  },
  
  // 选中的周期文本
  selectedPeriodText: {
    color: 'white',
  },
  
  // 日期选择按钮
  datePickerButton: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  
  // 频率容器
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  // 频率输入容器
  frequencyInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  
  // 频率输入框
  frequencyInput: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  
  // 单位选择器容器
  unitSelectorContainer: {
    flex: 1,
    marginLeft: 8,
  },
  
  // 单位选择器
  unitSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  // 单位选项
  unitOption: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 4,
  },
  
  // 选中的单位
  selectedUnit: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  
  // 单位文本
  unitText: {
    fontSize: 12,
    color: Colors.text.primary,
  },
  
  // 选中的单位文本
  selectedUnitText: {
    color: 'white',
  },
  
  // 模态按钮容器
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  
  // 模态按钮
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  
  // 创建按钮
  createButton: {
    backgroundColor: Colors.primary,
  },
  
  // 输入标签
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.text.primary,
  },
  
  // 内容输入框
  contentInput: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  
  // 设置标签
  settingLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    flex: 1,
  },
  
  // 标签容器
  tagsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  
  // 标签行
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // 标签输入
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  
  // 移除标签按钮
  removeTag: {
    fontSize: 20,
    color: Colors.error,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  
  // 添加标签按钮
  addTag: {
    color: Colors.primary,
    fontSize: 14,
    marginTop: 8,
  },
  
  // 最后保存文本
  lastSavedText: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  
  // 区域样式
  section: {
    marginBottom: 20,
  },
  
  // 开关行样式
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // 标签样式
  label: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  
  // 日期选项行
  dateOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  
  // 输入行
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // 输入容器
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  
  // 数字输入
  numberInput: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  
  // 标签文本
  labelText: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.text.primary,
  },
  
  // 优先级滑块容器
  priorityContainer: {
    marginBottom: 20,
  },
  
  // 优先级标签
  priorityLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text.primary,
  },
  
  // 优先级值
  priorityValue: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  
  // 优先级描述
  priorityDescription: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  
  // 优先级滑块
  prioritySlider: {
    width: '100%',
  },
  
  // 优先级标记容器
  priorityMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  
  // 优先级标记
  priorityMarker: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  
  // 评分项
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  
  // 评分标签
  ratingLabel: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  
  // 评分控制
  ratingControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // 评分值输入框
  ratingValue: {
    marginLeft: 8,
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  
  // 文本输入
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    flex: 1,
  }
});
