const fs = require('fs');
const path = require('path');

// 修复CSV文件中的引号问题
function fixCSVQuotes() {
  const csvPath = path.join(__dirname, 'public', 'extended_question_bank.csv');
  
  try {
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n');
    
    console.log('开始修复CSV引号问题...');
    
    const fixedLines = lines.map((line, index) => {
      if (index === 0) {
        // 跳过表头
        return line;
      }
      
      if (line.trim() === '') {
        return line;
      }
      
      // 重新构建CSV行，确保每个字段都有正确的引号
      const fields = [];
      let currentField = '';
      let inQuotes = false;
      let i = 0;
      
      while (i < line.length) {
        const char = line[i];
        
        if (char === '"') {
          if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
            // 转义的引号
            currentField += '""';
            i += 2;
          } else {
            // 开始或结束引号
            inQuotes = !inQuotes;
            i++;
          }
        } else if (char === ',' && !inQuotes) {
          // 字段分隔符
          fields.push(currentField);
          currentField = '';
          i++;
        } else {
          currentField += char;
          i++;
        }
      }
      
      // 添加最后一个字段
      if (currentField !== '' || line.endsWith(',')) {
        fields.push(currentField);
      }
      
      // 重新构建行，确保每个字段都有引号（除了数字字段）
      const rebuiltFields = fields.map((field, fieldIndex) => {
        // 检查是否是数字字段（八卦系数）
        if (fieldIndex >= 18 && /^\d*\.?\d*$/.test(field.trim())) {
          return field.trim();
        }
        
        // 清理字段内容
        let cleanField = field.trim();
        
        // 移除多余的引号
        if (cleanField.startsWith('"') && cleanField.endsWith('"')) {
          cleanField = cleanField.slice(1, -1);
        }
        
        // 处理内部的转义引号
        cleanField = cleanField.replace(/""/g, '"');
        
        // 重新添加引号
        return `"${cleanField}"`;
      });
      
      const rebuiltLine = rebuiltFields.join(',');
      
      if (rebuiltLine !== line) {
        console.log(`第${index + 1}行已修复`);
      }
      
      return rebuiltLine;
    });
    
    const fixedContent = fixedLines.join('\n');
    fs.writeFileSync(csvPath, fixedContent, 'utf8');
    
    console.log('CSV引号修复完成！');
    
  } catch (error) {
    console.error('修复CSV引号时出错:', error);
  }
}

fixCSVQuotes();