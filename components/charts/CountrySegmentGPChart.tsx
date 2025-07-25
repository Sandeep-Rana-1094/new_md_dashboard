import React, { useMemo } from 'react';
import { GPData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ChartEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-muted space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6" />
        </svg>
        <p className="text-sm">No data to display for this selection.</p>
    </div>
);

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899', '#ef4444', '#10b981', '#64748b'];

const CountrySegmentGPChart: React.FC<{ data: GPData[] }> = ({ data }) => {
  const { chartData, segments } = useMemo(() => {
    if (!data || data.length === 0) {
      return { chartData: [], segments: [] };
    }

    const uniqueSegments = [...new Set(data.map(item => item.segment))].sort();
    
    interface PivotDataRow {
      name: string;
      [key: string]: string | number;
    }
    const pivotData: { [country: string]: PivotDataRow } = {};

    data.forEach(item => {
      if (!pivotData[item.country]) {
        pivotData[item.country] = { name: item.country };
        uniqueSegments.forEach(seg => {
          pivotData[item.country][seg] = 0;
        });
      }
      pivotData[item.country][item.segment] = (pivotData[item.country][item.segment] as number) + item.gp;
    });

    const chartData = Object.values(pivotData).sort((a, b) => {
        const totalA = uniqueSegments.reduce((sum, seg) => sum + ((a[seg] as number) || 0), 0);
        const totalB = uniqueSegments.reduce((sum, seg) => sum + ((b[seg] as number) || 0), 0);
        return totalB - totalA;
    });

    return { chartData, segments: uniqueSegments };
  }, [data]);

  return (
    <div className="bg-surface/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border-default h-[500px]"> 
      <h3 className="text-lg font-semibold text-text-primary mb-4">Gross Profit by Country and Segment</h3>
       {chartData.length > 0 ?
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 85 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} interval={0} tick={{fontSize: 12, fill: '#94a3b8'}} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} tickFormatter={(value) => `$${(Number(value) / 1000).toLocaleString()}k`} />
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
              }} 
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} 
              itemStyle={{ color: '#f1f5f9' }}
              labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend verticalAlign="top" wrapperStyle={{ color: '#94a3b8', marginBottom: '20px' }}/>
            {segments.map((segment, index) => (
              <Bar
                key={segment}
                dataKey={segment}
                stackId="a"
                fill={COLORS[index % COLORS.length]}
                name={segment}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
       :
        <ChartEmptyState />
       }
    </div>
  );
};

export default CountrySegmentGPChart;