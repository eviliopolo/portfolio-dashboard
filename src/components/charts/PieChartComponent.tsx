import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { MetricasGraficos } from '../../types';
import { getProjectColor } from '../../utils/formatters';

interface PieChartComponentProps {
  data: MetricasGraficos[];
}

export default function PieChartComponent({ data }: PieChartComponentProps) {
  // Filtrar datos que tengan Proyecto y Horas
  const chartData = data
    .filter(item => item.Proyecto && item.Horas)
    .map(item => ({
      name: item.Proyecto as string,
      value: Number(item.Horas),
      color: getProjectColor(item.Proyecto as string),
    }))
    .sort((a, b) => b.value - a.value);

  const COLORS = chartData.map(item => item.color);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-bg-secondary border-2 border-accent-cyan rounded-lg p-3 shadow-neon-cyan">
          <p className="font-rajdhani font-bold text-text-primary">{data.name}</p>
          <p className="font-orbitron text-accent-cyan">
            {data.value.toLocaleString()} horas
          </p>
          <p className="text-text-secondary text-sm">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-bg-secondary p-6 rounded-lg border-2 border-accent-cyan shadow-neon-cyan"
    >
      <h3 className="text-xl font-rajdhani font-bold text-accent-cyan mb-6 uppercase">
        Distribución de Horas por Proyecto
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => 
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: '#e6e6e6', fontFamily: 'Rajdhani' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

