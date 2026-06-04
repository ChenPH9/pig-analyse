import { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { LineChart } from '../components/LineChart';
import { BarChart } from '../components/BarChart';
import { MetricCard } from '../components/MetricCard';
import { PiggyBank, TrendingUp, Activity, ArrowUpRight } from 'lucide-react';

export function Sow() {
  const { sowData, fetchSowData } = useStore();
  const [selectedYear, setSelectedYear] = useState<string>('all');

  useEffect(() => {
    fetchSowData();
  }, [fetchSowData]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(sowData.map(d => d.year))];
    return uniqueYears.sort((a, b) => b - a);
  }, [sowData]);

  const filteredData = useMemo(() => {
    let data = [...sowData];
    if (selectedYear !== 'all') {
      data = data.filter(d => d.year === parseInt(selectedYear));
    }
    return data;
  }, [sowData, selectedYear]);

  const latest = useMemo(() => {
    return sowData[sowData.length - 1];
  }, [sowData]);

  const previous = useMemo(() => {
    return sowData[sowData.length - 2];
  }, [sowData]);

  const chartData = useMemo(() => {
    const data = filteredData.slice(-24);
    return {
      labels: data.map(d => d.date),
      count: data.map(d => d.count),
      change: data.map(d => d.change),
    };
  }, [filteredData]);

  const yearlySummary = useMemo(() => {
    const summary: Record<number, { total: number; avg: number; max: number; min: number }> = {};
    
    sowData.forEach(item => {
      if (!summary[item.year]) {
        summary[item.year] = { total: 0, avg: 0, max: -Infinity, min: Infinity };
      }
      summary[item.year].total += item.count;
      summary[item.year].max = Math.max(summary[item.year].max, item.count);
      summary[item.year].min = Math.min(summary[item.year].min, item.count);
    });

    Object.keys(summary).forEach(year => {
      const yearData = sowData.filter(d => d.year === parseInt(year));
      summary[parseInt(year)].avg = summary[parseInt(year)].total / yearData.length;
    });

    return summary;
  }, [sowData]);

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

  const calculateChange = (current: number, prev: number) => {
    if (!prev) return 0;
    return ((current - prev) / prev) * 100;
  };

  const metrics = [
    {
      title: '当前能繁母猪存栏',
      value: latest.count.toLocaleString(),
      unit: '万头',
      change: previous ? calculateChange(latest.count, previous.count) : 0,
      icon: <PiggyBank size={24} />,
      color: '#f59e0b',
    },
    {
      title: '环比变化',
      value: latest.change > 0 ? `+${latest.change.toFixed(2)}` : latest.change.toFixed(2),
      unit: '%',
      icon: <TrendingUp size={24} />,
      color: latest.change >= 0 ? '#10b981' : '#ef4444',
    },
    {
      title: '年度最高存栏',
      value: selectedYear !== 'all' 
        ? yearlySummary[parseInt(selectedYear)]?.max.toFixed(2) || '-'
        : Math.max(...sowData.map(d => d.count)).toFixed(2),
      unit: '万头',
      icon: <ArrowUpRight size={24} />,
      color: '#8b5cf6',
    },
    {
      title: '年度平均存栏',
      value: selectedYear !== 'all'
        ? yearlySummary[parseInt(selectedYear)]?.avg.toFixed(2) || '-'
        : (sowData.reduce((sum, d) => sum + d.count, 0) / sowData.length).toFixed(2),
      unit: '万头',
      icon: <Activity size={24} />,
      color: '#06b6d4',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          能繁母猪存栏分析
        </h1>
        <p className="text-slate-400">
          牧原股份母猪存栏量变化趋势 · 最新数据: {latest.date}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-slate-400" />
            <span className="text-slate-300 font-medium">筛选年份:</span>
          </div>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">全部年份</option>
            {years.map(year => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">母猪存栏量趋势</h3>
          <div className="h-80">
            <LineChart
              labels={chartData.labels}
              datasets={[
                { label: '存栏量 (万头)', data: chartData.count, color: '#f59e0b' },
              ]}
              yAxisLabel="万头"
            />
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">月度环比变化</h3>
          <div className="h-80">
            <BarChart
              labels={chartData.labels}
              datasets={[
                { label: '环比变化 (%)', data: chartData.change, color: '#10b981' },
              ]}
              yAxisLabel="百分比 (%)"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  日期
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  存栏量 (万头)
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  环比变化
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredData.slice().reverse().map((item) => (
                <tr key={item.date} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">{item.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-slate-300 font-mono font-medium">
                      {item.count.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`font-mono font-medium ${
                      item.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
