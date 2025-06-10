import { generateDiaryTemplate } from '../../src/utils/diaryUtils';

describe('diaryUtils', () => {
  describe('generateDiaryTemplate', () => {
    const testDate = '2024-01-15';
    const testWeather = '晴天';

    describe('Simple template', () => {
      it('should generate simple template with date and weather', () => {
        const result = generateDiaryTemplate('simple', testDate, testWeather);

        expect(result.content).toBe(`${testDate}\t天气：${testWeather}\n\n完成事项：\n\n心得体会：\n`);
        expect(result.ratings).toEqual({ '今日评价': 0 });
      });

      it('should generate simple template without weather', () => {
        const result = generateDiaryTemplate('simple', testDate);

        expect(result.content).toBe(`${testDate}\t天气：\n\n完成事项：\n\n心得体会：\n`);
        expect(result.ratings).toEqual({ '今日评价': 0 });
      });

      it('should generate simple template with empty weather', () => {
        const result = generateDiaryTemplate('simple', testDate, '');

        expect(result.content).toBe(`${testDate}\t天气：\n\n完成事项：\n\n心得体会：\n`);
        expect(result.ratings).toEqual({ '今日评价': 0 });
      });
    });

    describe('Custom template', () => {
      it('should replace placeholders in custom template', () => {
        const customTemplate = '日期：{日期}\n天气：{天气}\n今天的心情如何？';
        const result = generateDiaryTemplate(customTemplate, testDate, testWeather);

        expect(result.content).toBe(`日期：${testDate}\n天气：${testWeather}\n今天的心情如何？`);
        expect(result.ratings).toEqual({ '今日评价': 0 });
      });

      it('should handle template with only date placeholder', () => {
        const customTemplate = '今天是{日期}，发生了很多事情。';
        const result = generateDiaryTemplate(customTemplate, testDate, testWeather);

        expect(result.content).toBe(`今天是${testDate}，发生了很多事情。`);
        expect(result.ratings).toEqual({ '今日评价': 0 });
      });

      it('should handle template with only weather placeholder', () => {
        const customTemplate = '今天天气{天气}，心情不错。';
        const result = generateDiaryTemplate(customTemplate, testDate, testWeather);

        expect(result.content).toBe(`今天天气${testWeather}，心情不错。`);
        expect(result.ratings).toEqual({ '今日评价': 0 });
      });

      it('should handle template without placeholders', () => {
        const customTemplate = '这是一个固定的模板内容。';
        const result = generateDiaryTemplate(customTemplate, testDate, testWeather);

        expect(result.content).toBe('这是一个固定的模板内容。');
        expect(result.ratings).toEqual({ '今日评价': 0 });
      });

      it('should handle template with multiple same placeholders', () => {
        const customTemplate = '日期{日期}，再次提醒日期是{日期}。';
        const result = generateDiaryTemplate(customTemplate, testDate, testWeather);

        expect(result.content).toBe(`日期${testDate}，再次提醒日期是${testDate}。`);
        expect(result.ratings).toEqual({ '今日评价': 0 });
      });

      it('should handle empty custom template', () => {
        const result = generateDiaryTemplate('', testDate, testWeather);

        expect(result.content).toBe('');
        expect(result.ratings).toEqual({ '今日评价': 0 });
      });
    });

    describe('Custom tags', () => {
      it('should add custom tags to ratings', () => {
        const customTags = ['心情', '工作效率', '健康状况'];
        const result = generateDiaryTemplate('simple', testDate, testWeather, customTags);

        expect(result.ratings).toEqual({
          '今日评价': 0,
          '心情': 0,
          '工作效率': 0,
          '健康状况': 0
        });
      });

      it('should handle empty custom tags array', () => {
        const result = generateDiaryTemplate('simple', testDate, testWeather, []);

        expect(result.ratings).toEqual({ '今日评价': 0 });
      });

      it('should handle custom tags with empty strings', () => {
        const customTags = ['心情', '', '工作效率'];
        const result = generateDiaryTemplate('simple', testDate, testWeather, customTags);

        expect(result.ratings).toEqual({
          '今日评价': 0,
          '心情': 0,
          '': 0,
          '工作效率': 0
        });
      });

      it('should handle duplicate custom tags', () => {
        const customTags = ['心情', '心情', '工作效率'];
        const result = generateDiaryTemplate('simple', testDate, testWeather, customTags);

        // 后面的重复标签会覆盖前面的
        expect(result.ratings).toEqual({
          '今日评价': 0,
          '心情': 0,
          '工作效率': 0
        });
      });

      it('should handle custom tags with special characters', () => {
        const customTags = ['心情😊', '工作-效率', '健康&运动'];
        const result = generateDiaryTemplate('simple', testDate, testWeather, customTags);

        expect(result.ratings).toEqual({
          '今日评价': 0,
          '心情😊': 0,
          '工作-效率': 0,
          '健康&运动': 0
        });
      });
    });

    describe('Edge cases', () => {
      it('should handle undefined custom tags', () => {
        const result = generateDiaryTemplate('simple', testDate, testWeather, undefined);

        expect(result.ratings).toEqual({ '今日评价': 0 });
      });

      it('should handle very long date string', () => {
        const longDate = '2024-01-15T10:30:45.123Z-very-long-additional-info';
        const result = generateDiaryTemplate('simple', longDate, testWeather);

        expect(result.content).toContain(longDate);
      });

      it('should handle very long weather string', () => {
        const longWeather = '晴天但是有一些云彩，温度适中，湿度较低，风力微弱，总体来说是个不错的天气';
        const result = generateDiaryTemplate('simple', testDate, longWeather);

        expect(result.content).toContain(longWeather);
      });

      it('should handle special characters in date and weather', () => {
        const specialDate = '2024/01/15 & more';
        const specialWeather = '晴天 & 多云 < 50%';
        const result = generateDiaryTemplate('simple', specialDate, specialWeather);

        expect(result.content).toContain(specialDate);
        expect(result.content).toContain(specialWeather);
      });

      it('should handle null weather', () => {
        const result = generateDiaryTemplate('simple', testDate, null as any);

        expect(result.content).toBe(`${testDate}\t天气：\n\n完成事项：\n\n心得体会：\n`);
      });

      it('should handle undefined weather', () => {
        const result = generateDiaryTemplate('simple', testDate, undefined);

        expect(result.content).toBe(`${testDate}\t天气：\n\n完成事项：\n\n心得体会：\n`);
      });
    });

    describe('Template combinations', () => {
      it('should work with custom template and custom tags', () => {
        const customTemplate = '日期：{日期}\n天气：{天气}\n今天过得怎么样？';
        const customTags = ['心情', '工作'];
        const result = generateDiaryTemplate(customTemplate, testDate, testWeather, customTags);

        expect(result.content).toBe(`日期：${testDate}\n天气：${testWeather}\n今天过得怎么样？`);
        expect(result.ratings).toEqual({
          '今日评价': 0,
          '心情': 0,
          '工作': 0
        });
      });

      it('should work with complex custom template and many tags', () => {
        const customTemplate = `
{日期} - 日记

天气情况：{天气}

今天的主要活动：
1. 
2. 
3. 

感想：

明天计划：
        `.trim();
        
        const customTags = ['整体评价', '心情指数', '工作效率', '健康状况', '学习进度'];
        const result = generateDiaryTemplate(customTemplate, testDate, testWeather, customTags);

        expect(result.content).toContain(testDate);
        expect(result.content).toContain(testWeather);
        expect(result.content).toContain('今天的主要活动');
        expect(Object.keys(result.ratings)).toHaveLength(6); // 1 default + 5 custom
      });
    });
  });
});
