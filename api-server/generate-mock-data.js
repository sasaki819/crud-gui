const { faker } = require('@faker-js/faker/locale/ja');
const fs = require('fs');
const path = require('path');

// コマンドライン引数の解析
const args = process.argv.slice(2);
let initialSeed;

// シード値の管理
const seedIndex = args.indexOf('--seed');
if (seedIndex !== -1 && args[seedIndex + 1]) {
  const providedSeed = parseInt(args[seedIndex + 1], 10);
  if (!isNaN(providedSeed)) {
    initialSeed = providedSeed;
  } else {
    console.error('Error: --seed must be followed by a valid number');
    process.exit(1);
  }
} else {
  // シード値が指定されていない場合は時刻ベースのシードを生成
  initialSeed = Date.now();
}

// シードの設定
faker.seed(initialSeed);

// カスタムのランダム生成器のための状態管理
let currentSeed = initialSeed;
const seededRandom = () => {
  currentSeed = (1597 * currentSeed + 51749) % 244944;
  return (currentSeed % 1000) / 1000;
};

// 日付フォーマット関数
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

// ランダムな日付を生成する関数
const generateRandomDate = (startStr, endStr) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const randomTime = start.getTime() + seededRandom() * (end.getTime() - start.getTime());
  return new Date(randomTime);
};

// 会社名の語尾パターン
const companySuffixes = [
  '株式会社', '有限会社', 'LLC', 'Inc.', '商事', '産業', 'ホールディングス',
  'テクノロジー', 'システムズ', 'ソリューションズ', 'コンサルティング', 'トレーディング'
];

// カテゴリーの定義
const productCategories = [
  { code: 'CTGR0001', name: 'PC・周辺機器' },
  { code: 'CTGR0002', name: 'オフィス用品' },
  { code: 'CTGR0003', name: 'ソフトウェア' },
  { code: 'CTGR0004', name: '書籍' },
  { code: 'CTGR0005', name: 'モバイル・ガジェット' }
];

// ダミーデータ生成関数
function generateMockData(customerCount = 51, productCount = 125) {
  // 顧客データ生成
  const customers = Array.from({ length: customerCount }, (_, i) => {
    const createdAt = generateRandomDate('2025-09-01', '2025-09-26');
    const updatedAt = generateRandomDate(createdAt, '2025-09-26');
    
    const statusWeights = {
      active: 0.7,     // 70%
      suspended: 0.15, // 15%
      deleted: 0.15    // 15%
    };

    return {
      code: `CUST${String(i + 1).padStart(4, '0')}`,
      name: faker.helpers.arrayElement([
        `${faker.company.name()}${faker.helpers.arrayElement(companySuffixes)}`,
        `${faker.helpers.arrayElement(companySuffixes)}${faker.company.name()}`
      ]),
      size: faker.helpers.arrayElement([
        100, 500, 1000, 3000, 5000, 10000, 999999999
      ]),
      email: faker.internet.email().toLowerCase().replace(/[^a-z0-9.@]/g, ''),
      status: faker.helpers.weightedArrayElement([
        { value: 'active', weight: statusWeights.active },
        { value: 'suspended', weight: statusWeights.suspended },
        { value: 'deleted', weight: statusWeights.deleted }
      ]),
      createdAt: formatDate(createdAt),
      updatedAt: formatDate(updatedAt)
    };
  });

  // 製品データ生成
  const products = Array.from({ length: productCount }, (_, i) => {
    const createdAt = generateRandomDate('2025-08-01', '2025-09-26');
    const updatedAt = generateRandomDate(createdAt, '2025-09-26');
    
    // 在庫数と利用可能フラグの設定
    const stockQuantity = faker.helpers.arrayElement([
      0,
      ...Array.from({ length: 20 }, () => faker.number.int({ min: 15, max: 500 }))
    ]);

    return {
      category: faker.helpers.arrayElement(productCategories).code,
      code: `PROD${String(i + 1).padStart(4, '0')}`,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Math.floor(faker.number.int({ min: 500, max: 150000 }) / 100) * 100, // 100円単位に調整
      stock_quantity: stockQuantity,
      is_available: stockQuantity > 0,
      createdAt: formatDate(createdAt),
      updatedAt: formatDate(updatedAt)
    };
  });

  return {
    customers,
    products,
    categories: productCategories
  };
}

// メイン処理
const mockData = generateMockData();
const outputPath = path.join(__dirname, 'db.json');

fs.writeFileSync(outputPath, JSON.stringify(mockData, null, 2), 'utf8');

// 結果の表示
console.log('\nMock Data Generation Complete');
console.log('----------------------------');
console.log(`Used seed: ${initialSeed}`);
console.log(`Data saved to: ${outputPath}`);
console.log('\nTo reproduce this exact dataset:');
console.log(`node generate-mock-data.js --seed ${initialSeed}`);