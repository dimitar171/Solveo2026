import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';

interface Alert {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  count?: number;
  details?: any[];
  value?: number;
}

function renderDetailsTable(details: any[]) {
  if (!details || details.length === 0) return null;

  // Use first item to derive columns; fall back to JSON if it's not an object
  const first = details[0];
  if (first === null || typeof first !== 'object' || Array.isArray(first)) {
    return (
      <div className="space-y-1">
        {details.slice(0, 5).map((detail, i) => (
          <div
            key={i}
            className="text-xs text-gray-700 bg-white bg-opacity-50 p-2 rounded font-mono whitespace-pre-wrap"
          >
            {JSON.stringify(detail, null, 2)}
          </div>
        ))}
      </div>
    );
  }

  const columns = Object.keys(first);

  return (
    <div className="mt-2 overflow-x-auto">
      <table className="min-w-full text-xs text-left border border-gray-200 bg-white bg-opacity-60 rounded">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col}
                className={`px-2 py-1 font-semibold text-gray-700 border-b border-gray-200 ${
                  idx !== columns.length - 1 ? 'border-r border-gray-200' : ''
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {details.slice(0, 5).map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              {columns.map((col, idx) => (
                <td
                  key={col}
                  className={`px-2 py-1 text-gray-800 border-t border-gray-100 ${
                    idx !== columns.length - 1 ? 'border-r border-gray-200' : ''
                  }`}
                >
                  {typeof row[col] === 'number'
                    ? row[col].toLocaleString(undefined, {
                        minimumFractionDigits: Number.isInteger(row[col]) ? 0 : 2,
                        maximumFractionDigits: 2,
                      })
                    : String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {details.length > 5 && (
        <p className="mt-1 text-[11px] text-gray-500">
          Showing first 5 of {details.length} items.
        </p>
      )}
    </div>
  );
}

function Alerts() {
  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const result: any = await response.json();
      return result.alerts || [];
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    // Strong left border + soft background via Tailwind
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'high':
        return 'border-l-4 border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-4 border-yellow-400 bg-yellow-50';
      default:
        return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-900';
      case 'high':
        return 'text-orange-900';
      case 'medium':
        return 'text-yellow-900';
      default:
        return 'text-blue-900';
    }
  };

  const hasAlerts = alerts.length > 0;

  // Determine highest severity present for compact header marker
  const highestSeverity: Alert['severity'] | null = hasAlerts
    ? alerts.some(a => a.severity === 'critical')
      ? 'critical'
      : alerts.some(a => a.severity === 'high')
      ? 'high'
      : alerts.some(a => a.severity === 'medium')
      ? 'medium'
      : 'low'
    : null;

  const highestSeverityLabel =
    highestSeverity === 'critical'
      ? 'Critical'
      : highestSeverity === 'high'
      ? 'High'
      : highestSeverity === 'medium'
      ? 'Medium'
      : 'Low';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Alerts & Problem Areas</CardTitle>
          <CardDescription
            className={
              hasAlerts
                ? 'text-red-700 font-semibold border border-red-300 bg-red-50 rounded px-2 py-1 inline-block mt-1'
                : ''
            }
          >
            Automatically detected issues requiring attention
          </CardDescription>
        </div>

        {/* Compact marker showing if there are alerts */}
        <div className="flex items-center gap-2 text-xs">
          {isLoading ? (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500">
              Checking alerts…
            </span>
          ) : !hasAlerts ? (
            <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
              ✓ No active alerts
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-900 text-white">
              <span
                className={`w-2 h-2 rounded-full ${
                  highestSeverity === 'critical'
                    ? 'bg-red-400'
                    : highestSeverity === 'high'
                    ? 'bg-orange-400'
                    : highestSeverity === 'medium'
                    ? 'bg-yellow-300'
                    : 'bg-blue-400'
                }`}
              />
              <span>
                {alerts.length} alert{alerts.length > 1 ? 's' : ''} ({highestSeverityLabel})
              </span>
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="p-3 border border-gray-100 rounded-lg bg-gray-50 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : !hasAlerts ? (
          // When there are no alerts, header marker is enough — keep body minimal
          <p className="text-xs text-gray-500">
            System will surface alerts here when issues are detected.
          </p>
        ) : (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              View alert details
            </summary>
            <div className="mt-3 space-y-4">
              {alerts.map((alert, index) => (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg ${getSeverityClass(alert.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-semibold ${getSeverityTextColor(alert.severity)}`}>
                          {alert.title}
                        </h4>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          alert.severity === 'critical' ? 'bg-red-200 text-red-800' :
                          alert.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                          alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className={`text-sm ${getSeverityTextColor(alert.severity)}`}>
                        {alert.message}
                      </p>
                      
                      {alert.details && alert.details.length > 0 && (
                        <details className="mt-3">
                          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                            View Details ({alert.details.length} items)
                          </summary>
                          {renderDetailsTable(alert.details)}
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

export default Alerts;
