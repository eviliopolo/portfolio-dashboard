import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Recurso } from '../../types';
import { formatPercentage, getStatusColor } from '../../utils/formatters';

interface BarChartComponentProps {
  recursos: Recurso[];
}

export default function BarChartComponent({ recursos }: BarChartComponentProps) {
  const chartData = [...recursos]
    .sort((a, b) => b.Ocupacion - a.Ocupacion)
    .map((recurso) => ({
      name: recurso.Recurso,
      ocupacion: recurso.Ocupacion,
      status: getStatusColor(recurso.Ocupacion),
    }));

  const getBarColor = (status: string) => {
    switch (status) {
      case 'critical': return '#000000';
      case 'warning': return '#333333';
      case 'normal': return '#666666';
      case 'good': return '#999999';
      default: return '#666666';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white border border-border-color rounded p-3 shadow-report">
          <p className="font-sans font-semibold text-text-primary">{data.payload.name}</p>
          <p className="font-sans text-text-primary">
            {formatPercentage(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded border border-border-color shadow-report-md"
    >
      <h3 className="text-xl font-sans font-bold text-text-primary mb-6 uppercase tracking-wide">
        Ocupación por Recurso
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
          <XAxis 
            type="number" 
            domain={[0, 120]}
            stroke="#666666"
            fontFamily="Inter, sans-serif"
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#666666"
            fontFamily="Inter, sans-serif"
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            x={100} 
            stroke="#333333" 
            strokeDasharray="5 5" 
            label={{ value: "100%", position: "top", fill: "#333333", fontFamily: "Inter, sans-serif" }}
          />
          <Bar 
            dataKey="ocupacion" 
            radius={[0, 8, 8, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.status)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

