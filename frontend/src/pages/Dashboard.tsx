import ExecutiveSummary from '../components/ExecutiveSummary';
import TrendChart from '../components/TrendChart';
import FunnelChart from '../components/FunnelChart';
import Alerts from '../components/Alerts';

function Dashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl text-center font-bold text-gray-900 mb-2">Dashboard</h2>
     </div>

      {/* Alerts - Show first */}
      <Alerts />

      {/* Executive Summary */}
      <ExecutiveSummary />

      {/* Trend Chart */}
      <TrendChart />

      {/* Funnel Visualization */}
      <FunnelChart />
    </div>
  );
}

export default Dashboard;
