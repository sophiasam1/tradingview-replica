import React, { useState, useEffect, useRef } from 'react';
import { Play, TrendingUp, Sliders, Layers, Activity, Plus, Minus, ArrowUpRight, ArrowDownRight, Zap, RefreshCw, PenTool, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { Asset, SimulatedTrade } from '../types';

interface ChartViewProps {
  selectedAsset: Asset;
  assets: Asset[];
  onSelectAsset: (symbol: string) => void;
  portfolioBalance: number;
  onExecuteTrade: (trade: Omit<SimulatedTrade, 'id' | 'timestamp'>) => void;
  isPro: boolean;
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface DrawingLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const ChartView: React.FC<ChartViewProps> = ({
  selectedAsset,
  assets,
  onSelectAsset,
  portfolioBalance,
  onExecuteTrade,
  isPro
}) => {
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '1d'>('15m');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [livePrice, setLivePrice] = useState(selectedAsset.price);
  
  // Indicator Toggles
  const [showRSI, setShowRSI] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showVolume, setShowVolume] = useState(true);

  // Drawing States
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawings, setDrawings] = useState<DrawingLine[]>([]);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
  const chartSvgRef = useRef<SVGSVGElement>(null);

  // Mock Trading Form States
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState(10);
  const [activePositions, setActivePositions] = useState<{
    symbol: string;
    type: 'BUY' | 'SELL';
    entryPrice: number;
    qty: number;
  }[]>([]);

  // Generate mock candles based on selected asset and timeframe
  useEffect(() => {
    setLivePrice(selectedAsset.price);
    const basePrice = selectedAsset.price;
    const historyCount = 20;
    const seedCandles: Candle[] = [];

    let currentPrice = basePrice * 0.95;
    for (let i = 0; i < historyCount; i++) {
      const step = (basePrice * 0.1) / historyCount;
      const change = (Math.random() - 0.45) * step;
      const open = currentPrice;
      const close = currentPrice + change;
      const high = Math.max(open, close) + Math.random() * (basePrice * 0.015);
      const low = Math.min(open, close) - Math.random() * (basePrice * 0.015);
      const volume = Math.floor(Math.random() * 50000 + 10000);

      // Simple formatted date/time ticks
      const date = new Date();
      if (timeframe === '1d') {
        date.setDate(date.getDate() - (historyCount - i));
      } else {
        date.setMinutes(date.getMinutes() - (historyCount - i) * parseInt(timeframe));
      }
      const timeStr = timeframe === '1d' 
        ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });

      seedCandles.push({
        time: timeStr,
        open: Number(open.toFixed(selectedAsset.symbol === 'EURUSD' ? 4 : 2)),
        high: Number(high.toFixed(selectedAsset.symbol === 'EURUSD' ? 4 : 2)),
        low: Number(low.toFixed(selectedAsset.symbol === 'EURUSD' ? 4 : 2)),
        close: Number(close.toFixed(selectedAsset.symbol === 'EURUSD' ? 4 : 2)),
        volume
      });
      currentPrice = close;
    }
    setCandles(seedCandles);
  }, [selectedAsset.symbol, timeframe]);

  // Live candlestick fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        const currentCandle = { ...updated[lastIndex] };

        // Fluctuating tick
        const tickPercent = (Math.random() - 0.49) * 0.25; // Random fluctuation
        const tickChange = currentCandle.close * (tickPercent / 100);
        const newPrice = Number((currentCandle.close + tickChange).toFixed(selectedAsset.symbol === 'EURUSD' ? 4 : 2));

        currentCandle.close = newPrice;
        if (newPrice > currentCandle.high) currentCandle.high = newPrice;
        if (newPrice < currentCandle.low) currentCandle.low = newPrice;
        currentCandle.volume += Math.floor(Math.random() * 500);

        updated[lastIndex] = currentCandle;
        setLivePrice(newPrice);
        return updated;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [selectedAsset.symbol]);

  // Coordinate scaling helpers for drawing and candle renders
  const svgWidth = 640;
  const svgHeight = 280;
  const paddingX = 50;
  const paddingY = 25;

  const minVal = candles.length > 0 ? Math.min(...candles.map(c => c.low)) : 0;
  const maxVal = candles.length > 0 ? Math.max(...candles.map(c => c.high)) : 100;
  const valRange = maxVal - minVal || 1;

  const getX = (index: number) => {
    const ratio = index / (candles.length - 1 || 1);
    return paddingX + ratio * (svgWidth - 2 * paddingX);
  };

  const getY = (value: number) => {
    const ratio = (value - minVal) / valRange;
    return svgHeight - paddingY - ratio * (svgHeight - 2 * paddingY);
  };

  // Click handler to draw interactive trendlines
  const handleChartClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!isDrawingMode || !chartSvgRef.current) return;

    const rect = chartSvgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const y = ((e.clientY - rect.top) / rect.height) * svgHeight;

    if (!drawingStart) {
      // Set anchor A
      setDrawingStart({ x, y });
    } else {
      // Set anchor B and finalize line
      const newLine: DrawingLine = {
        id: `draw-${Date.now()}`,
        x1: drawingStart.x,
        y1: drawingStart.y,
        x2: x,
        y2: y
      };
      setDrawings(prev => [...prev, newLine]);
      setDrawingStart(null);
      setIsDrawingMode(false); // turn off drawing mode after line drawn
    }
  };

  const handleClearDrawings = () => {
    setDrawings([]);
    setDrawingStart(null);
  };

  // Simulated Order Execution
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = livePrice * quantity;

    if (tradeType === 'BUY' && cost > portfolioBalance) {
      alert("Insufficient mock funds to complete this simulated Buy transaction!");
      return;
    }

    // Record trade
    onExecuteTrade({
      symbol: selectedAsset.symbol,
      type: tradeType,
      price: livePrice,
      amount: quantity
    });

    // Add to local positions
    const existingIndex = activePositions.findIndex(p => p.symbol === selectedAsset.symbol && p.type === tradeType);
    if (existingIndex >= 0) {
      const updated = [...activePositions];
      const prevPos = updated[existingIndex];
      // Weighted average entry price
      const totalQty = prevPos.qty + quantity;
      const avgPrice = (prevPos.entryPrice * prevPos.qty + livePrice * quantity) / totalQty;
      updated[existingIndex] = {
        ...prevPos,
        qty: totalQty,
        entryPrice: Number(avgPrice.toFixed(2))
      };
      setActivePositions(updated);
    } else {
      setActivePositions(prev => [
        ...prev,
        {
          symbol: selectedAsset.symbol,
          type: tradeType,
          entryPrice: livePrice,
          qty: quantity
        }
      ]);
    }

    alert(`Successfully filled simulated order: ${tradeType} ${quantity} ${selectedAsset.symbol} at $${livePrice.toLocaleString()}`);
  };

  // Close Simulated Position
  const handleClosePosition = (symbol: string, type: 'BUY' | 'SELL', entryPrice: number, qty: number) => {
    const revenue = livePrice * qty;
    const profit = type === 'BUY' ? (livePrice - entryPrice) * qty : (entryPrice - livePrice) * qty;

    onExecuteTrade({
      symbol,
      type: type === 'BUY' ? 'SELL' : 'BUY',
      price: livePrice,
      amount: qty
    });

    setActivePositions(prev => prev.filter(p => !(p.symbol === symbol && p.type === type)));
    alert(`Closed simulated position of ${qty} ${symbol}. PnL: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`);
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Chart Control Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <select
            value={selectedAsset.symbol}
            onChange={(e) => onSelectAsset(e.target.value)}
            className="bg-slate-800 hover:bg-slate-750 text-xs font-bold text-white border border-slate-700 rounded-xl px-3 py-2.5 cursor-pointer focus:outline-none transition-all"
          >
            {assets.map(a => (
              <option key={a.symbol} value={a.symbol}>{a.symbol} ({a.name})</option>
            ))}
          </select>

          <div className="font-mono">
            <div className="text-base font-bold text-white flex items-center gap-2">
              ${livePrice.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.symbol === 'EURUSD' ? 4 : 2 })}
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                selectedAsset.changePercent >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-rose-500/10 text-rose-400 border border-rose-500/15'
              }`}>
                {selectedAsset.changePercent >= 0 ? '+' : ''}{selectedAsset.changePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe Toggles */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['1m', '5m', '15m', '1h', '1d'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                timeframe === tf 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/15' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Chart Terminal vs Trade Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Terminal Screen - 8 cols */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          {/* Chart Utilities Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800/80 text-slate-400">
            <div className="flex items-center space-x-2 text-xs font-semibold">
              {/* Overlay Indicators Toggles */}
              <button
                onClick={() => setShowEMA(!showEMA)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                  showEMA ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'border-transparent hover:bg-slate-800/40'
                }`}
                title="Adaptive 3-EMA Tunnel"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>EMA Corridor</span>
              </button>

              <button
                onClick={() => setShowRSI(!showRSI)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                  showRSI ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'border-transparent hover:bg-slate-800/40'
                }`}
                title="Machine Learning RSI Classifier"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>ML RSI Classifier</span>
              </button>

              <button
                onClick={() => setShowVolume(!showVolume)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                  showVolume ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'border-transparent hover:bg-slate-800/40'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Volume VPOC</span>
              </button>
            </div>

            {/* Drawing Line Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsDrawingMode(!isDrawingMode)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer text-xs font-semibold border ${
                  isDrawingMode
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Click two points on the chart canvas to map a custom trendline / support level"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>{isDrawingMode ? 'Anchoring...' : 'Draw Line'}</span>
              </button>

              {drawings.length > 0 && (
                <button
                  onClick={handleClearDrawings}
                  className="p-1 rounded-md text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  title="Clear all drawings"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="relative p-2 bg-slate-950 flex-1 min-h-[300px]">
            {candles.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs font-semibold font-mono animate-pulse">
                Initializing chart feed...
              </div>
            ) : (
              <svg
                ref={chartSvgRef}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className={`w-full h-full select-none ${isDrawingMode ? 'cursor-crosshair' : 'cursor-default'}`}
                onClick={handleChartClick}
              >
                {/* Dotted horizontal pricing grid lines */}
                {[0.25, 0.5, 0.75].map((ratio, idx) => {
                  const val = minVal + valRange * ratio;
                  const y = getY(val);
                  return (
                    <g key={idx}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="#1e293b" // slate-800
                        strokeDasharray="3 3"
                      />
                      <text
                        x={svgWidth - paddingX + 6}
                        y={y + 3}
                        fill="#64748b" // slate-500
                        className="text-[9px] font-mono font-medium"
                      >
                        ${val.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.symbol === 'EURUSD' ? 4 : 2 })}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical time grids */}
                {candles.map((candle, idx) => {
                  if (idx % 4 !== 0) return null;
                  const x = getX(idx);
                  return (
                    <g key={idx}>
                      <line
                        x1={x}
                        y1={paddingY}
                        x2={x}
                        y2={svgHeight - paddingY}
                        stroke="#1e293b"
                        strokeOpacity="0.4"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={x}
                        y={svgHeight - paddingY + 12}
                        textAnchor="middle"
                        fill="#64748b"
                        className="text-[8px] font-mono"
                      >
                        {candle.time}
                      </text>
                    </g>
                  );
                })}

                {/* Adaptive EMA Tunnel Overlays (Log spaced curve lines) */}
                {showEMA && (
                  <path
                    d={candles.map((c, idx) => {
                      const ema20Value = c.close * 0.992 + (idx * 0.1);
                      return `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(ema20Value)}`;
                    }).join(' ')}
                    stroke="#6366f1" // indigo-500
                    strokeWidth="1.5"
                    fill="none"
                    strokeOpacity="0.8"
                  />
                )}
                {showEMA && (
                  <path
                    d={candles.map((c, idx) => {
                      const ema50Value = c.close * 0.985 + (idx * 0.05);
                      return `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(ema50Value)}`;
                    }).join(' ')}
                    stroke="#a855f7" // purple-500
                    strokeWidth="1.5"
                    fill="none"
                    strokeOpacity="0.75"
                  />
                )}

                {/* Volume Horizontal Profile VPOC at Left (from Layers indicator) */}
                {showVolume && (
                  <g opacity="0.12">
                    {candles.slice(0, 10).map((c, idx) => {
                      const barWidth = (c.volume / 60000) * 80;
                      const y = getY(c.close);
                      return (
                        <rect
                           key={idx}
                           x={paddingX}
                           y={y - 4}
                           width={barWidth}
                           height={8}
                           fill={idx === 4 ? '#f59e0b' : '#cbd5e1'} // POC level in amber
                        />
                      );
                    })}
                  </g>
                )}

                {/* Candlesticks rendering */}
                {candles.map((candle, idx) => {
                  const x = getX(idx);
                  const yOpen = getY(candle.open);
                  const yClose = getY(candle.close);
                  const yHigh = getY(candle.high);
                  const yLow = getY(candle.low);
                  
                  const isUp = candle.close >= candle.open;
                  const strokeColor = isUp ? '#10b981' : '#f43f5e'; // emerald-500 / rose-500
                  const fillColor = isUp ? '#10b981' : '#f43f5e';
                  const rectY = Math.min(yOpen, yClose);
                  const rectHeight = Math.max(Math.abs(yOpen - yClose), 1.5);

                  return (
                    <g key={idx}>
                      {/* Shadow wick */}
                      <line
                        x1={x}
                        y1={yHigh}
                        x2={x}
                        y2={yLow}
                        stroke={strokeColor}
                        strokeWidth="1.5"
                      />
                      {/* Candle Body */}
                      <rect
                        x={x - 4}
                        y={rectY}
                        width={8}
                        height={rectHeight}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}

                {/* Render Custom Drawing Lines */}
                {drawings.map((line) => (
                  <g key={line.id}>
                    <line
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="#6366f1"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="drop-shadow-[0_0_6px_rgba(99,102,241,0.7)] animate-pulse"
                    />
                    {/* Circle end caps */}
                    <circle cx={line.x1} cy={line.y1} r="3" fill="#6366f1" />
                    <circle cx={line.x2} cy={line.y2} r="3" fill="#6366f1" />
                  </g>
                ))}

                {/* Live price target line on y-axis */}
                {candles.length > 0 && (
                  <g>
                    <line
                      x1={paddingX}
                      y1={getY(livePrice)}
                      x2={svgWidth - paddingX}
                      y2={getY(livePrice)}
                      stroke={livePrice >= candles[candles.length - 2]?.close ? '#10b981' : '#f43f5e'}
                      strokeWidth="1.2"
                      strokeDasharray="2 1"
                    />
                    <circle cx={getX(candles.length - 1)} cy={getY(livePrice)} r="4" fill={livePrice >= candles[candles.length - 2]?.close ? '#10b981' : '#f43f5e'} className="animate-ping" />
                  </g>
                )}
              </svg>
            )}

            {/* Hint message when Drawing is active */}
            {isDrawingMode && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-amber-500 flex items-center space-x-1 animate-bounce">
                <span>Drawing Mode: Click Point A, then click Point B on chart</span>
              </div>
            )}
          </div>

          {/* Machine Learning RSI Sub-panel */}
          {showRSI && candles.length > 0 && (
            <div className="h-20 bg-slate-950 border-t border-slate-800 p-2 flex flex-col justify-between">
              <div className="flex justify-between text-[8px] font-mono font-bold uppercase tracking-wider text-slate-500">
                <span>LuxAlgo Machine Learning RSI Panel</span>
                <span className="text-emerald-400">Overbought zone &gt; 70</span>
              </div>
              
              {/* RSI graph SVG */}
              <svg viewBox="0 0 640 40" className="w-full h-full">
                {/* Horizontal guide levels at index 30 and 70 */}
                <line x1={0} y1={8} x2={640} y2={8} stroke="#f43f5e" strokeOpacity="0.15" />
                <line x1={0} y1={32} x2={640} y2={32} stroke="#10b981" strokeOpacity="0.15" />
                
                {/* RSI curve */}
                <path
                  d={candles.map((c, idx) => {
                    // Seed standard oscillating values
                    const rsiVal = 20 + ((c.close % 25) / 25) * 20;
                    return `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${rsiVal}`;
                  }).join(' ')}
                  stroke="#f59e0b" // amber-500
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Paper Trade Simulator Panel - 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-sm">
            <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span>Paper Trading Terminal</span>
              </h3>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase font-mono">Demo mode</span>
            </div>

            {/* Quick account details */}
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-500 font-bold uppercase">Buying Capacity</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                ${portfolioBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-850">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Buy / Long
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  tradeType === 'SELL'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Sell / Short
              </button>
            </div>

            {/* Exec form */}
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Simulated Shares / Units</label>
                <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 5))}
                    className="p-3 text-slate-500 hover:text-slate-200 hover:bg-slate-800/30 transition-colors cursor-pointer border-r border-slate-800"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full text-center bg-transparent border-none text-sm text-white font-mono font-bold focus:outline-none"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => prev + 5)}
                    className="p-3 text-slate-500 hover:text-slate-200 hover:bg-slate-800/30 transition-colors cursor-pointer border-l border-slate-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Estimate calculation */}
              <div className="space-y-2 border-t border-slate-850 pt-3 text-[11px] text-slate-500 font-medium">
                <div className="flex justify-between">
                  <span>Current Price</span>
                  <span className="font-mono text-slate-300">${livePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Simulated Volume Fee</span>
                  <span className="font-mono text-emerald-400">FREE ($0.00)</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/40 pt-1.5">
                  <span className="font-bold text-slate-300">Estimated Total Value</span>
                  <span className="font-mono font-bold text-indigo-400">
                    ${(livePrice * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/20'
                }`}
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>Execute paper trade ({tradeType})</span>
              </button>
            </form>
          </div>

          {/* Active simulated positions under execution card */}
          {activePositions.length > 0 && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-sm">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Positions ({activePositions.length})</h4>
              <div className="space-y-2.5">
                {activePositions.map((p, idx) => {
                  const currentTotal = livePrice * p.qty;
                  const entryTotal = p.entryPrice * p.qty;
                  const unrealizedPnl = p.type === 'BUY' ? currentTotal - entryTotal : entryTotal - currentTotal;
                  const pnlPercent = (unrealizedPnl / entryTotal) * 100;

                  return (
                    <div key={`${p.symbol}-${idx}`} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="font-bold text-white">{p.symbol}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${p.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {p.type}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold font-mono">
                        <div>Qty: <span className="text-slate-300">{p.qty}</span></div>
                        <div>Avg Price: <span className="text-slate-300">${p.entryPrice}</span></div>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-800/40 pt-2 mt-1">
                        <span className={`text-[11px] font-bold font-mono ${unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          PnL: {unrealizedPnl >= 0 ? '+' : ''}${unrealizedPnl.toFixed(2)} ({unrealizedPnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                        </span>
                        <button
                          onClick={() => handleClosePosition(p.symbol, p.type, p.entryPrice, p.qty)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                        >
                          Close Position
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
