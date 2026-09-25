import React, { useState, useRef } from 'react';
import { 
  GitFork, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Layers, 
  Info, 
  X, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  GitPullRequest,
  GitCommit,
  User,
  Filter
} from 'lucide-react';
import { GraphNode, GraphEdge, DecisionGraphData } from '../types/decision';
import { PRESET_DECISION_ANSWERS } from '../data/sampleDataset';

interface DecisionGraphViewProps {
  initialDecisionKey?: string;
  onInspectNodeRef?: (sourceRef: string) => void;
}

export const DecisionGraphView: React.FC<DecisionGraphViewProps> = ({
  initialDecisionKey = 'redis',
  onInspectNodeRef,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(initialDecisionKey);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeDecision = PRESET_DECISION_ANSWERS[selectedKey] || PRESET_DECISION_ANSWERS.redis;
  const graphData: DecisionGraphData = activeDecision.graph;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  // Compute automatic coordinates for layout
  const nodes = graphData.nodes.filter(n => filterType === 'all' || n.type === filterType);
  const nodeMap = new Map<string, GraphNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  // Layout calculations: arrange hierarchically in an organic curved grid
  const nodeCoords = new Map<string, { x: number; y: number }>();
  
  // Categorize nodes for organic positioning
  const decisions = nodes.filter(n => n.type === 'decision');
  const reasons = nodes.filter(n => n.type === 'reason');
  const alternatives = nodes.filter(n => n.type === 'alternative' || n.type === 'rejected_option');
  const docs = nodes.filter(n => n.type === 'document' || n.type === 'issue');
  const code = nodes.filter(n => n.type === 'pull_request' || n.type === 'commit' || n.type === 'person');

  decisions.forEach((n, idx) => nodeCoords.set(n.id, { x: 500, y: 220 + idx * 80 }));
  reasons.forEach((n, idx) => nodeCoords.set(n.id, { x: 800, y: 150 + idx * 110 }));
  alternatives.forEach((n, idx) => nodeCoords.set(n.id, { x: 800, y: 340 + idx * 100 }));
  docs.forEach((n, idx) => nodeCoords.set(n.id, { x: 200, y: 150 + idx * 110 }));
  code.forEach((n, idx) => nodeCoords.set(n.id, { x: 200, y: 340 + idx * 100 }));

  // Color mappings
  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'decision': return { fill: '#1e3a8a', stroke: '#3b82f6', text: '#93c5fd', badge: 'DECISION' };
      case 'reason': return { fill: '#064e3b', stroke: '#10b981', text: '#6ee7b7', badge: 'REASON' };
      case 'alternative': return { fill: '#3730a3', stroke: '#818cf8', text: '#c7d2fe', badge: 'ALTERNATIVE' };
      case 'rejected_option': return { fill: '#881337', stroke: '#f43f5e', text: '#fecdd3', badge: 'REJECTED' };
      case 'document': return { fill: '#134e4a', stroke: '#14b8a6', text: '#99f6e4', badge: 'ADR DOC' };
      case 'pull_request': return { fill: '#4c1d95', stroke: '#a855f7', text: '#e9d5ff', badge: 'PULL REQUEST' };
      case 'commit': return { fill: '#083344', stroke: '#06b6d4', text: '#a5f3fc', badge: 'GIT COMMIT' };
      case 'issue': return { fill: '#78350f', stroke: '#f59e0b', text: '#fde68a', badge: 'ISSUE' };
      case 'person': return { fill: '#312e81', stroke: '#6366f1', text: '#e0e7ff', badge: 'CONTRIBUTOR' };
      default: return { fill: '#1f2937', stroke: '#64748b', text: '#e2e8f0', badge: 'NODE' };
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      {/* Top Header & Demo Notice */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Decision Graph Visualizer
            </h1>
            <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              DEMO PROJECT DATA
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Interactive topological relationship network connecting decisions, evidence, commits, PRs, and rejected alternatives.
          </p>
        </div>

        {/* Decision Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium">
          {Object.keys(PRESET_DECISION_ANSWERS).map((key) => {
            const isSelected = selectedKey === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedKey(key);
                  setSelectedNode(null);
                }}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Graph Canvas Container */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl h-[580px]">
        {/* Controls Toolbar */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs shadow-md">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.2))}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.5))}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-400 border-l border-slate-800">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          {/* Node Filter */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs text-slate-300 shadow-md">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Node Types</option>
              <option value="decision" className="bg-slate-900 text-white">Decisions</option>
              <option value="reason" className="bg-slate-900 text-white">Reasons</option>
              <option value="alternative" className="bg-slate-900 text-white">Alternatives</option>
              <option value="rejected_option" className="bg-slate-900 text-white">Rejected Options</option>
              <option value="document" className="bg-slate-900 text-white">ADRs</option>
              <option value="pull_request" className="bg-slate-900 text-white">Pull Requests</option>
              <option value="commit" className="bg-slate-900 text-white">Commits</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3 p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Decision</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Reason</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Rejected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            <span>ADR Doc</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>PR / Commit</span>
          </div>
        </div>

        {/* Canvas SVG */}
        <svg
          className="w-full h-full cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1f2937" strokeWidth="0.5" />
            </pattern>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
            </marker>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Graph Content with Pan & Zoom */}
          <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
            {/* Edges */}
            {graphData.edges.map((edge, idx) => {
              const srcCoord = nodeCoords.get(edge.source);
              const tgtCoord = nodeCoords.get(edge.target);
              if (!srcCoord || !tgtCoord) return null;

              const dx = tgtCoord.x - srcCoord.x;
              const dy = tgtCoord.y - srcCoord.y;
              const midX = (srcCoord.x + tgtCoord.x) / 2;
              const midY = (srcCoord.y + tgtCoord.y) / 2;

              // Curved bezier path
              const cx1 = srcCoord.x + dx * 0.4;
              const cy1 = srcCoord.y;
              const cx2 = srcCoord.x + dx * 0.6;
              const cy2 = tgtCoord.y;

              const path = `M ${srcCoord.x} ${srcCoord.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tgtCoord.x} ${tgtCoord.y}`;

              return (
                <g key={`edge-${idx}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray={edge.type === 'rejected_for' ? '4 4' : 'none'}
                    markerEnd="url(#arrowhead)"
                  />
                  {edge.label && (
                    <text
                      x={midX}
                      y={midY - 6}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="bg-slate-900 px-1"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const coord = nodeCoords.get(node.id) || { x: 500, y: 300 };
              const colors = getNodeColor(node.type);
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${coord.x}, ${coord.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  className="cursor-pointer transition-transform duration-100 hover:scale-105"
                >
                  {/* Outer glow ring if selected */}
                  {isSelected && (
                    <circle r="46" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="3 3" />
                  )}

                  {/* Node Capsule */}
                  <rect
                    x="-85"
                    y="-28"
                    width="170"
                    height="56"
                    rx="10"
                    fill={colors.fill}
                    stroke={isSelected ? '#ffffff' : colors.stroke}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    className="drop-shadow-md"
                  />

                  {/* Badge */}
                  <text
                    x="0"
                    y="-13"
                    fill={colors.text}
                    fontSize="8"
                    fontWeight="bold"
                    letterSpacing="0.5"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {colors.badge}
                  </text>

                  {/* Label */}
                  <text
                    x="0"
                    y="5"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    className="truncate"
                  >
                    {node.label.length > 20 ? node.label.slice(0, 19) + '…' : node.label}
                  </text>

                  {/* Source Ref if available */}
                  {node.sourceRef && (
                    <text
                      x="0"
                      y="18"
                      fill="#94a3b8"
                      fontSize="8"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {node.sourceRef}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected Node Details Side-Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bottom-4 w-80 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-5 shadow-2xl flex flex-col justify-between z-30 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getNodeColor(selectedNode.type).fill} text-white`}>
                    {selectedNode.type.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">
                    {selectedNode.label}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedNode.detail && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Description &amp; Context
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed p-3 rounded-lg bg-slate-950 border border-slate-800">
                    {selectedNode.detail}
                  </p>
                </div>
              )}

              {selectedNode.sourceRef && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Source Reference
                  </span>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-blue-400">
                    <span>{selectedNode.sourceRef}</span>
                    {onInspectNodeRef && (
                      <button
                        onClick={() => onInspectNodeRef(selectedNode.sourceRef!)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Grounded directly in repository commit &amp; ADR history.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
