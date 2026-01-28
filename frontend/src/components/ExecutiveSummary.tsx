import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { useExecutiveSummary } from '../hooks/useMetrics';
import GeoBreakdown from './GeoBreakdown';

function ExecutiveSummary() {
  const { data: summary, isLoading, error } = useExecutiveSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !summary) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-800">Failed to load executive summary</p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
        <p className="text-gray-600 mt-1">Key metrics for {summary.currentMonth}</p>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex gap-6 min-w-[880px]">
          {/* MRR Card */}
          <Card className="flex-1 min-w-[200px]">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Monthly Recurring Revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(summary.mrr.current)}
            </div>
            <div className={`flex items-center gap-1 text-sm mt-2 ${
              summary.mrr.growth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {summary.mrr.growth >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">{formatPercent(summary.mrr.growth)}</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
          </Card>

          {/* Signups Card */}
          <Card className="flex-1 min-w-[200px]">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Unique Signups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {summary.signups.current.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-sm mt-2 ${
              summary.signups.growth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {summary.signups.growth >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">{formatPercent(summary.signups.growth)}</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
          </Card>

          {/* Churn Rate Card */}
          <Card className="flex-1 min-w-[200px]">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Churn Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              summary.churnRate > 0.05 ? 'text-red-600' : 'text-gray-900'
            }`}>
              {(summary.churnRate * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {summary.churnRate > 0.05 ? (
                <span className="text-red-600 font-medium">⚠️ Above 5% threshold</span>
              ) : (
                <span className="text-green-600 font-medium">✓ Within normal range</span>
              )}
            </div>
          </CardContent>
          </Card>

          {/* Conversion Rates Card */}
          <Card className="flex-1 min-w-[200px]">
          <CardHeader className="pb-2">
            <CardDescription>Conversion Rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-600">Signup → Trial</div>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.conversionRates.signupToTrial.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Trial → Paid</div>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.conversionRates.trialToPaid.toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
          </Card>
        </div>
      </div>

      {/* Geographic breakdown drilldown */}
      <GeoBreakdown />
    </div>
  );
}

export default ExecutiveSummary;
