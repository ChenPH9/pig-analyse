import { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { LineChart } from '../components/LineChart';
import { Download, Filter } from 'lucide-react';

export function Reports() {
  const { financialData, fetchFinancialData } = useStore();
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(financialData.map(d => d.year))];
    return uniqueYears.sort((a, b) => b - a);
  }, [financialData]);

  const filteredData = useMemo(() => {
    let data = [...financialData];
    
    if (selectedYear !== 'all') {
      data = data.filter(d => d.year === parseInt(selectedYear));
    }

    switch (sortBy) {
      case 'date-desc':
        data.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.quarter - a.quarter;
        });
        break;
      case 'date-asc':
        data.sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;
          return a.quarter - b.quarter;
        });
        break;
      case 'profit-desc':
        data.sort((a, b) => b.netProfit - a.netProfit);
        break;
      case 'profit-asc':
        data.sort((a, b) => a.netProfit - b.netProfit);
        break;
    }

    return data;
  }, [financialData, selectedYear, sortBy]);

  const chartData = useMemo(() => {
    const data = filteredData.slice().reverse();
    return {
      labels: data.map(d => d.date),
      netProfit: data.map(d => d.netProfit),
      revenue: data.map(d => d.revenue),
      debtRatio: data.map(d => d.debtRatio),
      peRatio: data.map(d => d.peRatio),
    };
  }, [filteredData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            财报数据详情
          </h1>
          <p className="text-slate-400">
            牧原股份历史财务数据一览
          </p>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-400" />
            <span className="text-slate-300 font-medium">筛选:</span>
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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="date-desc">日期 (最新)</option>
            <option value="date-asc">日期 (最早)</option>
            <option value="profit-desc">净利润 (高→低)</option>
            <option value="profit-asc">净利润 (低→高)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">净利润趋势</h3>
          <div className="h-72">
            <LineChart
              labels={chartData.labels}
              datasets={[
                { label: '净利润 (亿元)', data: chartData.netProfit, color: '#3b82f6' },
              ]}
              yAxisLabel="亿元"
            />
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">营业收入趋势</h3>
          <div className="h-72">
            <LineChart
              labels={chartData.labels}
              datasets={[
                { label: '营业收入 (亿元)', data: chartData.revenue, color: '#14b8a6' },
              ]}
              yAxisLabel="亿元"
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
                  期间
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  净利润 (亿元)
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  营业收入 (亿元)
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  资产负债率 (%)
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  毛利率 (%)
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  现金流 (亿元)
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  PE
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  ROE (%)
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  PB
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredData.map((item, index) => (
                <tr 
                  key={item.date} 
                  className="hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">{item.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`font-mono font-medium ${
                      item.netProfit > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.netProfit.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-slate-300 font-mono">
                      {item.revenue.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-slate-300 font-mono">
                      {item.debtRatio.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-slate-300 font-mono">
                      {item.grossMargin.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-slate-300 font-mono">
                      {item.cashFlow.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-slate-300 font-mono">
                      {item.peRatio.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`font-mono ${
                      item.roe > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.roe.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-slate-300 font-mono">
                      {item.pbRatio.toFixed(2)}
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
