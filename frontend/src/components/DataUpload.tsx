import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Upload, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useImportHistory, useUploadFile, useTriggerImport } from '../hooks/useDataImport';
import type { ImportResult, DataImport } from '../types';

function DataUpload() {
  const [result, setResult] = useState<ImportResult | null>(null);

  // React Query hooks
  const { data: importHistory = [], isLoading: historyLoading } = useImportHistory();
  const uploadMutation = useUploadFile();
  const triggerMutation = useTriggerImport();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);

    try {
      const data = await uploadMutation.mutateAsync(file);
      setResult(data);
    } catch (error) {
      // Error is handled by mutation
    }
  };

  const handleTriggerImport = async () => {
    setResult(null);

    try {
      const data = await triggerMutation.mutateAsync();
      setResult(data);
    } catch (error) {
      // Error is handled by mutation
    }
  };

  const isUploading = uploadMutation.isPending || triggerMutation.isPending;
  const error = uploadMutation.error || triggerMutation.error;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div>
         <h2 className="text-1xl text-center font-bold text-gray-900 mb-2">Upload Excel files or import from default data source</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Excel File
          </CardTitle>
          <CardDescription>
            Upload a new Excel file to update the dashboard data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <label htmlFor="file-upload">
              <Button 
                variant="default" 
                disabled={isUploading}
                className="cursor-pointer"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Choose Excel File'}
                </span>
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            <Button 
              onClick={handleTriggerImport}
              disabled={isUploading}
              variant="secondary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Import from Default File
            </Button>
          </div>

          {isUploading && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-blue-900 font-medium">Importing data...</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Import Successful!</h4>
              </div>
              <p className="text-green-800">
                <strong>Total Records:</strong> {result.recordCount?.toLocaleString()}
              </p>
              {result.breakdown && (
                <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                  <div>📝 Keywords: {result.breakdown.keywords}</div>
                  <div>🌍 Regional: {result.breakdown.regional}</div>
                  <div>📈 Monthly: {result.breakdown.monthly}</div>
                  <div>📡 Channels: {result.breakdown.channels}</div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-900">Import Failed</h4>
              </div>
              <p className="text-red-700 mt-2">{error.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
          <CardDescription>Recent data import operations</CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <p className="text-gray-500 text-center py-8">Loading history...</p>
          ) : importHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8 italic">No import history yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Records</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">File</th>
                  </tr>
                </thead>
                <tbody>
                  {importHistory.map((item: DataImport) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(item.importedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status === 'success' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.recordCount?.toLocaleString() || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono text-sm">
                        {item.filename.split('/').pop()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DataUpload;
