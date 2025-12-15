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
      case 'critical': return '#e16162';
      case 'warning': return '#ffa500';
      case 'normal': return '#00d2ff';
      case 'good': return '#00ff87';
      default: return '#00d2ff';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-bg-secondary border-2 border-accent-cyan rounded-lg p-3 shadow-neon-cyan">
          <p className="font-rajdhani font-bold text-text-primary">{data.payload.name}</p>
          <p className="font-orbitron text-accent-cyan">
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
      className="bg-bg-secondary p-6 rounded-lg border-2 border-accent-cyan shadow-neon-cyan"
    >
      <h3 className="text-xl font-rajdhani font-bold text-accent-cyan mb-6 uppercase">
        Ocupación por Recurso
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
          <XAxis 
            type="number" 
            domain={[0, 120]}
            stroke="#a6a6a6"
            fontFamily="Rajdhani"
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#a6a6a6"
            fontFamily="Rajdhani"
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            x={100} 
            stroke="#ffa500" 
            strokeDasharray="5 5" 
            label={{ value: "100%", position: "top", fill: "#ffa500", fontFamily: "Rajdhani" }}
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

