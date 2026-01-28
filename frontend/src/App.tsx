import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import DataUpload from './components/DataUpload'
import SchedulerControl from './components/SchedulerControl'
import './App.css'

type TabType = 'dashboard' | 'upload' | 'scheduler';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h2 className="text-3xl text-center font-bold text-gray-900">
           Sales Analytics Platform
          </h2>
          </div>   
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'upload'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📥 Upload Data
            </button>
            <button
              onClick={() => setActiveTab('scheduler')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'scheduler'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⏰ Automatic Updates
            </button>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'upload' && <DataUpload />}
        {activeTab === 'scheduler' && <SchedulerControl />}
      </main>
    </div>
  )
}

export default App
