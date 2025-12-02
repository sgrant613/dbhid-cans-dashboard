import React, { useState } from 'react'
import DBHDIDDashboard from './components/DBHDIDDashboard'
import EHRArchitectureDiagram from './components/EHRArchitectureDiagram'

export default function App() {
  const [activeComponent, setActiveComponent] = useState('dashboard')

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-white font-bold">Kentucky DBHDID CANS Presentation</span>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveComponent('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeComponent === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Dashboard Demo
            </button>
            <button
              onClick={() => setActiveComponent('architecture')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeComponent === 'architecture'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              EHR Architecture
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-16">
        {activeComponent === 'dashboard' && <DBHDIDDashboard />}
        {activeComponent === 'architecture' && <EHRArchitectureDiagram />}
      </div>
    </div>
  )
}