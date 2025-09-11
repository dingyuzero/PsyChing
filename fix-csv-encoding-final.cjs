const fs = require('fs');
const path = require('path');

// 更全面的修复映射
const fixMap = {
  // 基本编码问题
  '？,': '？',
  '。,': '。',
  '！,': '！',
  '，,': '，',
  '：,': '：',
  '；,': '；',
  
  // 具体的编码错误修复
  '探索未知和创？,': '探索未知和创新',
  '共同成长和进？,': '共同成长和进步',
  '提供建议，分享经？,': '提供建议，分享经验',
  '创新思考，寻找新方法,': '创新思考，寻找新方法',
  '耐心倾听，情感支？,': '耐心倾听，情感支持',
  '直接面对，寻求解？,': '直接面对，寻求解决',
  '主导讨论和决策过？,': '主导讨论和决策过程',
  '提出创新的替代方？,': '提出创新的替代方案',
  '保持冷静，果断行？,': '保持冷静，果断行动',
  '快速适应，灵活应？,': '快速适应，灵活应对',
  '积极应对，化危为？,': '积极应对，化危为机',
  '接受现实，顺其自？,': '接受现实，顺其自然',
  
  // 处理问号替换问题
  '探索未知和创？': '探索未知和创新',
  '共同成长和进？': '共同成长和进步',
  '提供建议，分享经？': '提供建议，分享经验',
  '耐心倾听，情感支？': '耐心倾听，情感支持',
  '直接面对，寻求解？': '直接面对，寻求解决',
  '主导讨论和决策过？': '主导讨论和决策过程',
  '提出创新的替代方？': '提出创新的替代方案',
  '保持冷静，果断行？': '保持冷静，果断行动',
  '快速适应，灵活应？': '快速适应，灵活应对',
  '积极应对，化危为？': '积极应对，化危为机',
  '接受现实，顺其自？': '接受现实，顺其自然'
};

function fixCSVEncoding() {
  const csvPath = path.join(__dirname, 'public', 'extended_question_bank.csv');
  
  try {
    // 读取文件
    let content = fs.readFileSync(csvPath, 'utf8');
    console.log('原始文件大小:', content.length);
    
    let fixCount = 0;
    
    // 应用修复映射
    for (const [broken, fixed] of Object.entries(fixMap)) {
      const regex = new RegExp(broken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, fixed);
        console.log(`修复: "${broken}" -> "${fixed}" (${matches.length}次)`);
        fixCount += matches.length;
      }
    }
    
    // 通用模式修复：处理以问号结尾但应该是其他字符的情况
    const patterns = [
      // 修复 "？," 模式
      { pattern: /([\u4e00-\u9fff]+)？,/g, replacement: '$1？' },
      // 修复单独的 "？," 
      { pattern: /？,/g, replacement: '？' },
      // 修复其他标点符号后跟逗号的情况
      { pattern: /([。！；：])，/g, replacement: '$1' }
    ];
    
    patterns.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        console.log(`通用修复: ${pattern} (${matches.length}次)`);
        fixCount += matches.length;
      }
    });
    
    // 写回文件
    fs.writeFileSync(csvPath, content, 'utf8');
    
    console.log('\n修复完成！');
    console.log('总共修复了', fixCount, '个字符编码问题');
    console.log('修复后文件大小:', content.length);
    
  } catch (error) {
    console.error('修复过程中出错:', error);
  }
}

fixCSVEncoding();