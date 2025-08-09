import React from 'react';
import { TrigramType } from '../types';

interface ProbabilityVisualizationProps {
  probabilities: Record<TrigramType, number>;
  title: string;
  colorScheme: 'blue' | 'purple';
  showLabels?: boolean;
  compact?: boolean;
}

const ProbabilityVisualization: React.FC<ProbabilityVisualizationProps> = ({
  probabilities,
  title,
  colorScheme,
  showLabels = true,
  compact = false
}) => {
  // 卦象名称映射
  const trigramNames: Record<TrigramType, string> = {
    qian: '乾',
    kun: '坤',
    zhen: '震',
    xun: '巽',
    kan: '坎',
    li: '离',
    gen: '艮',
    dui: '兑'
  };

  // 颜色配置
  const colors = {
    blue: {
      primary: 'bg-blue-500',
      secondary: 'bg-blue-400',
      light: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    purple: {
      primary: 'bg-purple-500',
      secondary: 'bg-purple-400',
      light: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-200'
    }
  };

  const colorConfig = colors[colorScheme];

  // 获取排序后的概率数据
  const sortedProbabilities = Object.entries(probabilities)
    .sort(([, a], [, b]) => b - a)
    .map(([trigram, probability]) => ({
      trigram: trigram as TrigramType,
      probability,
      name: trigramNames[trigram as TrigramType]
    }));

  // 获取最高概率
  const maxProbability = Math.max(...Object.values(probabilities));
  const topTrigram = sortedProbabilities[0];

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-medium ${colorConfig.text}`}>{title}</h4>
          <span className="text-xs text-slate-500">
            最高: {topTrigram.name} ({Math.round(topTrigram.probability * 100)}%)
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-1">
          {sortedProbabilities.map(({ trigram, probability, name }) => (
            <div key={trigram} className="text-center">
              <div className={`h-2 ${colorConfig.light} rounded-full overflow-hidden`}>
                <div 
                  className={`h-full ${colorConfig.primary} transition-all duration-500`}
                  style={{ width: `${(probability / maxProbability) * 100}%` }}
                ></div>
              </div>
              {showLabels && (
                <div className="mt-1">
                  <div className="text-xs font-medium text-slate-700">{name}</div>
                  <div className="text-xs text-slate-500">{Math.round(probability * 100)}%</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${colorConfig.border} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${colorConfig.text}`}>{title}</h3>
        <div className="text-sm text-slate-500">
          最高概率: {topTrigram.name} ({Math.round(topTrigram.probability * 100)}%)
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedProbabilities.map(({ trigram, probability, name }, index) => {
          const isTop = index === 0;
          const barColor = isTop ? colorConfig.primary : colorConfig.secondary;
          
          return (
            <div key={trigram} className="flex items-center space-x-3">
              <div className="w-12 text-center">
                <div className={`text-sm font-medium ${isTop ? colorConfig.text : 'text-slate-600'}`}>
                  {name}
                </div>
                <div className="text-xs text-slate-500">{trigram}</div>
              </div>
              
              <div className="flex-1">
                <div className={`h-6 ${colorConfig.light} rounded-full overflow-hidden relative`}>
                  <div 
                    className={`h-full ${barColor} transition-all duration-700 ease-out`}
                    style={{ width: `${probability * 100}%` }}
                  ></div>
                  
                  {/* 概率标签 */}
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className={`text-xs font-medium ${
                      probability > 0.3 ? 'text-white' : colorConfig.text
                    }`}>
                      {Math.round(probability * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 排名指示器 */}
              <div className="w-6 text-center">
                {isTop && (
                  <div className={`w-2 h-2 ${colorConfig.primary} rounded-full mx-auto`}></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 统计信息 */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex justify-between text-xs text-slate-500">
          <span>熵值: {calculateEntropy(probabilities).toFixed(3)}</span>
          <span>分布均匀度: {calculateUniformity(probabilities).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

// 计算信息熵
function calculateEntropy(probabilities: Record<string, number>): number {
  let entropy = 0;
  const values = Object.values(probabilities);
  
  for (const prob of values) {
    if (prob > 0) {
      entropy -= prob * Math.log2(prob);
    }
  }
  
  return entropy;
}

// 计算分布均匀度
function calculateUniformity(probabilities: Record<string, number>): number {
  const values = Object.values(probabilities);
  const maxEntropy = Math.log2(values.length);
  const currentEntropy = calculateEntropy(probabilities);
  
  return (currentEntropy / maxEntropy) * 100;
}

export default ProbabilityVisualization;