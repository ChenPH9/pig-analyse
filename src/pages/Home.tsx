import { useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { MetricCard } from '../components/MetricCard';
import { LineChart } from '../components/LineChart';
import { RefreshCw, Database, Activity, AlertCircle } from 'lucide-react';

export function Home() {
  const { 
    financialData, 
    fetchFinancialData, 
    fetchSowData,
    refreshAllData,
    loading,
    lastUpdated,
    error,
    clearError
  } = useStore();

  useEffect(() => {
    fetchFinancialData();
    fetchSowData();
  }, [fetchFinancialData, fetchSowData]);

  const latest = useMemo(() => {
    return financialData[financialData.length - 1];
  }, [financialData]);

  const previous = useMemo(() => {
    return financialData[financialData.length - 2];
  }, [financialData]);

  const calculateChange = (current: number, prev: number) => {
    if (!prev) return 0;
    return ((current - prev) / prev) * 100;
  };

  const chartData = useMemo(() => {
    const recentData = financialData.slice(-12);
    return {
      labels: recentData.map(d => d.date),
      netProfit: recentData.map(d => d.netProfit),
      revenue: recentData.map(d => d.revenue),
      roe: recentData.map(d => d.roe),
      grossMargin: recentData.map(d => d.grossMargin),
    };
  }, [financialData]);

  if (loading && !latest) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">正在加载牧原股份数据...</p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: '净利润',
      value: latest?.netProfit?.toLocaleString() || '-',
      unit: '亿元',
      change: previous && latest ? calculateChange(latest.netProfit, previous.netProfit) : 0,
      icon: <Database size={24} />,
      color: '#3b82f6',
    },
    {
      title: '营业收入',
      value: latest?.revenue?.toLocaleString() || '-',
      unit: '亿元',
      change: previous && latest ? calculateChange(latest.revenue, previous.revenue) : 0,
      icon: <Activity size={24} />,
      color: '#14b8a6',
    },
    {
      title: '资产负债率',
      value: latest?.debtRatio?.toFixed(2) || '-',
      unit: '%',
      change: previous && latest ? latest.debtRatio - previous.debtRatio : 0,
      icon: <Activity size={24} />,
      color: '#f59e0b',
    },
    {
      title: '毛利率',
      value: latest?.grossMargin?.toFixed(2) || '-',
      unit: '%',
      change: previous && latest ? latest.grossMargin - previous.grossMargin : 0,
      icon: <Activity size={24} />,
      color: '#8b5cf6',
    },
    {
      title: '现金流',
      value: latest?.cashFlow?.toLocaleString() || '-',
      unit: '亿元',
      change: previous && latest ? calculateChange(latest.cashFlow, previous.cashFlow) : 0,
      icon: <Activity size={24} />,
      color: '#10b981',
    },
    {
      title: '市盈率 (PE)',
      value: latest?.peRatio?.toFixed(2) || '-',
      change: previous && latest ? calculateChange(latest.peRatio, previous.peRatio) : 0,
      icon: <Activity size={24} />,
      color: '#f43f5e',
    },
    {
      title: '净资产收益率 (ROE)',
      value: latest?.roe?.toFixed(2) || '-',
      unit: '%',
      change: previous && latest ? latest.roe - previous.roe : 0,
      icon: <Activity size={24} />,
      color: '#06b6d4',
    },
    {
      title: '市净率 (PB)',
      value: latest?.pbRatio?.toFixed(2) || '-',
      change: previous && latest ? calculateChange(latest.pbRatio, previous.pbRatio) : 0,
      icon: <Activity size={24} />,
      color: '#ec4899',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 顶部区域 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            牧原股份财务仪表板
            <span className="ml-2 text-sm font-normal text-slate-400">(002714.SZ)</span>
          </h1>
          <div className="flex items-center gap-4 text-slate-400">
            <span>数据期间: {latest?.date || '-'}</span>
            {lastUpdated && (
              <span className="flex items-center gap-1">
                <Database size={14} />
                更新于: {lastUpdated.toLocaleString('zh-CN')}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={refreshAllData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {loading ? '刷新中...' : '刷新数据'}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-300">{error}</span>
          <button
            onClick={clearError}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            关闭
          </button>
        </div>
      )}

      {/* 指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">净利润与营业收入趋势</h3>
          <div className="h-80">
            {chartData.labels.length > 0 ? (
              <LineChart
                labels={chartData.labels}
                datasets={[
                  { label: '净利润 (亿元)', data: chartData.netProfit, color: '#3b82f6' },
                  { label: '营业收入 (亿元)', data: chartData.revenue, color: '#14b8a6' },
                ]}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                暂无数据
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">盈利能力指标</h3>
          <div className="h-80">
            {chartData.labels.length > 0 ? (
              <LineChart
                labels={chartData.labels}
                datasets={[
                  { label: 'ROE (%)', data: chartData.roe, color: '#06b6d4' },
                  { label: '毛利率 (%)', data: chartData.grossMargin, color: '#8b5cf6' },
                ]}
                yAxisLabel="百分比 (%)"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                暂无数据
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 数据源说明 */}
      <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <h4 className="text-slate-300 font-medium mb-2 flex items-center gap-2">
          <Database size={16} />
          数据源说明
        </h4>
        <p className="text-slate-400 text-sm">
          当前数据包含牧原股份(002714) 2014-2025年季度财务报表数据，以及2018-2025年月度能繁母猪存栏数据。
          数据基于公开信息整理，缓存时间为1小时。如需接入实时数据，请配置相应的财经数据API。
        </p>
      </div>
    </div>
  );
}
