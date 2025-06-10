export const zh = {
  common: {
    minutes: '分钟',
    hours: '小时',
    days: '天',
    weeks: '周',
    months: '月',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    confirm: '确认',
    add: '添加',
    create: '创建',
    error: '错误',
    success: '成功'
  },
  tabs: {
    todo: '待办',
    habit: '习惯',
    diary: '日记',
    setting: '设置'
  },
  todo: {
    title: '待办事项',
    addNew: '添加新待办',
    editTitle: '编辑待办',
    deleteTitle: '删除待办事项',
    deleteConfirm: '确定要删除"{{content}}"吗？',
    dueDate: '截至',
    start: '开始',
    noData: '暂无待办数据',
  },
  habit: {
    title: '习惯追踪',
    addNew: '添加新习惯',
    editTitle: '编辑习惯',
    deleteTitle: '删除习惯',
    deleteConfirm: '确定要删除"{{content}}"吗？',
    createGroup: '创建新习惯组',
    groupName: '组名',
    period: '周期',
    startDate: '开始日期',
    endDate: '结束日期',
    frequency: '频率',
    unit: '单位',
    selectStartDate: '选择开始日期',
    selectEndDate: '选择结束日期',
    inputValue: '输入数值',
    noData: '暂无习惯数据',
    items: '个',
    periods: {
      daily: '每日',
      weekly: '每周',
      monthly: '每月',
      custom: '自定义'
    },
    units: {
      minutes: '分钟',
      hours: '小时',
      days: '天',
      weeks: '周',
      months: '月'
    },
    errors: {
      groupNameEmpty: '组名不能为空',
      startDateRequired: '请选择开始日期',
      endDateRequired: '请选择结束日期',
      frequencyRequired: '请输入有效的频率值（大于0）',
      createFailed: '创建失败',
      checkInput: '请检查输入是否正确'
    }
  },
  diary: {
    title: '日记',
    save: '保存日记',
    placeholder: '今天的日记...',
    todayRating: '今日评价',
    lastSaved: '上次保存',
    notSaved: '未保存',
    saveSuccess: '日记已保存',
    saveFailed: '保存失败',
    checkContent: '请检查输入内容是否正确'
  },
  settings: {
    title: '设置',
    language: '语言',
    sound: '声音提示',
    theme: '主题',
    general: '通用设置',
    soundNotification: '声音提示',
    enableReminders: 'Enable Reminders',
    remindBefore: 'Remind Before (minutes)',
    todoSettings: '待办设置',
    defaultTomatoTime: 'Default Tomato Time (minutes)',
    diarySettings: '日记设置',
    diaryTemplate: 'Diary Template',
    customDiaryTags: 'Custom Diary Tags',
    addTag: '+ Add Tag',
    resetData: '重置应用数据',
    resetConfirm: '重置确认',
    resetConfirmMessage: '确定要重置所有应用数据吗？此操作不可撤销。',
    confirmReset: '确定重置',
    languages: {
      zh: '简体中文',
      en: 'English',
      ja: '日本語'
    }
  },
  editTodo: {
    editHabit: '编辑习惯',
    editTodo: '编辑待办事项',
    newHabit: '新建习惯',
    newTodo: '新建待办事项',
    inputContent: '输入待办事项内容',
    setDueDate: '设置截止时间',
    today: '今日',
    thisWeek: '本周',
    needTimer: '需要计时',
    minutesPlaceholder: '分钟数 (≥1)',
    setRepeatCount: '设置重复次数',
    repeatCountPlaceholder: '重复次数 (≥2)',
    errors: {
      contentEmpty: '内容不能为空',
      dueDatePast: '截止时间必须晚于当前时间',
      tomatoTimeInvalid: '番茄时间必须大于0',
      targetCountInvalid: '目标次数必须大于0',
      groupNotSpecified: '未指定习惯组'
    }
  },
  timer: {
    title: '计时器',
    testSound: '测试声音',
    completeTimer: '完成计时',
    restartTimer: '重新计时',
    exitTimer: '退出计时',
    taskComplete: '任务完成',
    taskProgress: '任务进度',
    completed: '已经完成',
    completedCount: '已完成 {{current}}/{{total}} 次'
  }
};
