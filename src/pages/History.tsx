import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTestHistory, deleteTestResult, clearTestHistory, exportData, importData } from '../utils/localStorage';
import { HexagramResult } from '../types';
import { 
  ArrowLeft, 
  Calendar, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCw,
  Search,
  Filter,
  Eye,
  AlertCircle,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

const History = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [history, setHistory] = useState<HexagramResult[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HexagramResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'hexagram'>('date');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, searchTerm, sortBy]);

  const loadHistory = () => {
    setIsLoading(true);
    try {
        const testHistory = getTestHistory();
        setHistory(testHistory);
      } catch (error) {
        toast.error(t('loadHistoryFailed'));
      } finally {
        setIsLoading(false);
      }
  };

  const filterAndSortHistory = () => {
    let filtered = [...history];

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(result => 
        result.hexagram.name_zh.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.basicAnalysis.corePersonality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 排序
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return b.timestamp - a.timestamp; // 最新的在前
      } else {
        return a.hexagram.name_zh.localeCompare(b.hexagram.name_zh);
      }
    });

    setFilteredHistory(filtered);
  };

  const handleDeleteResult = (id: string) => {
    if (window.confirm(t('deleteConfirm'))) {
      try {
        deleteTestResult(id);
        // 立即更新本地状态
        setHistory(prev => prev.filter(item => item.id !== id));
        // 从选中列表中移除
        setSelectedResults(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success(t('testResultDeleted'));
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(t('deleteFailed'));
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm(t('clearAllConfirm'))) {
      try {
        clearTestHistory();
        // 立即更新本地状态
        setHistory([]);
        setSelectedResults(new Set());
        toast.success(t('historyCleared'));
      } catch (error) {
        console.error('Clear error:', error);
        toast.error(t('clearFailed'));
      }
    }
  };

  const handleExportData = () => {
    try {
        const data = exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${t('personalityTestData')}_${new Date().toLocaleDateString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(t('exportSuccess'));
      } catch (error) {
        toast.error(t('exportFailed'));
      }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        importData(data);
        loadHistory();
        toast.success(t('importSuccess'));
      } catch (error) {
        toast.error(t('importFailed'));
      }
    };
    reader.readAsText(file);
    
    // 重置文件输入
    event.target.value = '';
  };

  const handleSelectResult = (id: string) => {
    setSelectedResults(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedResults.size === filteredHistory.length) {
      setSelectedResults(new Set());
    } else {
      setSelectedResults(new Set(filteredHistory.map(result => result.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedResults.size === 0) return;
    
    if (window.confirm(t('deleteSelectedConfirm').replace('{count}', selectedResults.size.toString()))) {
      try {
        const deleteCount = selectedResults.size;
        const idsToDelete = Array.from(selectedResults);
        
        // 批量删除
        idsToDelete.forEach(id => deleteTestResult(id));
        
        // 立即更新本地状态
        setHistory(prev => prev.filter(item => !selectedResults.has(item.id)));
        setSelectedResults(new Set());
        
        toast.success(t('deletedCount').replace('{count}', deleteCount.toString()));
      } catch (error) {
        console.error('Batch delete error:', error);
        toast.error(t('deleteFailed'));
      }
    }
  };

  const handleViewResult = (result: HexagramResult) => {
    // 这里可以实现查看详细结果的功能
    // 暂时使用 alert 显示
    alert(`${t('hexagram')}：${result.hexagram.name_zh}\n\n${t('corePersonality')}：${result.basicAnalysis.corePersonality.slice(0, 100)}...`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-slate-600 hover:text-slate-900 transition-colors mr-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('backToHome')}
            </button>
            <h1 className="text-3xl font-bold text-slate-900">{t('testHistory')}</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={loadHistory}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
              title={t('refresh')}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleExportData}
              className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('export')}
            </button>
            
            <label className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {t('import')}
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 搜索和过滤 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-slate-400 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'hexagram')}
                  className="border border-slate-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">{t('sortByDate')}</option>
                  <option value="hexagram">{t('sortByHexagram')}</option>
                </select>
              </div>
              
              {filteredHistory.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {selectedResults.size === filteredHistory.length ? t('deselectAll') : t('selectAll')}
                  </button>
                  
                  {selectedResults.size > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t('deleteSelected')} ({selectedResults.size})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 历史记录列表 */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            {history.length === 0 ? (
              <>
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('noTestRecords')}</h3>
                <p className="text-slate-600 mb-6">{t('noTestRecordsDesc')}</p>
                <button
                  onClick={() => navigate('/test')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('startTest')}
                </button>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('noMatchingRecords')}</h3>
                <p className="text-slate-600">{t('noMatchingRecordsDesc')}</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((result) => (
              <div
                key={result.id}
                className={`bg-white rounded-xl shadow-sm p-6 transition-all duration-200 ${
                  selectedResults.has(result.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedResults.has(result.id)}
                      onChange={() => handleSelectResult(result.id)}
                      className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-xl font-bold text-white">☰</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">{result.hexagram.name_zh}</h3>
                          <p className="text-sm text-slate-500">
                            {new Date(result.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 leading-relaxed mb-4">
                        {result.basicAnalysis.corePersonality.slice(0, 150)}...
                      </p>
                      
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="mr-4">{t('questionCount')}: 10</span>
                        <span>{t('hexagramNumber')}: {result.hexagram.gua_number}</span>
                        <span className="ml-4">{t('confidence')}: {Math.round(result.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewResult(result)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t('viewDetails')}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteResult(result.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 底部操作 */}
        {history.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/test')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('startNewTest')}
            </button>
            
            <button
              onClick={handleClearAll}
              className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all duration-200"
            >
              {t('clearAll')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;