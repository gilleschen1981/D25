export const en = {
  common: {
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    weeks: 'weeks',
    months: 'months',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    add: 'Add',
    create: 'Create',
    error: 'Error',
    success: 'Success'
  },
  tabs: {
    todo: 'Todo',
    habit: 'Habits',
    diary: 'Diary',
    setting: 'Settings'
  },
  todo: {
    title: 'Todo',
    addNew: 'Add New Todo',
    editTitle: 'Edit Todo',
    deleteTitle: 'Delete Todo',
    deleteConfirm: 'Are you sure you want to delete "{{content}}"?',
    dueDate: 'Due',
    start: 'Start'
  },
  habit: {
    title: 'Habit Tracking',
    addNew: 'Add New Habit',
    editTitle: 'Edit Habit',
    deleteTitle: 'Delete Habit',
    deleteConfirm: 'Are you sure you want to delete "{{content}}"?',
    createGroup: 'Create New Habit Group',
    groupName: 'Group Name',
    period: 'Period',
    startDate: 'Start Date',
    endDate: 'End Date',
    frequency: 'Frequency',
    unit: 'Unit',
    selectStartDate: 'Select Start Date',
    selectEndDate: 'Select End Date',
    inputValue: 'Enter Value',
    noData: 'No habit data',
    items: 'items',
    periods: {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      custom: 'Custom'
    },
    units: {
      minutes: 'minutes',
      hours: 'hours',
      days: 'days',
      weeks: 'weeks',
      months: 'months'
    },
    errors: {
      groupNameEmpty: 'Group name cannot be empty',
      startDateRequired: 'Please select start date',
      endDateRequired: 'Please select end date',
      frequencyRequired: 'Please enter a valid frequency value (greater than 0)',
      createFailed: 'Creation failed',
      checkInput: 'Please check if the input is correct'
    }
  },
  diary: {
    title: 'Diary',
    save: 'Save Diary',
    placeholder: 'Today\'s diary...',
    todayRating: 'Today\'s Rating',
    lastSaved: 'Last Saved',
    notSaved: 'Not Saved',
    saveSuccess: 'Diary saved',
    saveFailed: 'Save failed',
    checkContent: 'Please check if the input content is correct'
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    sound: 'Sound Notifications',
    theme: 'Theme',
    general: 'General Settings',
    soundNotification: 'Sound Notifications',
    enableReminders: 'Enable Reminders',
    remindBefore: 'Remind Before (minutes)',
    todoSettings: 'Todo Settings',
    defaultTomatoTime: 'Default Tomato Time (minutes)',
    diarySettings: 'Diary Settings',
    diaryTemplate: 'Diary Template',
    customDiaryTags: 'Custom Diary Tags',
    addTag: '+ Add Tag',
    resetData: 'Reset App Data',
    resetConfirm: 'Reset Confirmation',
    resetConfirmMessage: 'Are you sure you want to reset all app data? This action cannot be undone.',
    confirmReset: 'Confirm Reset',
    languages: {
      zh: '简体中文',
      en: 'English',
      ja: '日本語'
    }
  },
  editTodo: {
    editHabit: 'Edit Habit',
    editTodo: 'Edit Todo',
    newHabit: 'New Habit',
    newTodo: 'New Todo',
    inputContent: 'Enter todo content',
    setDueDate: 'Set Due Date',
    today: 'Today',
    thisWeek: 'This Week',
    needTimer: 'Need Timer',
    minutesPlaceholder: 'Minutes (≥1)',
    setRepeatCount: 'Set Repeat Count',
    repeatCountPlaceholder: 'Repeat Count (≥2)',
    errors: {
      contentEmpty: 'Content cannot be empty',
      dueDatePast: 'Due date must be later than current time',
      tomatoTimeInvalid: 'Tomato time must be greater than 0',
      targetCountInvalid: 'Target count must be greater than 0',
      groupNotSpecified: 'Habit group not specified'
    }
  },
  timer: {
    title: 'Timer',
    testSound: 'Test Sound',
    completeTimer: 'Complete Timer',
    restartTimer: 'Restart Timer',
    exitTimer: 'Exit Timer',
    taskComplete: 'Task Complete',
    taskProgress: 'Task Progress',
    completed: 'completed',
    completedCount: 'Completed {{current}}/{{total}} times'
  }
};
