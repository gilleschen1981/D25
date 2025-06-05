/**
 * 生成日记模板内容
 * @param diaryTemplate 模板类型
 * @param date 日期字符串 (YYYY-MM-DD)
 * @param weather 天气信息
 * @param customTags 自定义评分标签
 * @returns 生成的日记模板内容
 */
export function generateDiaryTemplate(
  diaryTemplate: string,
  date: string,
  weather?: string,
  customTags: string[] = []
): { content: string; ratings: Record<string, number> } {
  // 创建模板内容
  const content = diaryTemplate === 'simple' 
    ? `${date}\t天气：${weather || ''}\n\n完成事项：\n\n心得体会：\n` 
    : diaryTemplate.replace('{日期}', date).replace('{天气}', weather || '');
  
  // 初始化评分
  const ratings: Record<string, number> = {};
  ratings['今日评价'] = 0;
  
  // 添加自定义标签
  customTags.forEach(tag => {
    ratings[tag] = 0;
  });
  
  return { content, ratings };
}