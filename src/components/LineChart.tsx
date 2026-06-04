import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
  yAxisLabel?: string;
}

export function LineChart({ labels, datasets, yAxisLabel }: LineChartProps) {
  // 根据数据量动态调整显示配置
  const dataLength = labels.length;
  const showPoints = dataLength <= 24; // 数据量较多时隐藏点
  const maxTicks = dataLength > 20 ? Math.ceil(dataLength / 4) : 10;

  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color,
      backgroundColor: `${ds.color}15`,
      tension: 0.35,
      fill: true,
      pointRadius: showPoints ? 3 : 1.5,
      pointHoverRadius: 6,
      borderWidth: 2,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
          font: { size: 13, family: 'Inter, system-ui' },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#475569',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { size: 14, weight: '600' as const },
        bodyFont: { size: 13 },
        callbacks: {
          title: (items: any) => {
            return items[0]?.label || '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.25)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          maxTicksLimit: maxTicks,
          autoSkipPadding: 30,
          font: { size: 11 },
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.25)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
        },
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          color: '#94a3b8',
          font: { size: 12, weight: '500' as const },
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
