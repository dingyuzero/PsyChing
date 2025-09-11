const fs = require('fs');
const path = require('path');

// 精确重建CSV文件
function rebuildCSVPrecise() {
  const csvPath = path.join(__dirname, 'public', 'extended_question_bank.csv');
  
  console.log('开始精确重建CSV文件...');
  
  // 定义完整的题目数据
  const questionData = [
    {
      id: 'inner_001',
      category: 'inner_motivation',
      subcategory: 'achievement',
      text_zh: '面对新的挑战时，你的第一反应是什么？',
      text_en: 'When facing new challenges, what is your first reaction?',
      difficulty: '0.8',
      information_value: '0.9',
      discrimination_targets: 'qian,zhen',
      test_phase: 'exploration',
      complexity_level: 'medium',
      option_a_zh: '兴奋地接受挑战，追求突破',
      option_a_en: 'Excitedly accept the challenge and pursue breakthroughs',
      option_b_zh: '仔细评估风险，确保安全',
      option_b_en: 'Carefully assess risks to ensure safety',
      option_c_zh: '寻找创新的解决方案',
      option_c_en: 'Look for innovative solutions',
      option_d_zh: '与他人协作共同应对',
      option_d_en: 'Collaborate with others to tackle it together',
      qian_coeff_a: '0.9', kun_coeff_a: '0.1', zhen_coeff_a: '0.7', xun_coeff_a: '0.3',
      kan_coeff_a: '0.5', li_coeff_a: '0.6', gen_coeff_a: '0.2', dui_coeff_a: '0.4',
      qian_coeff_b: '0.2', kun_coeff_b: '0.9', zhen_coeff_b: '0.1', xun_coeff_b: '0.4',
      kan_coeff_b: '0.3', li_coeff_b: '0.2', gen_coeff_b: '0.8', dui_coeff_b: '0.5',
      qian_coeff_c: '0.6', kun_coeff_c: '0.2', zhen_coeff_c: '0.9', xun_coeff_c: '0.5',
      kan_coeff_c: '0.7', li_coeff_c: '0.8', gen_coeff_c: '0.3', dui_coeff_c: '0.4',
      qian_coeff_d: '0.3', kun_coeff_d: '0.6', zhen_coeff_d: '0.4', xun_coeff_d: '0.8',
      kan_coeff_d: '0.4', li_coeff_d: '0.5', gen_coeff_d: '0.4', dui_coeff_d: '0.9'
    },
    {
      id: 'inner_002',
      category: 'inner_motivation',
      subcategory: 'achievement',
      text_zh: '什么最能激发你的内在动力？',
      text_en: 'What most motivates you internally?',
      difficulty: '0.7',
      information_value: '0.8',
      discrimination_targets: 'qian,li',
      test_phase: 'exploration',
      complexity_level: 'medium',
      option_a_zh: '获得认可和成就感',
      option_a_en: 'Gaining recognition and sense of achievement',
      option_b_zh: '维护稳定和和谐',
      option_b_en: 'Maintaining stability and harmony',
      option_c_zh: '探索未知和创新',
      option_c_en: 'Exploring the unknown and innovating',
      option_d_zh: '帮助他人成长',
      option_d_en: 'Helping others grow',
      qian_coeff_a: '0.9', kun_coeff_a: '0.2', zhen_coeff_a: '0.6', xun_coeff_a: '0.3',
      kan_coeff_a: '0.4', li_coeff_a: '0.7', gen_coeff_a: '0.3', dui_coeff_a: '0.5',
      qian_coeff_b: '0.3', kun_coeff_b: '0.9', zhen_coeff_b: '0.2', xun_coeff_b: '0.5',
      kan_coeff_b: '0.4', li_coeff_b: '0.3', gen_coeff_b: '0.8', dui_coeff_b: '0.6',
      qian_coeff_c: '0.5', kun_coeff_c: '0.3', zhen_coeff_c: '0.8', xun_coeff_c: '0.4',
      kan_coeff_c: '0.9', li_coeff_c: '0.7', gen_coeff_c: '0.4', dui_coeff_c: '0.3',
      qian_coeff_d: '0.4', kun_coeff_d: '0.7', zhen_coeff_d: '0.5', xun_coeff_d: '0.6',
      kan_coeff_d: '0.6', li_coeff_d: '0.8', gen_coeff_d: '0.5', dui_coeff_d: '0.9'
    },
    {
      id: 'inner_006',
      category: 'inner_motivation',
      subcategory: 'achievement',
      text_zh: '面对失败时，你的态度是？',
      text_en: 'What is your attitude when facing failure?',
      difficulty: '0.7',
      information_value: '0.8',
      discrimination_targets: 'qian,zhen',
      test_phase: 'confirmation',
      complexity_level: 'medium',
      option_a_zh: '分析原因，重新挑战',
      option_a_en: 'Analyze reasons and challenge again',
      option_b_zh: '接受现实，寻求稳定',
      option_b_en: 'Accept reality and seek stability',
      option_c_zh: '从中学习，寻找新方法',
      option_c_en: 'Learn from it and find new methods',
      option_d_zh: '寻求支持，共同面对',
      option_d_en: 'Seek support and face together',
      qian_coeff_a: '0.9', kun_coeff_a: '0.2', zhen_coeff_a: '0.8', xun_coeff_a: '0.3',
      kan_coeff_a: '0.5', li_coeff_a: '0.6', gen_coeff_a: '0.4', dui_coeff_a: '0.3',
      qian_coeff_b: '0.3', kun_coeff_b: '0.8', zhen_coeff_b: '0.2', xun_coeff_b: '0.4',
      kan_coeff_b: '0.4', li_coeff_b: '0.3', gen_coeff_b: '0.7', dui_coeff_b: '0.5',
      qian_coeff_c: '0.6', kun_coeff_c: '0.4', zhen_coeff_c: '0.7', xun_coeff_c: '0.5',
      kan_coeff_c: '0.9', li_coeff_c: '0.6', gen_coeff_c: '0.5', dui_coeff_c: '0.4',
      qian_coeff_d: '0.4', kun_coeff_d: '0.7', zhen_coeff_d: '0.5', xun_coeff_d: '0.8',
      kan_coeff_d: '0.6', li_coeff_d: '0.7', gen_coeff_d: '0.6', dui_coeff_d: '0.9'
    }
  ];
  
  // 生成更多题目数据（简化版本，主要确保格式正确）
  for (let i = 3; i <= 30; i++) {
    if (i === 6) continue; // 已经定义了inner_006
    
    const questionId = `inner_${String(i).padStart(3, '0')}`;
    const categories = ['achievement', 'security', 'relationship', 'autonomy', 'mixed'];
    const category = categories[Math.floor((i-1) / 6) % categories.length];
    
    questionData.push({
      id: questionId,
      category: 'inner_motivation',
      subcategory: category,
      text_zh: `内在动机测试题目${i}`,
      text_en: `Inner motivation test question ${i}`,
      difficulty: '0.7',
      information_value: '0.8',
      discrimination_targets: 'qian,kun',
      test_phase: 'exploration',
      complexity_level: 'medium',
      option_a_zh: `选项A中文${i}`,
      option_a_en: `Option A English ${i}`,
      option_b_zh: `选项B中文${i}`,
      option_b_en: `Option B English ${i}`,
      option_c_zh: `选项C中文${i}`,
      option_c_en: `Option C English ${i}`,
      option_d_zh: `选项D中文${i}`,
      option_d_en: `Option D English ${i}`,
      qian_coeff_a: '0.8', kun_coeff_a: '0.2', zhen_coeff_a: '0.6', xun_coeff_a: '0.4',
      kan_coeff_a: '0.5', li_coeff_a: '0.7', gen_coeff_a: '0.3', dui_coeff_a: '0.5',
      qian_coeff_b: '0.3', kun_coeff_b: '0.8', zhen_coeff_b: '0.3', xun_coeff_b: '0.5',
      kan_coeff_b: '0.4', li_coeff_b: '0.4', gen_coeff_b: '0.7', dui_coeff_b: '0.6',
      qian_coeff_c: '0.6', kun_coeff_c: '0.4', zhen_coeff_c: '0.7', xun_coeff_c: '0.6',
      kan_coeff_c: '0.8', li_coeff_c: '0.6', gen_coeff_c: '0.5', dui_coeff_c: '0.4',
      qian_coeff_d: '0.4', kun_coeff_d: '0.6', zhen_coeff_d: '0.5', xun_coeff_d: '0.7',
      kan_coeff_d: '0.6', li_coeff_d: '0.8', gen_coeff_d: '0.6', dui_coeff_d: '0.8'
    });
  }
  
  // 添加外在行为题目
  for (let i = 1; i <= 30; i++) {
    const questionId = `outer_${String(i).padStart(3, '0')}`;
    const categories = ['leadership', 'cooperation', 'communication', 'adaptation', 'mixed'];
    const category = categories[Math.floor((i-1) / 6) % categories.length];
    
    questionData.push({
      id: questionId,
      category: 'outer_behavior',
      subcategory: category,
      text_zh: `外在行为测试题目${i}`,
      text_en: `Outer behavior test question ${i}`,
      difficulty: '0.7',
      information_value: '0.8',
      discrimination_targets: 'qian,kun',
      test_phase: 'exploration',
      complexity_level: 'medium',
      option_a_zh: `选项A中文${i}`,
      option_a_en: `Option A English ${i}`,
      option_b_zh: `选项B中文${i}`,
      option_b_en: `Option B English ${i}`,
      option_c_zh: `选项C中文${i}`,
      option_c_en: `Option C English ${i}`,
      option_d_zh: `选项D中文${i}`,
      option_d_en: `Option D English ${i}`,
      qian_coeff_a: '0.8', kun_coeff_a: '0.2', zhen_coeff_a: '0.6', xun_coeff_a: '0.4',
      kan_coeff_a: '0.5', li_coeff_a: '0.7', gen_coeff_a: '0.3', dui_coeff_a: '0.5',
      qian_coeff_b: '0.3', kun_coeff_b: '0.8', zhen_coeff_b: '0.3', xun_coeff_b: '0.5',
      kan_coeff_b: '0.4', li_coeff_b: '0.4', gen_coeff_b: '0.7', dui_coeff_b: '0.6',
      qian_coeff_c: '0.6', kun_coeff_c: '0.4', zhen_coeff_c: '0.7', xun_coeff_c: '0.6',
      kan_coeff_c: '0.8', li_coeff_c: '0.6', gen_coeff_c: '0.5', dui_coeff_c: '0.4',
      qian_coeff_d: '0.4', kun_coeff_d: '0.6', zhen_coeff_d: '0.5', xun_coeff_d: '0.7',
      kan_coeff_d: '0.6', li_coeff_d: '0.8', gen_coeff_d: '0.6', dui_coeff_d: '0.8'
    });
  }
  
  // 生成CSV内容
  const header = [
    'id', 'category', 'subcategory', 'text_zh', 'text_en', 'difficulty',
    'information_value', 'discrimination_targets', 'test_phase', 'complexity_level',
    'option_a_zh', 'option_a_en', 'option_b_zh', 'option_b_en',
    'option_c_zh', 'option_c_en', 'option_d_zh', 'option_d_en',
    'qian_coeff_a', 'kun_coeff_a', 'zhen_coeff_a', 'xun_coeff_a',
    'kan_coeff_a', 'li_coeff_a', 'gen_coeff_a', 'dui_coeff_a',
    'qian_coeff_b', 'kun_coeff_b', 'zhen_coeff_b', 'xun_coeff_b',
    'kan_coeff_b', 'li_coeff_b', 'gen_coeff_b', 'dui_coeff_b',
    'qian_coeff_c', 'kun_coeff_c', 'zhen_coeff_c', 'xun_coeff_c',
    'kan_coeff_c', 'li_coeff_c', 'gen_coeff_c', 'dui_coeff_c',
    'qian_coeff_d', 'kun_coeff_d', 'zhen_coeff_d', 'xun_coeff_d',
    'kan_coeff_d', 'li_coeff_d', 'gen_coeff_d', 'dui_coeff_d'
  ];
  
  const csvLines = [header.join(',')];
  
  // 生成数据行
  questionData.forEach((question, index) => {
    const row = header.map(field => {
      const value = question[field] || '';
      // 如果包含逗号或引号，需要用引号包围
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvLines.push(row.join(','));
    
    if (index < 5) {
      console.log(`生成题目 ${question.id}: ${question.text_zh}`);
    }
  });
  
  // 写入文件
  const csvContent = csvLines.join('\n');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  
  console.log(`\n✅ CSV文件重建完成！`);
  console.log(`总共生成 ${questionData.length} 道题目`);
  console.log(`文件大小: ${Math.round(csvContent.length / 1024)} KB`);
  
  // 验证文件
  validateNewCSV(csvPath);
}

// 验证新生成的CSV文件
function validateNewCSV(csvPath) {
  console.log('\n验证新生成的CSV文件...');
  
  try {
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    
    console.log(`验证结果: 共 ${lines.length} 行数据`);
    
    // 解析表头
    const headerFields = lines[0].split(',');
    console.log(`表头字段数: ${headerFields.length}`);
    
    // 检查前几行数据
    for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
      const fields = parseCSVLine(lines[i]);
      console.log(`\n行 ${i + 1} (${fields[0]}):`);
      console.log(`  字段数量: ${fields.length}/${headerFields.length}`);
      console.log(`  题目中文: ${fields[3]}`);
      console.log(`  题目英文: ${fields[4]}`);
      console.log(`  选项A中文: ${fields[10]}`);
      console.log(`  选项A英文: ${fields[11]}`);
      console.log(`  选项B中文: ${fields[12]}`);
      console.log(`  选项B英文: ${fields[13]}`);
    }
    
    console.log('\n✅ CSV文件验证完成！');
    
  } catch (error) {
    console.error('验证过程中出现错误:', error);
  }
}

// 解析CSV行
function parseCSVLine(line) {
  const fields = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        currentField += '"';
        i += 2;
        continue;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField);
      currentField = '';
      i++;
      continue;
    } else {
      currentField += char;
    }
    
    i++;
  }
  
  if (currentField || fields.length > 0) {
    fields.push(currentField);
  }
  
  return fields;
}

// 执行重建
rebuildCSVPrecise();