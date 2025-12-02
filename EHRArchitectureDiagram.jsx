import React, { useState } from 'react';

const EHRArchitectureDiagram = () => {
  const [hoveredCMHC, setHoveredCMHC] = useState(null);
  const [hoveredLayer, setHoveredLayer] = useState(null);

  // CMHC data with EHR systems (confirmed + likely based on market)
  const cmhcData = [
    { id: 1, name: 'Four Rivers', location: 'Paducah', ehr: 'Unknown', ehrColor: '#6b7280', counties: 9 },
    { id: 2, name: 'RiverValley', location: 'Owensboro', ehr: 'Unknown', ehrColor: '#6b7280', counties: 7 },
    { id: 3, name: 'Pennyroyal', location: 'Hopkinsville', ehr: 'Unknown', ehrColor: '#6b7280', counties: 8 },
    { id: 4, name: 'LifeSkills', location: 'Bowling Green', ehr: 'Unknown', ehrColor: '#6b7280', counties: 10 },
    { id: 5, name: 'Communicare', location: 'Elizabethtown', ehr: 'Unknown', ehrColor: '#6b7280', counties: 8 },
    { id: 6, name: 'Seven Counties', location: 'Louisville', ehr: 'Unknown', ehrColor: '#6b7280', counties: 7, large: true },
    { id: 7, name: 'NorthKey', location: 'Covington', ehr: 'Unknown', ehrColor: '#6b7280', counties: 8 },
    { id: 8, name: 'Comprehend', location: 'Maysville', ehr: 'Unknown', ehrColor: '#6b7280', counties: 8 },
    { id: 9, name: 'Pathways', location: 'Ashland', ehr: 'Netsmart', ehrColor: '#3b82f6', counties: 5, confirmed: true },
    { id: 10, name: 'New Vista', location: 'Lexington', ehr: 'Unknown', ehrColor: '#6b7280', counties: 17 },
    { id: 11, name: 'Adanta', location: 'Somerset', ehr: 'Unknown', ehrColor: '#6b7280', counties: 10 },
    { id: 12, name: 'Cumberland River', location: 'Corbin', ehr: 'Unknown', ehrColor: '#6b7280', counties: 8 },
    { id: 13, name: 'KY River Community Care', location: 'Hazard', ehr: 'Qualifacts', ehrColor: '#10b981', counties: 8, confirmed: true },
    { id: 14, name: 'Mountain Comprehensive', location: 'Prestonsburg', ehr: 'Unknown', ehrColor: '#6b7280', counties: 7 },
  ];

  // EHR vendor summary
  const ehrVendors = [
    { name: 'Netsmart', color: '#3b82f6', confirmed: 1, products: 'myAvatar, myEvolv' },
    { name: 'Qualifacts', color: '#10b981', confirmed: 1, products: 'Credible, CareLogic' },
    { name: 'Unknown/Other', color: '#6b7280', confirmed: 12, products: 'Various systems' },
  ];

  const layers = [
    {
      id: 'dbhdid',
      name: 'DBHDID State Oversight',
      subtitle: 'Unified Population Visibility',
      color: '#1e3a5f',
      gradient: 'from-blue-900 to-blue-800',
      items: ['Statewide Dashboard', 'Federal Reporting', 'Resource Allocation', 'Quality Oversight']
    },
    {
      id: 'cans',
      name: 'Objective Arts CANS Platform',
      subtitle: 'EHR-Agnostic Assessment Layer',
      color: '#7c3aed',
      gradient: 'from-purple-700 to-purple-600',
      items: ['Kentucky CANS 5+ 2.0', 'Unified Data Model', 'Cross-Center Analytics', 'Outcome Tracking']
    },
    {
      id: 'barrier',
      name: 'Integration Barrier',
      subtitle: 'Without unified layer, data stays siloed',
      color: '#dc2626',
      isBarrier: true
    },
    {
      id: 'ehr',
      name: 'Fragmented EHR Systems',
      subtitle: '14 CMHCs × Multiple Vendors = Data Silos',
      color: '#374151',
      gradient: 'from-gray-700 to-gray-600',
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          EHR-Agnostic Architecture
        </h1>
        <p className="text-slate-400 text-lg">
          How Objective Arts provides unified CANS visibility above fragmented infrastructure
        </p>
      </div>

      {/* Main Architecture Stack */}
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* DBHDID Layer */}
        <div 
          className={`relative rounded-xl p-6 bg-gradient-to-r from-blue-900 to-blue-800 border-2 transition-all duration-300 ${
            hoveredLayer === 'dbhdid' ? 'border-blue-400 shadow-lg shadow-blue-500/30' : 'border-blue-700'
          }`}
          onMouseEnter={() => setHoveredLayer('dbhdid')}
          onMouseLeave={() => setHoveredLayer(null)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-700 flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">DBHDID State Oversight</h2>
                  <p className="text-blue-300 text-sm">Unified Population Visibility Across All 120 Counties</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {['Statewide Dashboard', 'Federal Reporting', 'Resource Allocation', 'Quality Oversight'].map((item, i) => (
                <div key={i} className="px-3 py-2 bg-blue-800/50 rounded-lg border border-blue-600">
                  <span className="text-blue-200 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connection Arrow Down */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" transform="rotate(90 12 12)"/>
            </svg>
            <span className="text-purple-400 text-xs font-medium">Unified Data Flow</span>
          </div>
        </div>

        {/* Objective Arts CANS Platform Layer */}
        <div 
          className={`relative rounded-xl p-6 bg-gradient-to-r from-purple-700 to-purple-600 border-2 transition-all duration-300 ${
            hoveredLayer === 'cans' ? 'border-purple-300 shadow-lg shadow-purple-500/40' : 'border-purple-500'
          }`}
          onMouseEnter={() => setHoveredLayer('cans')}
          onMouseLeave={() => setHoveredLayer(null)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Objective Arts CANS Platform</h2>
                <p className="text-purple-200 text-sm">EHR-Agnostic Unified Assessment Layer</p>
              </div>
            </div>
            <div className="bg-purple-800/50 px-4 py-2 rounded-lg border border-purple-400">
              <span className="text-purple-100 font-bold">Kentucky CANS 5+ 2.0</span>
            </div>
          </div>
          
          {/* Platform Capabilities */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '🔗', label: 'Works with ANY EHR', desc: 'Netsmart, Qualifacts, others' },
              { icon: '📊', label: 'Unified Data Model', desc: 'Single source of truth' },
              { icon: '🎯', label: 'Cross-Center Analytics', desc: 'Compare all 14 CMHCs' },
              { icon: '📈', label: 'Outcome Tracking', desc: 'Severity → resolution' },
            ].map((item, i) => (
              <div key={i} className="bg-purple-800/40 rounded-lg p-3 border border-purple-500/50">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-white font-semibold text-sm">{item.label}</div>
                <div className="text-purple-300 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Key Value Prop */}
          <div className="mt-4 bg-purple-900/50 rounded-lg p-3 border border-purple-400/50">
            <p className="text-purple-100 text-center text-sm">
              <span className="font-bold">Key Value:</span> DBHDID gets unified visibility regardless of which EHR each CMHC chose independently
            </p>
          </div>
        </div>

        {/* Integration Arrows */}
        <div className="flex justify-around items-center py-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" transform="rotate(90 12 12)"/>
              </svg>
            </div>
          ))}
        </div>

        {/* Barrier Visualization - What happens WITHOUT unified layer */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-red-900/90 px-6 py-2 rounded-full border-2 border-red-500 shadow-lg">
              <span className="text-red-200 font-bold text-sm">
                ⚠️ WITHOUT UNIFIED LAYER: Data stays siloed in each EHR
              </span>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60"></div>
        </div>

        {/* EHR Vendor Legend */}
        <div className="flex justify-center gap-6 py-4">
          {ehrVendors.map((vendor, i) => (
            <div key={i} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: vendor.color }}
              ></div>
              <span className="text-slate-300 text-sm">
                {vendor.name} 
                <span className="text-slate-500 ml-1">
                  ({vendor.confirmed} confirmed)
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* CMHC / EHR Layer */}
        <div 
          className={`relative rounded-xl p-6 bg-gradient-to-r from-gray-800 to-gray-700 border-2 transition-all duration-300 ${
            hoveredLayer === 'ehr' ? 'border-gray-400 shadow-lg shadow-gray-500/20' : 'border-gray-600'
          }`}
          onMouseEnter={() => setHoveredLayer('ehr')}
          onMouseLeave={() => setHoveredLayer(null)}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">14 CMHCs × Multiple EHR Vendors = Fragmented Data</h2>
              <p className="text-gray-400 text-sm">Each center chose independently • No standardization • 120 counties</p>
            </div>
          </div>

          {/* CMHC Grid */}
          <div className="grid grid-cols-7 gap-2">
            {cmhcData.map((cmhc) => (
              <div
                key={cmhc.id}
                className={`relative p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                  hoveredCMHC === cmhc.id 
                    ? 'bg-gray-600 border-gray-400 shadow-lg scale-105 z-10' 
                    : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50'
                }`}
                onMouseEnter={() => setHoveredCMHC(cmhc.id)}
                onMouseLeave={() => setHoveredCMHC(null)}
              >
                {/* EHR indicator dot */}
                <div 
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${cmhc.confirmed ? 'ring-2 ring-white/30' : ''}`}
                  style={{ backgroundColor: cmhc.ehrColor }}
                  title={cmhc.ehr}
                ></div>
                
                <div className="text-white text-xs font-semibold truncate">{cmhc.name}</div>
                <div className="text-gray-400 text-xs truncate">{cmhc.location}</div>
                <div className="text-gray-500 text-xs">{cmhc.counties} counties</div>
                
                {/* Expanded info on hover */}
                {hoveredCMHC === cmhc.id && (
                  <div className="absolute left-0 right-0 -bottom-16 bg-gray-800 rounded-lg p-2 border border-gray-500 shadow-xl z-20">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: cmhc.ehrColor }}
                      ></div>
                      <span className="text-white text-xs font-medium">
                        {cmhc.ehr}
                        {cmhc.confirmed && <span className="text-green-400 ml-1">✓</span>}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Summary Stats */}
      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-4 gap-4">
        {[
          { value: '14', label: 'CMHCs', sublabel: 'Independent organizations' },
          { value: '3+', label: 'EHR Vendors', sublabel: 'Netsmart, Qualifacts, others' },
          { value: '120', label: 'Counties', sublabel: 'Full state coverage' },
          { value: '1', label: 'Unified Layer', sublabel: 'Objective Arts CANS' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-slate-300 font-medium">{stat.label}</div>
            <div className="text-slate-500 text-sm">{stat.sublabel}</div>
          </div>
        ))}
      </div>

      {/* Key Talking Point */}
      <div className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
          <span className="text-2xl">💬</span> Key Talking Point for DBHDID
        </h3>
        <p className="text-slate-300 italic">
          "Your 14 CMHCs independently chose different EHR systems—that's 14 separate data silos with no native interoperability. 
          Objective Arts sits above all of them as an EHR-agnostic layer, giving you unified CANS visibility across every center, 
          every county, regardless of their underlying technology choices. You get one dashboard, one data model, one source of truth 
          for population-level outcomes—something no single EHR vendor can provide across competitors' systems."
        </p>
      </div>
    </div>
  );
};

export default EHRArchitectureDiagram;
