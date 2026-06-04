import { useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { MetricCard } from '../components/MetricCard';
import { LineChart } from '../components/LineChart';
import { BarChart } from '../components/BarChart';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Activity, 
  TrendingDown,
  Target,
  Scale,
  BarChart2
} from 'lucide-react';

export function Home() {
  const { financialData, fetchFinancialData, fetchSowData } = useStore();

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

  if (!latest) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">加载数据中...</p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: '净利润',
      value: latest.netProfit.toLocaleString(),
      unit: '亿元',
      change: previous ? calculateChange(latest.netProfit, previous.netProfit) : 0,
      icon: <DollarSign size={24} />,
      color: '#3b82f6',
    },
    {
      title: '营业收入',
      value: latest.revenue.toLocaleString(),
      unit: '亿元',
      change: previous ? calculateChange(latest.revenue, previous.revenue) : 0,
      icon: <TrendingUp size={24} />,
      color: '#14b8a6',
    },
    {
      title: '资产负债率',
      value: latest.debtRatio.toFixed(2),
      unit: '%',
      change: previous ? latest.debtRatio - previous.debtRatio : 0,
      icon: <Scale size={24} />,
      color: '#f59e0b',
    },
    {
      title: '毛利率',
      value: latest.grossMargin.toFixed(2),
      unit: '%',
      change: previous ? latest.grossMargin - previous.grossMargin : 0,
      icon: <Percent size={24} />,
      color: '#8b5cf6',
    },
    {
      title: '现金流',
      value: latest.cashFlow.toLocaleString(),
      unit: '亿元',
      change: previous ? calculateChange(latest.cashFlow, previous.cashFlow) : 0,
      icon: <Activity size={24} />,
      color: '#10b981',
    },
    {
      title: '市盈率 (PE)',
      value: latest.peRatio.toFixed(2),
      change: previous ? calculateChange(latest.peRatio, previous.peRatio) : 0,
      icon: <BarChart2 size={24} />,
      color: '#f43f5e',
    },
    {
      title: '净资产收益率 (ROE)',
      value: latest.roe.toFixed(2),
      unit: '%',
      change: previous ? latest.roe - previous.roe : 0,
      icon: <Target size={24} />,
      color: '#06b6d4',
    },
    {
      title: '市净率 (PB)',
      value: latest.pbRatio.toFixed(2),
      change: previous ? calculateChange(latest.pbRatio, previous.pbRatio) : 0,
      icon: <TrendingDown size={24} />,
      color: '#ec4899',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          财务仪表板
        </h1>
        <p className="text-slate-400">
          牧原股份最新财务数据概览 · 数据期间: {latest.date}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">净利润与营收趋势</h3>
          <div className="h-80">
            <LineChart
              labels={chartData.labels}
              datasets={[
                { label: '净利润 (亿元)', data: chartData.netProfit, color: '#3b82f6' },
                { label: '营业收入 (亿元)', data: chartData.revenue, color: '#14b8a6' },
              ]}
            />
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">盈利能力指标</h3>
          <div className="h-80">
            <LineChart
              labels={chartData.labels}
              datasets={[
                { label: 'ROE (%)', data: chartData.roe, color: '#06b6d4' },
                { label: '毛利率 (%)', data: chartData.grossMargin, color: '#8b5cf6' },
              ]}
              yAxisLabel="百分比 (%)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
