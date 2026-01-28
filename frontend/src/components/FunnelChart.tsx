import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useFunnel, useAvailableMonths } from '../hooks/useMetrics';
import { TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

function FunnelChart() {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);

  const { data: funnelData, isLoading } = useFunnel(selectedMonth);
  const { data: months = [] } = useAvailableMonths();

  const getStageColor = (index: number) => {
    const colors = ['bg-blue-600', 'bg-blue-500', 'bg-blue-400', 'bg-blue-300'];
    return colors[index] || 'bg-gray-400';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>
              {funnelData ? `Traffic → Signup → Trial → Paid for ${funnelData.month}` : 'Loading...'}
            </CardDescription>
          </div>
          <select
            value={selectedMonth || ''}
            onChange={(e) => setSelectedMonth(e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Latest Month</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500">Loading funnel...</p>
          </div>
        ) : !funnelData ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500">No data available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Graphic funnel chart */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[480px] flex justify-center">
                <BarChart
                  width={560}
                  height={260}
                  data={funnelData.stages}
                  layout="vertical"
                  margin={{ top: 16, right: 24, bottom: 16, left: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => Number(value).toLocaleString()}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value: any, _name, props: any) => {
                      const stage = props?.payload;
                      const parts: string[] = [];
                      parts.push(`${Number(value).toLocaleString()} contacts`);
                      if (stage?.conversionFromPrevious != null) {
                        parts.push(`${stage.conversionFromPrevious.toFixed(1)}% from previous`);
                      }
                      if (stage?.dropoff != null && stage.dropoff > 0) {
                        parts.push(`${stage.dropoff.toLocaleString()} dropped off`);
                      }
                      return [parts.join(' • '), ''];
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                    {funnelData.stages.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? '#3b82f6'
                            : index === 1
                            ? '#60a5fa'
                            : index === 2
                            ? '#93c5fd'
                            : '#bfdbfe'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </div>

            {/* Overall Conversion (summary table) */}
            <div className="pt-6 border-t">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="mb-3">
                  <div className="text-sm text-blue-800 font-semibold uppercase tracking-wide">
                    Overall Conversion
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-blue-900">
                      {funnelData.overallConversion.toFixed(2)}%
                    </span>
                    <span className="text-xs text-blue-700">
                      Traffic → Paid customer
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left border border-blue-100 bg-white/70 rounded">
                    <thead className="bg-blue-100/80">
                      <tr>
                        <th className="px-3 py-2 font-semibold text-blue-900 border-b border-r border-blue-100">
                          Stage
                        </th>
                        <th className="px-3 py-2 font-semibold text-blue-900 border-b border-r border-blue-100">
                          Volume
                        </th>
                        <th className="px-3 py-2 font-semibold text-blue-900 border-b border-r border-blue-100">
                          % of Traffic
                        </th>
                        <th className="px-3 py-2 font-semibold text-blue-900 border-b border-blue-100">
                          From Previous
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {funnelData.stages.map((stage) => (
                        <tr key={stage.name} className="odd:bg-white even:bg-blue-50/40">
                          <td className="px-3 py-2 text-blue-900 border-t border-r border-blue-100">
                            {stage.name}
                          </td>
                          <td className="px-3 py-2 text-blue-900 border-t border-r border-blue-100">
                            {stage.value.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-blue-900 border-t border-r border-blue-100">
                            {stage.percentage.toFixed(1)}%
                          </td>
                          <td className="px-3 py-2 text-blue-900 border-t border-blue-100">
                            {stage.conversionFromPrevious !== null
                              ? `${stage.conversionFromPrevious.toFixed(1)}%`
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FunnelChart;
