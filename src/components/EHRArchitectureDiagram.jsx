import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const EHRArchitectureDiagram = () => {
  const [activeInsight, setActiveInsight] = useState('complexity');
  const [mounted, setMounted] = useState(false);
  const complexityChartRef = useRef(null);
  const domainChartRef = useRef(null);
  const outcomeChartRef = useRef(null);
  const trendChartRef = useRef(null);

  // Ensure component is mounted before drawing charts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulated assessment data by CMHC
  const cmhcComplexityData = [
    { name: 'Four Rivers', region: 'Western', avgComplexity: 2.1, caseload: 342, highComplexity: 89 },
    { name: 'RiverValley', region: 'Western', avgComplexity: 1.9, caseload: 289, highComplexity: 62 },
    { name: 'Pennyroyal', region: 'Western', avgComplexity: 2.0, caseload: 315, highComplexity: 78 },
    { name: 'Communicare', region: 'Central', avgComplexity: 1.8, caseload: 278, highComplexity: 51 },
    { name: 'LifeSkills', region: 'Central', avgComplexity: 1.9, caseload: 412, highComplexity: 94 },
    { name: 'Seven Counties', region: 'Louisville', avgComplexity: 2.3, caseload: 1247, highComplexity: 412 },
    { name: 'NorthKey', region: 'Northern', avgComplexity: 2.1, caseload: 523, highComplexity: 156 },
    { name: 'Comprehend', region: 'Northern', avgComplexity: 1.8, caseload: 198, highComplexity: 38 },
    { name: 'Pathways', region: 'Eastern', avgComplexity: 2.4, caseload: 334, highComplexity: 127 },
    { name: 'New Vista', region: 'Central', avgComplexity: 2.0, caseload: 687, highComplexity: 178 },
    { name: 'Adanta', region: 'Southern', avgComplexity: 2.5, caseload: 267, highComplexity: 104 },
    { name: 'Cumberland River', region: 'Eastern', avgComplexity: 2.7, caseload: 389, highComplexity: 187 },
    { name: 'Kentucky River', region: 'Eastern', avgComplexity: 2.8, caseload: 298, highComplexity: 159 },
    { name: 'Mountain', region: 'Eastern', avgComplexity: 2.9, caseload: 356, highComplexity: 198 },
  ];

  // CANS domain data aggregated statewide with regional breakdown
  const domainData = [
    { domain: 'Behavioral/Emotional', statewide: 1.8, eastern: 2.4, central: 1.5, western: 1.7 },
    { domain: 'Risk Factors', statewide: 1.4, eastern: 1.9, central: 1.2, western: 1.3 },
    { domain: 'Functioning', statewide: 1.6, eastern: 2.1, central: 1.4, western: 1.5 },
    { domain: 'Care Intensity', statewide: 1.5, eastern: 2.2, central: 1.3, western: 1.4 },
    { domain: 'Trauma', statewide: 1.9, eastern: 2.6, central: 1.6, western: 1.8 },
    { domain: 'Substance Use', statewide: 1.2, eastern: 1.8, central: 1.0, western: 1.1 },
  ];

  // Complexity score improvement data at matched starting complexity
  const complexityImprovementData = [
    { center: 'Communicare', startingComplexity: '2.0-2.5', improvementPct: 14 },
    { center: 'New Vista', startingComplexity: '2.0-2.5', improvementPct: 12 },
    { center: 'LifeSkills', startingComplexity: '2.0-2.5', improvementPct: 11 },
    { center: 'Seven Counties', startingComplexity: '2.0-2.5', improvementPct: 9 },
    { center: 'Pathways', startingComplexity: '2.0-2.5', improvementPct: 8 },
    { center: 'Cumberland River', startingComplexity: '2.0-2.5', improvementPct: 6 },
    { center: 'Kentucky River', startingComplexity: '2.0-2.5', improvementPct: 5 },
    { center: 'Mountain', startingComplexity: '2.0-2.5', improvementPct: 4 },
  ];

  // Trend data - statewide complexity over time
  const trendData = [
    { month: 'Jul 2024', avgComplexity: 2.02, highComplexityPct: 28 },
    { month: 'Aug 2024', avgComplexity: 2.05, highComplexityPct: 29 },
    { month: 'Sep 2024', avgComplexity: 2.08, highComplexityPct: 30 },
    { month: 'Oct 2024', avgComplexity: 2.12, highComplexityPct: 31 },
    { month: 'Nov 2024', avgComplexity: 2.18, highComplexityPct: 33 },
    { month: 'Dec 2024', avgComplexity: 2.15, highComplexityPct: 32 },
    { month: 'Jan 2025', avgComplexity: 2.21, highComplexityPct: 34 },
    { month: 'Feb 2025', avgComplexity: 2.19, highComplexityPct: 33 },
    { month: 'Mar 2025', avgComplexity: 2.24, highComplexityPct: 35 },
    { month: 'Apr 2025', avgComplexity: 2.28, highComplexityPct: 36 },
    { month: 'May 2025', avgComplexity: 2.31, highComplexityPct: 37 },
    { month: 'Jun 2025', avgComplexity: 2.29, highComplexityPct: 36 },
  ];

  const regionColors = {
    'Eastern': '#ef4444',
    'Central': '#22c55e',
    'Western': '#3b82f6',
    'Northern': '#8b5cf6',
    'Louisville': '#f97316',
    'Southern': '#ec4899',
  };

  // Complexity by Center Chart
  useEffect(() => {
    if (!mounted || !complexityChartRef.current || activeInsight !== 'complexity') return;

    const svg = d3.select(complexityChartRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 380;
    const margin = { top: 40, right: 30, bottom: 120, left: 50 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const sortedData = [...cmhcComplexityData].sort((a, b) => b.avgComplexity - a.avgComplexity);
    const stateAvg = d3.mean(sortedData, d => d.avgComplexity);

    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.25);

    const y = d3.scaleLinear()
      .domain([0, 3.5])
      .range([height - margin.bottom, margin.top]);

    // Statewide average line
    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", y(stateAvg))
      .attr("y2", y(stateAvg))
      .attr("stroke", "#fbbf24")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "8,4");

    svg.append("text")
      .attr("x", width - margin.right + 5)
      .attr("y", y(stateAvg))
      .attr("fill", "#fbbf24")
      .attr("font-size", "11px")
      .attr("dominant-baseline", "middle")
      .text(`State Avg: ${stateAvg.toFixed(2)}`);

    // Bars
    svg.selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.avgComplexity))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d.avgComplexity))
      .attr("fill", d => regionColors[d.region])
      .attr("rx", 4)
      .attr("opacity", 0.85);

    // Value labels
    svg.selectAll(".value-label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => y(d.avgComplexity) - 6)
      .attr("text-anchor", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .text(d => d.avgComplexity.toFixed(1));

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
      .call(d3.axisLeft(y).ticks(7).tickFormat(d => d.toFixed(1)))
      .call(g => g.select(".domain").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick text").attr("fill", "#94a3b8"));

    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height - margin.bottom + margin.top) / 2)
      .attr("y", 15)
      .attr("fill", "#94a3b8")
      .attr("font-size", "11px")
      .attr("text-anchor", "middle")
      .text("Avg Complexity Score");

    // Legend
    const regions = [...new Set(sortedData.map(d => d.region))];
    const legendX = margin.left;
    const legendY = height - 25;

    regions.forEach((region, i) => {
      svg.append("rect")
        .attr("x", legendX + i * 90)
        .attr("y", legendY)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", regionColors[region])
        .attr("rx", 2);

      svg.append("text")
        .attr("x", legendX + i * 90 + 16)
        .attr("y", legendY + 10)
        .attr("fill", "#94a3b8")
        .attr("font-size", "10px")
        .text(region);
    });

  }, [mounted, activeInsight]);

  // Domain Pattern Chart
  useEffect(() => {
    if (!mounted || !domainChartRef.current || activeInsight !== 'domains') return;

    const svg = d3.select(domainChartRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 380;
    const margin = { top: 40, right: 120, bottom: 60, left: 140 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const y = d3.scaleBand()
      .domain(domainData.map(d => d.domain))
      .range([margin.top, height - margin.bottom])
      .padding(0.3);

    const x = d3.scaleLinear()
      .domain([0, 3])
      .range([margin.left, width - margin.right]);

    // Grid lines
    svg.selectAll(".grid-line")
      .data([1, 2, 3])
      .enter()
      .append("line")
      .attr("x1", d => x(d))
      .attr("x2", d => x(d))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#334155")
      .attr("stroke-dasharray", "4,4");

    // Threshold labels
    svg.selectAll(".threshold-label")
      .data([
        { val: 1, label: 'Watchful' },
        { val: 2, label: 'Actionable' },
        { val: 3, label: 'Intensive' }
      ])
      .enter()
      .append("text")
      .attr("x", d => x(d.val))
      .attr("y", margin.top - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "9px")
      .text(d => d.label);

    const barHeight = y.bandwidth() / 3;

    // Eastern bars (highlighted)
    svg.selectAll(".eastern-bar")
      .data(domainData)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => y(d.domain))
      .attr("width", d => x(d.eastern) - margin.left)
      .attr("height", barHeight - 2)
      .attr("fill", "#ef4444")
      .attr("rx", 3);

    // Statewide bars
    svg.selectAll(".statewide-bar")
      .data(domainData)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => y(d.domain) + barHeight)
      .attr("width", d => x(d.statewide) - margin.left)
      .attr("height", barHeight - 2)
      .attr("fill", "#64748b")
      .attr("rx", 3);

    // Central bars
    svg.selectAll(".central-bar")
      .data(domainData)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => y(d.domain) + barHeight * 2)
      .attr("width", d => x(d.central) - margin.left)
      .attr("height", barHeight - 2)
      .attr("fill", "#22c55e")
      .attr("rx", 3);

    // Y axis labels
    svg.selectAll(".y-label")
      .data(domainData)
      .enter()
      .append("text")
      .attr("x", margin.left - 8)
      .attr("y", d => y(d.domain) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "12px")
      .text(d => d.domain);

    // Legend
    const legendData = [
      { label: 'Eastern KY', color: '#ef4444' },
      { label: 'Statewide Avg', color: '#64748b' },
      { label: 'Central KY', color: '#22c55e' },
    ];

    legendData.forEach((item, i) => {
      svg.append("rect")
        .attr("x", width - margin.right + 10)
        .attr("y", margin.top + i * 24)
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", item.color)
        .attr("rx", 3);

      svg.append("text")
        .attr("x", width - margin.right + 30)
        .attr("y", margin.top + i * 24 + 11)
        .attr("fill", "#94a3b8")
        .attr("font-size", "11px")
        .text(item.label);
    });

  }, [mounted, activeInsight]);

  // Complexity Score Improvement Chart
  useEffect(() => {
    if (!mounted || !outcomeChartRef.current || activeInsight !== 'outcomes') return;

    const svg = d3.select(outcomeChartRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 380;
    const margin = { top: 50, right: 60, bottom: 80, left: 140 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const sortedData = [...complexityImprovementData].sort((a, b) => b.improvementPct - a.improvementPct);
    const avgRate = d3.mean(sortedData, d => d.improvementPct);

    const y = d3.scaleBand()
      .domain(sortedData.map(d => d.center))
      .range([margin.top, height - margin.bottom])
      .padding(0.35);

    const x = d3.scaleLinear()
      .domain([0, 18])
      .range([margin.left, width - margin.right]);

    // Average line
    svg.append("line")
      .attr("x1", x(avgRate))
      .attr("x2", x(avgRate))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#fbbf24")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "8,4");

    svg.append("text")
      .attr("x", x(avgRate))
      .attr("y", margin.top - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "#fbbf24")
      .attr("font-size", "10px")
      .text(`Avg: ${avgRate.toFixed(0)}%`);

    // Bars
    svg.selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => y(d.center))
      .attr("width", d => x(d.improvementPct) - margin.left)
      .attr("height", y.bandwidth())
      .attr("fill", d => {
        if (d.improvementPct >= 10) return "#22c55e";
        if (d.improvementPct >= 7) return "#eab308";
        return "#f97316";
      })
      .attr("rx", 4);

    // Value labels
    svg.selectAll(".value-label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("x", d => x(d.improvementPct) + 6)
      .attr("y", d => y(d.center) + y.bandwidth() / 2)
      .attr("fill", "#e2e8f0")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("dominant-baseline", "middle")
      .text(d => `${d.improvementPct}%`);

    // Y axis labels
    svg.selectAll(".y-label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("x", margin.left - 8)
      .attr("y", d => y(d.center) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "12px")
      .text(d => d.center);

    // X axis
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => d + "%"))
      .call(g => g.select(".domain").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick text").attr("fill", "#94a3b8"));

    // X axis label
    svg.append("text")
      .attr("x", (margin.left + width - margin.right) / 2)
      .attr("y", height - 45)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "11px")
      .text("Complexity Score Reduction");

    // Subtitle
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .text("Matched pair assessments — initial to discharge complexity score change");

  }, [mounted, activeInsight]);

  // Trend Chart
  useEffect(() => {
    if (!mounted || !trendChartRef.current || activeInsight !== 'trends') return;

    const svg = d3.select(trendChartRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 380;
    const margin = { top: 40, right: 60, bottom: 60, left: 60 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3.scalePoint()
      .domain(trendData.map(d => d.month))
      .range([margin.left, width - margin.right]);

    const y1 = d3.scaleLinear()
      .domain([1.8, 2.5])
      .range([height - margin.bottom, margin.top]);

    const y2 = d3.scaleLinear()
      .domain([20, 45])
      .range([height - margin.bottom, margin.top]);

    // Area fill for complexity
    const area = d3.area()
      .x(d => x(d.month))
      .y0(height - margin.bottom)
      .y1(d => y1(d.avgComplexity))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(trendData)
      .attr("fill", "rgba(139, 92, 246, 0.2)")
      .attr("d", area);

    // Complexity line
    const line1 = d3.line()
      .x(d => x(d.month))
      .y(d => y1(d.avgComplexity))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(trendData)
      .attr("fill", "none")
      .attr("stroke", "#8b5cf6")
      .attr("stroke-width", 3)
      .attr("d", line1);

    // High complexity % line
    const line2 = d3.line()
      .x(d => x(d.month))
      .y(d => y2(d.highComplexityPct))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(trendData)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "8,4")
      .attr("d", line2);

    // Data points - complexity
    svg.selectAll(".dot1")
      .data(trendData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.month))
      .attr("cy", d => y1(d.avgComplexity))
      .attr("r", 4)
      .attr("fill", "#8b5cf6");

    // Data points - high complexity %
    svg.selectAll(".dot2")
      .data(trendData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.month))
      .attr("cy", d => y2(d.highComplexityPct))
      .attr("r", 4)
      .attr("fill", "#ef4444");

    // X axis
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .call(g => g.select(".domain").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick text")
        .attr("fill", "#94a3b8")
        .attr("font-size", "10px")
        .attr("transform", "rotate(-45)")
        .attr("text-anchor", "end"));

    // Y axis left (complexity)
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y1).ticks(5))
      .call(g => g.select(".domain").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick text").attr("fill", "#8b5cf6"));

    // Y axis right (percentage)
    svg.append("g")
      .attr("transform", `translate(${width - margin.right}, 0)`)
      .call(d3.axisRight(y2).ticks(5).tickFormat(d => d + "%"))
      .call(g => g.select(".domain").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick text").attr("fill", "#ef4444"));

    // Y axis labels
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height - margin.bottom + margin.top) / 2)
      .attr("y", 15)
      .attr("fill", "#8b5cf6")
      .attr("font-size", "11px")
      .attr("text-anchor", "middle")
      .text("Avg Complexity Score");

    svg.append("text")
      .attr("transform", "rotate(90)")
      .attr("x", (height - margin.bottom + margin.top) / 2)
      .attr("y", -width + 15)
      .attr("fill", "#ef4444")
      .attr("font-size", "11px")
      .attr("text-anchor", "middle")
      .text("% High Complexity Cases");

    // Legend
    svg.append("line")
      .attr("x1", margin.left + 20)
      .attr("x2", margin.left + 45)
      .attr("y1", margin.top - 15)
      .attr("y2", margin.top - 15)
      .attr("stroke", "#8b5cf6")
      .attr("stroke-width", 3);

    svg.append("text")
      .attr("x", margin.left + 50)
      .attr("y", margin.top - 12)
      .attr("fill", "#94a3b8")
      .attr("font-size", "10px")
      .text("Avg Complexity");

    svg.append("line")
      .attr("x1", margin.left + 160)
      .attr("x2", margin.left + 185)
      .attr("y1", margin.top - 15)
      .attr("y2", margin.top - 15)
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "8,4");

    svg.append("text")
      .attr("x", margin.left + 190)
      .attr("y", margin.top - 12)
      .attr("fill", "#94a3b8")
      .attr("font-size", "10px")
      .text("% High Complexity (≥2.5)");

  }, [mounted, activeInsight]);

  // Calculate summary stats
  const easternAvg = d3.mean(cmhcComplexityData.filter(d => d.region === 'Eastern'), d => d.avgComplexity);
  const centralAvg = d3.mean(cmhcComplexityData.filter(d => d.region === 'Central'), d => d.avgComplexity);
  const stateAvg = d3.mean(cmhcComplexityData, d => d.avgComplexity);
  const totalHighComplexity = d3.sum(cmhcComplexityData, d => d.highComplexity);

  const insights = [
    { key: 'complexity', label: 'Complexity by Center', icon: '📊' },
    { key: 'domains', label: 'Domain Patterns', icon: '🎯' },
    { key: 'outcomes', label: 'Score Improvement', icon: '⚖️' },
    { key: 'trends', label: 'Statewide Trends', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Unified CANS Intelligence
        </h1>
        <p className="text-slate-400 text-lg">
          Insights only visible through cross-center aggregation
        </p>
      </div>

      {/* Key Insight Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 rounded-xl p-4 border border-red-700/50">
          <div className="text-red-400 text-sm font-medium mb-1">Eastern KY Complexity</div>
          <div className="text-3xl font-bold text-white">{easternAvg?.toFixed(2)}</div>
          <div className="text-red-300 text-xs mt-1">
            +{((easternAvg - stateAvg) / stateAvg * 100).toFixed(0)}% above state average
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-xl p-4 border border-purple-700/50">
          <div className="text-purple-400 text-sm font-medium mb-1">High-Complexity Youth</div>
          <div className="text-3xl font-bold text-white">{totalHighComplexity.toLocaleString()}</div>
          <div className="text-purple-300 text-xs mt-1">
            Complexity ≥2.5 requiring intensive support
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-xl p-4 border border-amber-700/50">
          <div className="text-amber-400 text-sm font-medium mb-1">Outcome Variance</div>
          <div className="text-3xl font-bold text-white">22%</div>
          <div className="text-amber-300 text-xs mt-1">
            Gap between top and bottom performers
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-4 border border-blue-700/50">
          <div className="text-blue-400 text-sm font-medium mb-1">12-Month Trend</div>
          <div className="text-3xl font-bold text-white">+14%</div>
          <div className="text-blue-300 text-xs mt-1">
            Increase in statewide complexity
          </div>
        </div>
      </div>

      {/* Insight Tabs */}
      <div className="max-w-6xl mx-auto flex justify-center gap-3 mb-6">
        {insights.map(insight => (
          <button
            key={insight.key}
            onClick={() => setActiveInsight(insight.key)}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeInsight === insight.key
                ? 'bg-purple-600 text-white border-2 border-purple-400'
                : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700'
            }`}
          >
            {insight.icon} {insight.label}
          </button>
        ))}
      </div>

      {/* Main Visualization Area */}
      <div className="max-w-6xl mx-auto bg-slate-800/50 rounded-2xl border border-slate-700 p-6 relative" style={{ minHeight: '500px' }}>
        <div style={{ visibility: activeInsight === 'complexity' ? 'visible' : 'hidden', position: activeInsight === 'complexity' ? 'relative' : 'absolute', top: 0, left: 0, right: 0 }}>
          <h2 className="text-lg font-semibold text-white mb-1">
            Average Complexity Score by Center
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            Eastern KY centers consistently showing elevated acuity — resource allocation signal
          </p>
          <div className="flex justify-center">
            <svg ref={complexityChartRef} className="w-full max-w-3xl" style={{ height: '400px' }} />
          </div>
        </div>

        <div style={{ visibility: activeInsight === 'domains' ? 'visible' : 'hidden', position: activeInsight === 'domains' ? 'relative' : 'absolute', top: 0, left: 0, right: 0 }}>
          <h2 className="text-lg font-semibold text-white mb-1">
            CANS Domain Scores by Region
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            Trauma domain significantly elevated in Eastern KY — targeted intervention opportunity
          </p>
          <div className="flex justify-center">
            <svg ref={domainChartRef} className="w-full max-w-3xl" style={{ height: '400px' }} />
          </div>
        </div>

        <div style={{ visibility: activeInsight === 'outcomes' ? 'visible' : 'hidden', position: activeInsight === 'outcomes' ? 'relative' : 'absolute', top: 0, left: 0, right: 0 }}>
          <h2 className="text-lg font-semibold text-white mb-1">
            Matched Pair Assessment Results by Center
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            Average complexity reduction from initial assessment to discharge
          </p>
          <div className="flex justify-center">
            <svg ref={outcomeChartRef} className="w-full max-w-3xl" style={{ height: '400px' }} />
          </div>
        </div>

        <div style={{ visibility: activeInsight === 'trends' ? 'visible' : 'hidden', position: activeInsight === 'trends' ? 'relative' : 'absolute', top: 0, left: 0, right: 0 }}>
          <h2 className="text-lg font-semibold text-white mb-1">
            Statewide Complexity Trend
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            Rising acuity across the state over 12 months — early warning for resource planning
          </p>
          <div className="flex justify-center">
            <svg ref={trendChartRef} className="w-full max-w-3xl" style={{ height: '400px' }} />
          </div>
        </div>
      </div>

      {/* Bottom Insight Call-out */}
      <div className="max-w-4xl mx-auto mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-5 border border-purple-500/30">
        <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
          <span className="text-xl">💡</span> Why This Matters
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Without unified data across all 14 CMHCs, these patterns are invisible. Each center only sees their own population.
          DBHDID can now identify <span className="text-purple-300 font-medium">regional disparities</span>,
          compare <span className="text-purple-300 font-medium">outcomes at matched acuity</span>,
          and spot <span className="text-purple-300 font-medium">statewide trends</span> before they become crises —
          enabling proactive resource allocation rather than reactive responses.
        </p>
      </div>
    </div>
  );
};

export default EHRArchitectureDiagram;