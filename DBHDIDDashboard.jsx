import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Simulated data for 14 CMHCs
const cmhcData = [
  { id: 1, name: "Four Rivers", region: 1, counties: 9, caseload: 342, avgIntakeSeverity: 2.4, outcomeImprovement: 68, alerts: 1, city: "Paducah" },
  { id: 2, name: "RiverValley", region: 1, counties: 7, caseload: 289, avgIntakeSeverity: 2.1, outcomeImprovement: 72, alerts: 0, city: "Owensboro" },
  { id: 3, name: "Pennyroyal", region: 1, counties: 9, caseload: 315, avgIntakeSeverity: 2.3, outcomeImprovement: 65, alerts: 0, city: "Hopkinsville" },
  { id: 4, name: "Communicare", region: 2, counties: 8, caseload: 278, avgIntakeSeverity: 2.0, outcomeImprovement: 74, alerts: 0, city: "Elizabethtown" },
  { id: 5, name: "LifeSkills", region: 2, counties: 10, caseload: 412, avgIntakeSeverity: 2.2, outcomeImprovement: 71, alerts: 0, city: "Bowling Green" },
  { id: 6, name: "Adanta", region: 3, counties: 10, caseload: 267, avgIntakeSeverity: 2.5, outcomeImprovement: 63, alerts: 2, city: "Somerset" },
  { id: 7, name: "Cumberland River", region: 3, counties: 13, caseload: 389, avgIntakeSeverity: 2.7, outcomeImprovement: 58, alerts: 3, city: "Corbin" },
  { id: 8, name: "Kentucky River", region: 4, counties: 8, caseload: 298, avgIntakeSeverity: 2.8, outcomeImprovement: 55, alerts: 2, city: "Hazard" },
  { id: 9, name: "Mountain Comprehensive", region: 4, counties: 6, caseload: 356, avgIntakeSeverity: 2.9, outcomeImprovement: 52, alerts: 3, city: "Prestonsburg" },
  { id: 10, name: "Pathways", region: 5, counties: 12, caseload: 334, avgIntakeSeverity: 2.4, outcomeImprovement: 66, alerts: 1, city: "Ashland" },
  { id: 11, name: "Comprehend", region: 5, counties: 8, caseload: 198, avgIntakeSeverity: 2.2, outcomeImprovement: 70, alerts: 0, city: "Maysville" },
  { id: 12, name: "NorthKey", region: 6, counties: 6, caseload: 523, avgIntakeSeverity: 2.3, outcomeImprovement: 69, alerts: 1, city: "Covington" },
  { id: 13, name: "Seven Counties", region: 6, counties: 7, caseload: 1247, avgIntakeSeverity: 2.5, outcomeImprovement: 64, alerts: 2, city: "Louisville" },
  { id: 14, name: "New Vista", region: 7, counties: 17, caseload: 687, avgIntakeSeverity: 2.2, outcomeImprovement: 73, alerts: 0, city: "Lexington" },
];

// Severity flow data (intake to outcome)
const severityFlowData = {
  intake: [
    { level: "Critical (3)", count: 847, color: "#dc2626" },
    { level: "Actionable (2)", count: 2156, color: "#f97316" },
    { level: "Watchful (1)", count: 1523, color: "#eab308" },
    { level: "None (0)", count: 609, color: "#22c55e" },
  ],
  outcome: [
    { level: "Resolved", count: 2891, color: "#22c55e" },
    { level: "Improved", count: 1456, color: "#84cc16" },
    { level: "Stable", count: 534, color: "#eab308" },
    { level: "Declined", count: 254, color: "#dc2626" },
  ]
};

const regionColors = {
  1: "#3b82f6", // Blue - Western
  2: "#8b5cf6", // Purple - North Central
  3: "#ec4899", // Pink - South Central/SE
  4: "#f97316", // Orange - Eastern
  5: "#14b8a6", // Teal - Northeastern
  6: "#6366f1", // Indigo - Northern/Louisville
  7: "#22c55e", // Green - Central
};

export default function DBHDIDDashboard() {
  const [selectedCMHC, setSelectedCMHC] = useState(null);
  const [activeView, setActiveView] = useState('overview');
  const sankeyRef = useRef(null);
  const barChartRef = useRef(null);

  const totalYouth = cmhcData.reduce((sum, c) => sum + c.caseload, 0);
  const avgOutcome = Math.round(cmhcData.reduce((sum, c) => sum + c.outcomeImprovement, 0) / cmhcData.length);
  const totalAlerts = cmhcData.reduce((sum, c) => sum + c.alerts, 0);

  // Draw Sankey-style flow diagram
  useEffect(() => {
    if (!sankeyRef.current || activeView !== 'outcomes') return;
    
    const svg = d3.select(sankeyRef.current);
    svg.selectAll("*").remove();
    
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    
    const leftX = margin.left;
    const rightX = width - margin.right;
    const barWidth = 30;
    
    // Calculate positions
    const totalIntake = severityFlowData.intake.reduce((s, d) => s + d.count, 0);
    const totalOutcome = severityFlowData.outcome.reduce((s, d) => s + d.count, 0);
    
    const chartHeight = height - margin.top - margin.bottom;
    
    let intakeY = margin.top;
    const intakePositions = severityFlowData.intake.map(d => {
      const barHeight = (d.count / totalIntake) * chartHeight;
      const pos = { ...d, y: intakeY, height: barHeight };
      intakeY += barHeight + 4;
      return pos;
    });
    
    let outcomeY = margin.top;
    const outcomePositions = severityFlowData.outcome.map(d => {
      const barHeight = (d.count / totalOutcome) * chartHeight;
      const pos = { ...d, y: outcomeY, height: barHeight };
      outcomeY += barHeight + 4;
      return pos;
    });
    
    // Draw intake bars
    svg.selectAll(".intake-bar")
      .data(intakePositions)
      .enter()
      .append("rect")
      .attr("x", leftX)
      .attr("y", d => d.y)
      .attr("width", barWidth)
      .attr("height", d => d.height - 4)
      .attr("fill", d => d.color)
      .attr("rx", 4);
    
    // Draw intake labels
    svg.selectAll(".intake-label")
      .data(intakePositions)
      .enter()
      .append("text")
      .attr("x", leftX - 8)
      .attr("y", d => d.y + (d.height - 4) / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "11px")
      .text(d => d.level);
    
    // Draw outcome bars
    svg.selectAll(".outcome-bar")
      .data(outcomePositions)
      .enter()
      .append("rect")
      .attr("x", rightX - barWidth)
      .attr("y", d => d.y)
      .attr("width", barWidth)
      .attr("height", d => d.height - 4)
      .attr("fill", d => d.color)
      .attr("rx", 4);
    
    // Draw outcome labels
    svg.selectAll(".outcome-label")
      .data(outcomePositions)
      .enter()
      .append("text")
      .attr("x", rightX + 8)
      .attr("y", d => d.y + (d.height - 4) / 2)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "11px")
      .text(d => `${d.level} (${d.count.toLocaleString()})`);
    
    // Draw flow paths
    const flowPaths = [
      { from: 0, to: 0, value: 0.6 },
      { from: 0, to: 1, value: 0.25 },
      { from: 0, to: 2, value: 0.1 },
      { from: 0, to: 3, value: 0.05 },
      { from: 1, to: 0, value: 0.55 },
      { from: 1, to: 1, value: 0.3 },
      { from: 1, to: 2, value: 0.1 },
      { from: 1, to: 3, value: 0.05 },
      { from: 2, to: 0, value: 0.4 },
      { from: 2, to: 1, value: 0.35 },
      { from: 2, to: 2, value: 0.2 },
      { from: 2, to: 3, value: 0.05 },
      { from: 3, to: 0, value: 0.7 },
      { from: 3, to: 1, value: 0.2 },
      { from: 3, to: 2, value: 0.08 },
      { from: 3, to: 3, value: 0.02 },
    ];
    
    flowPaths.forEach(flow => {
      const fromPos = intakePositions[flow.from];
      const toPos = outcomePositions[flow.to];
      
      const path = d3.path();
      const startY = fromPos.y + (fromPos.height - 4) / 2;
      const endY = toPos.y + (toPos.height - 4) / 2;
      
      path.moveTo(leftX + barWidth, startY);
      path.bezierCurveTo(
        leftX + barWidth + 80, startY,
        rightX - barWidth - 80, endY,
        rightX - barWidth, endY
      );
      
      svg.append("path")
        .attr("d", path.toString())
        .attr("fill", "none")
        .attr("stroke", fromPos.color)
        .attr("stroke-width", Math.max(1, flow.value * 8))
        .attr("opacity", 0.3);
    });
    
    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "12px")
      .text("Intake Severity → Treatment → Outcomes");
    
  }, [activeView]);

  // Draw comparison bar chart
  useEffect(() => {
    if (!barChartRef.current || activeView !== 'compare') return;
    
    const svg = d3.select(barChartRef.current);
    svg.selectAll("*").remove();
    
    const width = 700;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 100, left: 50 };
    
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    
    const sortedData = [...cmhcData].sort((a, b) => b.outcomeImprovement - a.outcomeImprovement);
    
    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.2);
    
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);
    
    // Average line
    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", y(avgOutcome))
      .attr("y2", y(avgOutcome))
      .attr("stroke", "#fbbf24")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "6,4");
    
    svg.append("text")
      .attr("x", width - margin.right + 5)
      .attr("y", y(avgOutcome))
      .attr("fill", "#fbbf24")
      .attr("font-size", "10px")
      .attr("dominant-baseline", "middle")
      .text(`Avg: ${avgOutcome}%`);
    
    // Bars
    svg.selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.outcomeImprovement))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d.outcomeImprovement))
      .attr("fill", d => {
        if (d.outcomeImprovement >= 70) return "#22c55e";
        if (d.outcomeImprovement >= 60) return "#eab308";
        return "#f97316";
      })
      .attr("rx", 4)
      .attr("opacity", 0.85)
      .on("mouseover", function() { d3.select(this).attr("opacity", 1); })
      .on("mouseout", function() { d3.select(this).attr("opacity", 0.85); });
    
    // Alert indicators
    svg.selectAll(".alert-dot")
      .data(sortedData.filter(d => d.alerts > 0))
      .enter()
      .append("circle")
      .attr("cx", d => x(d.name) + x.bandwidth() / 2)
      .attr("cy", d => y(d.outcomeImprovement) - 12)
      .attr("r", 6)
      .attr("fill", "#ef4444");
    
    svg.selectAll(".alert-count")
      .data(sortedData.filter(d => d.alerts > 0))
      .enter()
      .append("text")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => y(d.outcomeImprovement) - 12)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", "9px")
      .attr("font-weight", "bold")
      .text(d => d.alerts);
    
    // Value labels
    svg.selectAll(".value-label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => y(d.outcomeImprovement) + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .text(d => `${d.outcomeImprovement}%`);
    
    // X axis labels
    svg.selectAll(".x-label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", height - margin.bottom + 12)
      .attr("text-anchor", "end")
      .attr("transform", d => `rotate(-45, ${x(d.name) + x.bandwidth() / 2}, ${height - margin.bottom + 12})`)
      .attr("fill", "#94a3b8")
      .attr("font-size", "11px")
      .text(d => d.name);
    
    // Y axis
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"))
      .call(g => g.select(".domain").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick text").attr("fill", "#94a3b8"));
    
    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 16)
      .attr("text-anchor", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "13px")
      .attr("font-weight", "600")
      .text("Outcome Improvement Rate by CMHC (% of youth showing clinically significant gains)");
    
  }, [activeView, avgOutcome]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#e2e8f0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '24px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          marginBottom: '8px',
          background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Kentucky DBHDID CANS Dashboard
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Unified visibility across 14 Community Mental Health Centers • 120 Counties • Real-time analytics
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#60a5fa' }}>
            {totalYouth.toLocaleString()}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
            Youth Served Statewide
          </div>
        </div>
        
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>
            {avgOutcome}%
          </div>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
            Avg. Outcome Improvement
          </div>
        </div>
        
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#a78bfa' }}>14</div>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
            Regional CMHCs
          </div>
        </div>
        
        <div style={{
          background: totalAlerts > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.1)',
          border: `1px solid ${totalAlerts > 0 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.3)'}`,
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: totalAlerts > 0 ? '#ef4444' : '#22c55e' 
          }}>
            {totalAlerts}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
            Active Alerts
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        justifyContent: 'center',
      }}>
        {[
          { key: 'overview', label: '📊 Regional Overview' },
          { key: 'outcomes', label: '📈 Severity → Outcomes' },
          { key: 'compare', label: '⚖️ Center Comparison' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: activeView === tab.key ? '2px solid #60a5fa' : '1px solid #475569',
              background: activeView === tab.key ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              color: activeView === tab.key ? '#60a5fa' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '24px',
        minHeight: '450px',
      }}>
        
        {/* Overview Grid */}
        {activeView === 'overview' && (
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#e2e8f0' }}>
              All 14 CMHCs — Click to drill down
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
            }}>
              {cmhcData.map(cmhc => (
                <div
                  key={cmhc.id}
                  onClick={() => setSelectedCMHC(selectedCMHC?.id === cmhc.id ? null : cmhc)}
                  style={{
                    background: selectedCMHC?.id === cmhc.id 
                      ? 'rgba(59, 130, 246, 0.2)' 
                      : 'rgba(51, 65, 85, 0.5)',
                    border: `2px solid ${selectedCMHC?.id === cmhc.id ? '#60a5fa' : regionColors[cmhc.region]}`,
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                >
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    marginBottom: '4px',
                    color: '#f1f5f9',
                  }}>
                    {cmhc.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>
                    {cmhc.city} • Region {cmhc.region} • {cmhc.counties} counties
                  </div>
                  
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                    Caseload / Complexity / Outcomes
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}>
                    <span style={{ color: '#e2e8f0' }}>{cmhc.caseload}</span>
                    <span style={{ color: '#94a3b8' }}>/</span>
                    <span style={{
                      color: cmhc.avgIntakeSeverity >= 2.5 ? '#f97316' : '#eab308',
                    }}>
                      {cmhc.avgIntakeSeverity.toFixed(1)}
                    </span>
                    <span style={{ color: '#94a3b8' }}>/</span>
                    <span style={{
                      color: cmhc.outcomeImprovement >= 70 ? '#22c55e' :
                             cmhc.outcomeImprovement >= 60 ? '#eab308' : '#f97316',
                    }}>
                      {cmhc.outcomeImprovement}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Detail Panel */}
            {selectedCMHC && (
              <div style={{
                marginTop: '20px',
                padding: '20px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                  {selectedCMHC.name} — Detailed View
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Total Youth Served</div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{selectedCMHC.caseload}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Avg Intake Severity</div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{selectedCMHC.avgIntakeSeverity.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Outcome Improvement</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>{selectedCMHC.outcomeImprovement}%</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Counties Covered</div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{selectedCMHC.counties}</div>
                  </div>
                </div>
                {selectedCMHC.alerts > 0 && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                  }}>
                    <div style={{ color: '#fca5a5', fontSize: '13px', fontWeight: '500' }}>
                      ⚠️ {selectedCMHC.alerts} active alert{selectedCMHC.alerts > 1 ? 's' : ''}: 
                      {selectedCMHC.avgIntakeSeverity >= 2.7 && ' High intake severity trend detected.'}
                      {selectedCMHC.outcomeImprovement < 60 && ' Outcome rate below threshold.'}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Outcomes Flow */}
        {activeView === 'outcomes' && (
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#e2e8f0' }}>
              Inbound Severity to Outbound Outcomes — Statewide Flow
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              Visualizing how youth move from intake acuity levels through treatment to discharge outcomes across all 14 CMHCs
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg ref={sankeyRef} style={{ width: '100%', maxWidth: '650px', height: '320px' }} />
            </div>
            <div style={{
              marginTop: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              padding: '16px',
              background: 'rgba(51, 65, 85, 0.3)',
              borderRadius: '8px',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>56%</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Resolved Needs</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#84cc16' }}>28%</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Clinically Improved</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#eab308' }}>11%</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Stable/Maintained</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>5%</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Declined</div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Chart */}
        {activeView === 'compare' && (
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#e2e8f0' }}>
              Center-to-Center Performance Comparison
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              Ranked by outcome improvement rate • Red dots indicate active alerts requiring attention
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg ref={barChartRef} style={{ width: '100%', maxWidth: '750px', height: '420px' }} />
            </div>
            <div style={{
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              fontSize: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '2px' }} />
                <span style={{ color: '#94a3b8' }}>≥70% (Strong)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: '#eab308', borderRadius: '2px' }} />
                <span style={{ color: '#94a3b8' }}>60-69% (Moderate)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: '#f97316', borderRadius: '2px' }} />
                <span style={{ color: '#94a3b8' }}>&lt;60% (Needs Attention)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '24px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '12px',
      }}>
        Powered by Objective Arts CANS Platform • Data illustrative for demonstration purposes
      </div>
    </div>
  );
}
