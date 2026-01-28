import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTrends } from '../hooks/useMetrics';

function TrendChart() {
  const [metric, setMetric] = useState<string>('mrr');
  const [period, setPeriod] = useState<number>(12);

  const { data: trendData, isLoading } = useTrends(metric, period);

  const metricLabels: Record<string, string> = {
    mrr: 'Monthly Recurring Revenue',
    signups: 'Unique Signups',
    traffic: 'Website Traffic',
    churn: 'Churn Rate (%)',
    conversions: 'Paid Conversions'
  };

  const formatValue = (value: number) => {
    if (metric === 'mrr') {
      return `$${(value / 1000).toFixed(0)}k`;
    } else if (metric === 'churn') {
      return `${value.toFixed(2)}%`;
    } else {
      return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trends Over Time</CardTitle>
            <CardDescription>{metricLabels[metric]}</CardDescription>
          </div>
          <div className="flex gap-3">
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mrr">MRR</option>
              <option value="signups">Signups</option>
              <option value="traffic">Traffic</option>
              <option value="churn">Churn</option>
              <option value="conversions">Conversions</option>
            </select>
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="6">Last 6 months</option>
              <option value="12">Last 12 months</option>
              <option value="24">Last 24 months</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Loading chart...</p>
          </div>
        ) : !trendData || trendData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={formatValue}
              />
              <Tooltip
                formatter={(value) => formatValue(value as number)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name={metricLabels[metric]}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default TrendChart;
