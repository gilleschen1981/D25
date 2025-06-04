import { generateRandomLightColor } from '../../src/constants/colors';

describe('Color Utilities', () => {
  it('generates a valid RGB color', () => {
    const color = generateRandomLightColor();
    expect(color).toMatch(/^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/);
  });
  
  it('generates different colors on multiple calls', () => {
    const colors = new Set();
    for (let i = 0; i < 10; i++) {
      colors.add(generateRandomLightColor());
    }
    expect(colors.size).toBeGreaterThan(1);
  });
});