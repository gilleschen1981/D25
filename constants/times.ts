// constants/time.ts
export const TimePresets = [
    { label: '10分钟', value: 10 },
    { label: '25分钟', value: 25 },
    { label: '50分钟', value: 50 },
    { label: '60分钟', value: 60 },
    { label: '自定义', value: 0 }
  ];
  
  // 番茄钟默认配置
  export const TomatoConfig = {
    focusDuration: 25, // 分钟
    shortBreak: 5,
    longBreak: 15,
    rounds: 4
  };