const { execSync } = require('child_process');
const fs = require('fs');

describe('generate-mock-data.js', () => {
  let firstData;
  let firstSeed;

  test('generates new dataset without seed', () => {
    const output = execSync('node generate-mock-data.js', { encoding: 'utf8' });
    expect(output).toContain('Mock Data Generation Complete');
    
    // シード値を抽出
    const seedMatch = output.match(/Used seed: (\d+)/);
    expect(seedMatch).not.toBeNull();
    firstSeed = seedMatch[1];
    
    // 生成されたデータを保存
    firstData = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    expect(firstData).toBeTruthy();
  });

  test('regenerates identical dataset with same seed', () => {
    const output = execSync(`node generate-mock-data.js --seed ${firstSeed}`, { encoding: 'utf8' });
    expect(output).toContain(`Used seed: ${firstSeed}`);
    
    const regeneratedData = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    expect(regeneratedData).toEqual(firstData);
  });

  test('generates different dataset with different seed', () => {
    const differentSeed = parseInt(firstSeed) + 1;
    const output = execSync(`node generate-mock-data.js --seed ${differentSeed}`, { encoding: 'utf8' });
    expect(output).toContain(`Used seed: ${differentSeed}`);
    
    const differentData = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    expect(differentData).not.toEqual(firstData);
  });
});