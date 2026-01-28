import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Play, Square, Settings, Info, Clock } from 'lucide-react';
import { 
  useSchedulerStatus, 
  useStartScheduler, 
  useStopScheduler, 
  useUpdateSchedulerConfig 
} from '../hooks/useScheduler';
import type { SchedulerConfig } from '../types';

function SchedulerControl() {
  const [config, setConfig] = useState<SchedulerConfig>({
    cronExpression: '0 2 * * *',
    enabled: false,
    dataFilePath: 'uploads/ai_coding_agent_dashboard_data.xlsx'
  });

  // React Query hooks
  const { data: status, isLoading } = useSchedulerStatus();
  const startMutation = useStartScheduler();
  const stopMutation = useStopScheduler();
  const updateConfigMutation = useUpdateSchedulerConfig();

  // Update local config when status changes
  useEffect(() => {
    if (status) {
      setConfig({
        cronExpression: status.cronExpression,
        enabled: status.enabled,
        dataFilePath: status.dataFilePath || 'uploads/ai_coding_agent_dashboard_data.xlsx'
      });
    }
  }, [status]);

  const handleStart = async () => {
    try {
      await startMutation.mutateAsync();
    } catch (error) {
      alert(`Failed to start scheduler: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleStop = async () => {
    try {
      await stopMutation.mutateAsync();
    } catch (error) {
      alert(`Failed to stop scheduler: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdateConfig = async () => {
    try {
      await updateConfigMutation.mutateAsync(config);
      alert('Configuration updated successfully!');
    } catch (error) {
      alert(`Failed to update configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const cronDescriptions: Record<string, string> = {
    '* * * * *': 'Every minute (testing only)',
    '*/5 * * * *': 'Every 5 minutes',
    '0 * * * *': 'Every hour',
    '0 */6 * * *': 'Every 6 hours',
    '0 2 * * *': 'Daily at 2 AM (recommended)',
    '0 0 * * 0': 'Weekly on Sunday',
    '0 0 1 * *': 'Monthly on the 1st'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Clock className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2">Loading scheduler status...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div>
         <h2 className="text-1xl text-center font-bold text-gray-900 mb-2">Configure scheduled imports and monitor status</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduler Status</CardTitle>
          <CardDescription>Current state of the automatic data import scheduler</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Status</p>
              <p className={`text-lg font-semibold flex items-center gap-2 ${
                status?.isRunning ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  status?.isRunning ? 'bg-green-600 animate-pulse' : 'bg-red-600'
                }`}></span>
                {status?.isRunning ? 'Running' : 'Stopped'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Schedule</p>
              <p className="text-lg font-semibold text-gray-900">
                {cronDescriptions[status?.cronExpression || ''] || status?.cronExpression}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Enabled</p>
              <p className="text-lg font-semibold text-gray-900">
                {status?.enabled ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-1">Data Source</p>
            <p className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-2 rounded">
              {status?.dataFilePath}
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={handleStart}
              disabled={status?.isRunning || startMutation.isPending}
              variant="default"
            >
              <Play className="w-4 h-4 mr-2" />
              {startMutation.isPending ? 'Starting...' : 'Start Scheduler'}
            </Button>
            <Button 
              onClick={handleStop}
              disabled={!status?.isRunning || stopMutation.isPending}
              variant="destructive"
            >
              <Square className="w-4 h-4 mr-2" />
              {stopMutation.isPending ? 'Stopping...' : 'Stop Scheduler'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration
          </CardTitle>
          <CardDescription>Adjust scheduler settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cron-expression" className="text-sm font-medium text-gray-700">
              Schedule (Cron Expression)
            </label>
            <select
              id="cron-expression"
              value={config.cronExpression}
              onChange={(e) => setConfig({ ...config, cronExpression: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="*/5 * * * *">Every 5 minutes (testing)</option>
              <option value="0 * * * *">Every hour</option>
              <option value="0 */6 * * *">Every 6 hours</option>
              <option value="0 2 * * *">Daily at 2 AM (recommended)</option>
              <option value="0 0 * * 0">Weekly on Sunday</option>
              <option value="0 0 1 * *">Monthly on the 1st</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="data-file-path" className="text-sm font-medium text-gray-700">
              Data Source File Path
            </label>
            <input
              type="text"
              id="data-file-path"
              value={config.dataFilePath}
              onChange={(e) => setConfig({ ...config, dataFilePath: e.target.value })}
              placeholder="uploads/ai_coding_agent_dashboard_data.xlsx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Path to the Excel file on the server (relative to backend directory)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
              Enable automatic updates
            </label>
          </div>

          <Button 
            onClick={handleUpdateConfig} 
            variant="default" 
            className="w-full"
            disabled={updateConfigMutation.isPending}
          >
            <Settings className="w-4 h-4 mr-2" />
            {updateConfigMutation.isPending ? 'Saving...' : 'Save Configuration'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">How It Works</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>When enabled, the scheduler automatically imports data at the specified time</li>
                <li>Data is imported from the configured file location</li>
                <li>All imports are logged in the Import History</li>
                <li>You can also manually upload files anytime using the Upload section above</li>
                <li>Status updates automatically every 10 seconds</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SchedulerControl;
