export const ja = {
  common: {
    minutes: '分',
    hours: '時間',
    days: '日',
    weeks: '週間',
    months: '月',
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    confirm: '確認',
    add: '追加',
    create: '作成',
    error: 'エラー',
    success: '成功'
  },
  tabs: {
    todo: 'タスク',
    habit: '習慣',
    diary: '日記',
    setting: '設定'
  },
  todo: {
    title: 'タスク',
    addNew: '新しいタスクを追加',
    editTitle: 'タスクを編集',
    deleteTitle: 'タスクを削除',
    deleteConfirm: '"{{content}}"を削除してもよろしいですか？',
    dueDate: '期限',
    start: '開始',
    noData: 'タスクデータがありません',
  },
  habit: {
    title: '習慣トラッキング',
    addNew: '新しい習慣を追加',
    editTitle: '習慣を編集',
    deleteTitle: '習慣を削除',
    deleteConfirm: '"{{content}}"を削除してもよろしいですか？',
    createGroup: '新しい習慣グループを作成',
    groupName: 'グループ名',
    period: '期間',
    startDate: '開始日',
    endDate: '終了日',
    frequency: '頻度',
    unit: '単位',
    selectStartDate: '開始日を選択',
    selectEndDate: '終了日を選択',
    inputValue: '値を入力',
    noData: '習慣データがありません',
    items: '個',
    periods: {
      daily: '毎日',
      weekly: '毎週',
      monthly: '毎月',
      custom: 'カスタム'
    },
    units: {
      minutes: '分',
      hours: '時間',
      days: '日',
      weeks: '週',
      months: '月'
    },
    errors: {
      groupNameEmpty: 'グループ名を入力してください',
      startDateRequired: '開始日を選択してください',
      endDateRequired: '終了日を選択してください',
      frequencyRequired: '有効な頻度値を入力してください（0より大きい値）',
      createFailed: '作成に失敗しました',
      checkInput: '入力内容を確認してください'
    }
  },
  diary: {
    title: '日記',
    save: '日記を保存',
    placeholder: '今日の日記...',
    todayRating: '今日の評価',
    lastSaved: '最後に保存',
    notSaved: '未保存',
    saveSuccess: '日記を保存しました',
    saveFailed: '保存に失敗しました',
    checkContent: '入力内容を確認してください'
  },
  settings: {
    title: '設定',
    language: '言語',
    sound: '通知音',
    theme: 'テーマ',
    general: '一般設定',
    soundNotification: '通知音',
    enableReminders: 'リマインダーを有効にする',
    remindBefore: '事前通知（分）',
    todoSettings: 'タスク設定',
    defaultTomatoTime: 'デフォルトポモドーロ時間（分）',
    diarySettings: '日記設定',
    diaryTemplate: '日記テンプレート',
    customDiaryTags: 'カスタム日記タグ',
    addTag: '+ タグを追加',
    resetData: 'アプリデータをリセット',
    resetConfirm: 'リセット確認',
    resetConfirmMessage: 'すべてのアプリデータをリセットしてもよろしいですか？この操作は元に戻せません。',
    confirmReset: 'リセット確認',
    languages: {
      zh: '简体中文',
      en: 'English',
      ja: '日本語'
    }
  },
  editTodo: {
    editHabit: '習慣を編集',
    editTodo: 'タスクを編集',
    newHabit: '新しい習慣',
    newTodo: '新しいタスク',
    inputContent: 'タスク内容を入力',
    setDueDate: '期限を設定',
    today: '今日',
    thisWeek: '今週',
    needTimer: 'タイマーが必要',
    minutesPlaceholder: '分数（≥1）',
    setRepeatCount: '繰り返し回数を設定',
    repeatCountPlaceholder: '繰り返し回数（≥2）',
    errors: {
      contentEmpty: '内容を入力してください',
      dueDatePast: '期限は現在時刻より後に設定してください',
      tomatoTimeInvalid: 'ポモドーロ時間は0より大きくしてください',
      targetCountInvalid: '目標回数は0より大きくしてください',
      groupNotSpecified: '習慣グループが指定されていません'
    }
  },
  timer: {
    title: 'タイマー',
    testSound: 'サウンドテスト',
    completeTimer: 'タイマー完了',
    restartTimer: 'タイマー再開',
    exitTimer: 'タイマー終了',
    taskComplete: 'タスク完了',
    taskProgress: 'タスク進捗',
    completed: '完了しました',
    completedCount: '{{current}}/{{total}} 回完了'
  }
};
