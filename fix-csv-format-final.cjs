const fs = require('fs');
const path = require('path');

// CSV格式修复脚本
function fixCSVFormat() {
  const csvPath = path.join(__dirname, 'public', 'extended_question_bank.csv');
  
  console.log('开始修复CSV格式问题...');
  
  try {
    // 读取原始文件
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`总共 ${lines.length} 行数据`);
    
    // 处理每一行
    const fixedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      console.log(`处理第 ${i + 1} 行...`);
      
      if (i === 0) {
        // 表头行，直接保留
        fixedLines.push(line);
        continue;
      }
      
      // 修复数据行
      const fixedLine = fixDataLine(line, i + 1);
      fixedLines.push(fixedLine);
    }
    
    // 写入修复后的文件
    const fixedContent = fixedLines.join('\n');
    fs.writeFileSync(csvPath, fixedContent, 'utf8');
    
    console.log('CSV格式修复完成！');
    
    // 验证修复结果
    validateCSV(csvPath);
    
  } catch (error) {
    console.error('修复过程中出现错误:', error);
  }
}

// 修复数据行
function fixDataLine(line, lineNumber) {
  console.log(`原始行 ${lineNumber}: ${line.substring(0, 100)}...`);
  
  // 定义字段名称（按顺序）
  const fieldNames = [
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
  
  // 智能解析字段
  const fields = parseLineIntelligently(line);
  
  // 如果字段数量不对，尝试修复
  if (fields.length !== fieldNames.length) {
    console.log(`行 ${lineNumber} 字段数量不正确: ${fields.length}/${fieldNames.length}`);
    // 尝试修复字段
    const fixedFields = repairFields(fields, fieldNames, lineNumber);
    return formatCSVLine(fixedFields);
  }
  
  // 清理和标准化字段
  const cleanedFields = fields.map((field, index) => {
    return cleanField(field, fieldNames[index]);
  });
  
  return formatCSVLine(cleanedFields);
}

// 智能解析行
function parseLineIntelligently(line) {
  const fields = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // 转义的引号
        currentField += '"';
        i += 2;
        continue;
      } else {
        // 切换引号状态
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // 字段分隔符
      fields.push(currentField.trim());
      currentField = '';
      i++;
      continue;
    } else {
      currentField += char;
    }
    
    i++;
  }
  
  // 添加最后一个字段
  if (currentField || fields.length > 0) {
    fields.push(currentField.trim());
  }
  
  return fields;
}

// 修复字段
function repairFields(fields, fieldNames, lineNumber) {
  console.log(`修复行 ${lineNumber} 的字段...`);
  
  // 如果字段太少，可能是合并问题
  if (fields.length < fieldNames.length) {
    // 尝试分离合并的字段
    const repairedFields = [];
    
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      
      // 检查是否包含多个值（特别是选项字段）
      if (i >= 10 && i <= 17) { // 选项字段范围
        const parts = splitMergedField(field);
        repairedFields.push(...parts);
      } else {
        repairedFields.push(field);
      }
    }
    
    // 如果还是不够，用空值填充
    while (repairedFields.length < fieldNames.length) {
      repairedFields.push('');
    }
    
    // 如果太多，截断
    if (repairedFields.length > fieldNames.length) {
      repairedFields.splice(fieldNames.length);
    }
    
    return repairedFields;
  }
  
  return fields;
}

// 分离合并的字段
function splitMergedField(field) {
  // 检查是否包含中英文混合内容
  const chinesePattern = /[\u4e00-\u9fff]/;
  const englishPattern = /[a-zA-Z]/;
  
  if (chinesePattern.test(field) && englishPattern.test(field)) {
    // 尝试分离中英文
    const parts = [];
    let currentPart = '';
    let lastWasChinese = false;
    
    for (let i = 0; i < field.length; i++) {
      const char = field[i];
      const isChinese = chinesePattern.test(char);
      
      if (i > 0 && isChinese !== lastWasChinese && currentPart.trim()) {
        parts.push(currentPart.trim());
        currentPart = char;
      } else {
        currentPart += char;
      }
      
      lastWasChinese = isChinese;
    }
    
    if (currentPart.trim()) {
      parts.push(currentPart.trim());
    }
    
    return parts.length > 1 ? parts : [field];
  }
  
  return [field];
}

// 清理字段
function cleanField(field, fieldName) {
  if (!field) return '';
  
  // 移除多余的引号
  let cleaned = field.replace(/^"+|"+$/g, '');
  
  // 修复中英文标点符号
  cleaned = cleaned.replace(/，/g, ','); // 中文逗号转英文
  cleaned = cleaned.replace(/。/g, '.'); // 中文句号转英文
  cleaned = cleaned.replace(/？/g, '?'); // 中文问号转英文
  cleaned = cleaned.replace(/！/g, '!'); // 中文感叹号转英文
  
  // 清理多余的空格
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // 移除字段末尾的逗号或其他分隔符
  cleaned = cleaned.replace(/[,，]+$/, '');
  
  return cleaned;
}

// 格式化CSV行
function formatCSVLine(fields) {
  return fields.map(field => {
    // 如果字段包含逗号、引号或换行符，需要用引号包围
    if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
      // 转义内部的引号
      const escaped = field.replace(/"/g, '""');
      return `"${escaped}"`;
    }
    return field;
  }).join(',');
}

// 验证CSV文件
function validateCSV(csvPath) {
  console.log('\n验证修复后的CSV文件...');
  
  try {
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    
    console.log(`验证结果: 共 ${lines.length} 行数据`);
    
    // 检查每行的字段数量
    const headerFields = lines[0].split(',').length;
    console.log(`表头字段数: ${headerFields}`);
    
    let errorCount = 0;
    for (let i = 1; i < Math.min(lines.length, 6); i++) {
      const fields = parseLineIntelligently(lines[i]);
      if (fields.length !== headerFields) {
        console.log(`行 ${i + 1} 字段数量错误: ${fields.length}/${headerFields}`);
        errorCount++;
      } else {
        console.log(`行 ${i + 1} 字段数量正确: ${fields.length}`);
        // 显示前几个字段
        console.log(`  ID: ${fields[0]}`);
        console.log(`  选项A中文: ${fields[10]}`);
        console.log(`  选项A英文: ${fields[11]}`);
      }
    }
    
    if (errorCount === 0) {
      console.log('✅ CSV文件格式验证通过！');
    } else {
      console.log(`❌ 发现 ${errorCount} 个格式错误`);
    }
    
  } catch (error) {
    console.error('验证过程中出现错误:', error);
  }
}

// 执行修复
fixCSVFormat();