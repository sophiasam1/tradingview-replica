import React, { useState } from 'react';
import { Search, TrendingUp, Plus, Trash2, ArrowUpRight, ArrowDownRight, Award, PlusCircle, CheckCircle, Flame, ExternalLink, RefreshCw } from 'lucide-react';
import { Asset, FeaturedIPO } from '../types';
import { FEATURED_IPOS } from '../data';

interface HomeViewProps {
  assets: Asset[];
  watchlist: string[];
  onAddToWatchlist: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onSelectAsset: (symbol: string) => void;
  isPro: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  assets,
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onSelectAsset,
  isPro
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'crypto' | 'stocks' | 'forex' | 'energy' | 'metals'>('all');

  // Filtered assets based on category and search
  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesSearch =
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Watchlist items fully populated
  const watchlistAssets = assets.filter(a => watchlist.includes(a.symbol));

  // Quick summary stats for indices
  const indexTrackers = [
    { name: 'S&P 500', symbol: 'SPX', value: '5,548.20', change: '+24.50', changePct: '+0.44%', trend: 'up' },
    { name: 'Nasdaq 100', symbol: 'NDX', value: '19,652.80', change: '+154.10', changePct: '+0.79%', trend: 'up' },
    { name: 'Dow 30', symbol: 'DJI', value: '41,391.12', change: '-48.30', changePct: '-0.12%', trend: 'down' },
    { name: 'Russell 2000', symbol: 'RTY', value: '2,204.45', change: '+12.18', changePct: '+0.56%', trend: 'up' }
  ];

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Hero Poster: "Look First, Then Leap" */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_50%)]" />
        <div className="space-y-3 z-10 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            <Flame className="w-3.5 h-3.5 fill-indigo-400/20" /> Active Trading Sandbox
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            Look first. <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Then leap.</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Join millions of investors using TradeView to spot opportunities, research market trends, analyze charts with premium ML indicators, and test execution risk-free.
          </p>
        </div>
        <div className="shrink-0 z-10 flex flex-col items-center justify-center p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl text-center shadow-xl w-full sm:w-56">
          <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Market Sentiment</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">74% BULLISH</div>
          <p className="text-[10px] text-slate-500 mt-1">Extreme Greed index dominant</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '74%' }} />
          </div>
        </div>
      </div>

      {/* Index Tracker Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {indexTrackers.map(index => (
          <div
            key={index.symbol}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-500 tracking-wide uppercase">{index.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono flex items-center ${
                  index.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {index.trend === 'up' ? '+' : ''}{index.changePct}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-base font-bold text-white font-mono">{index.value}</span>
              <span className={`text-xs font-mono font-semibold ${index.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {index.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Core Layout: Watchlist on Left, All Assets on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Watchlist Section - 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-1.5 h-3.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <span>Your Watchlist</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {watchlistAssets.length} Items
            </span>
          </div>

          {watchlistAssets.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 border-dashed text-center space-y-2">
              <p className="text-xs text-slate-400 font-medium">Your watchlist is currently empty.</p>
              <p className="text-[11px] text-slate-500">Click the follow button (+) on any asset to track it here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {watchlistAssets.map(asset => {
                const isPriceUp = asset.changePercent >= 0;
                return (
                  <div
                    key={asset.symbol}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-all flex items-center justify-between group"
                  >
                    {/* Symbol / Info */}
                    <div
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                      onClick={() => onSelectAsset(asset.symbol)}
                    >
                      <div className={`w-8 h-8 rounded-lg ${asset.logoBg?.replace('bg-[#2a2e39]', 'bg-slate-850') || 'bg-slate-800'} font-bold flex items-center justify-center text-xs text-white uppercase`}>
                        {asset.logoText}
                      </div>
                      <div>
                        <div className="font-mono text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{asset.symbol}</div>
                        <div className="text-[10px] text-slate-500 font-semibold tracking-wide max-w-[120px] truncate">{asset.name}</div>
                      </div>
                    </div>

                    {/* Sparkline Canvas simulation */}
                    <div className="w-16 h-8 hidden sm:flex items-center justify-center mr-4 opacity-80">
                      <svg viewBox="0 0 10 5" className={`w-full h-full stroke-2 fill-none ${isPriceUp ? 'stroke-emerald-400' : 'stroke-rose-400'}`}>
                        <polyline points={asset.history.map((val, idx) => `${idx},${5 - ((val - Math.min(...asset.history)) / (Math.max(...asset.history) - Math.min(...asset.history) || 1)) * 4}`).join(' ')} />
                      </svg>
                    </div>

                    {/* Pricing info & Delete */}
                    <div className="flex items-center space-x-3">
                      <div className="text-right font-mono" onClick={() => onSelectAsset(asset.symbol)}>
                        <div className="text-sm font-bold text-white">${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.symbol === 'EURUSD' ? 4 : 2 })}</div>
                        <div className={`text-[10px] font-semibold ${isPriceUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPriceUp ? '+' : ''}{asset.changePercent}%
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromWatchlist(asset.symbol);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove from Watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Featured IPO Highlight Card - Restyled to Sleek theme */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/15">Featured IPO Opportunity</span>
              <span className="text-[11px] text-slate-500 font-mono font-bold">Pending</span>
            </div>
            
            {/* IPO Card Item */}
            <div className="flex items-center space-x-3">
              <img
                src={FEATURED_IPOS[0].logoUrl}
                alt="Circle Group Logo"
                className="w-10 h-10 rounded-xl object-contain border border-slate-800 bg-white p-1"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-xs font-bold text-white">Circle Internet Group (CIG)</h4>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">US NASDAQ • Issuer of USDC stablecoin</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Circle is actively preparing for public market entry. Tap tracking status to get immediate alerts when filings and pricing terms finalize.
            </p>

            <button
              onClick={() => alert("Added Circle Internet Group (CIG) to IPO Alerts! You will be notified.")}
              className="w-full py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-semibold transition-all flex items-center justify-center space-x-1 border border-indigo-500/20 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Track Circle IPO Filing</span>
            </button>
          </div>
        </div>

        {/* Market Explorer / Search Area - 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span>Market Explorer</span>
            </h3>

            {/* Custom Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search symbol or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-xs text-white rounded-xl pl-9 pr-4 py-2 focus:outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'stocks', 'crypto', 'forex', 'metals'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10 border border-indigo-500/20'
                    : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredAssets.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-xs text-slate-500 font-medium bg-slate-900/40 rounded-2xl border border-slate-800">
                No assets matched your current search parameters.
              </div>
            ) : (
              filteredAssets.map(asset => {
                const isPriceUp = asset.changePercent >= 0;
                const isAdded = watchlist.includes(asset.symbol);

                return (
                  <div
                    key={asset.symbol}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
                    onClick={() => onSelectAsset(asset.symbol)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg ${asset.logoBg?.replace('bg-[#2a2e39]', 'bg-slate-800') || 'bg-slate-800'} font-bold flex items-center justify-center text-xs text-white`}>
                          {asset.logoText}
                        </div>
                        <div>
                          <div className="font-mono text-xs font-bold text-white flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                            {asset.symbol}
                            <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded uppercase border border-slate-700/50">{asset.category}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-semibold tracking-wide truncate max-w-[130px]">{asset.name}</div>
                        </div>
                      </div>

                      {/* Add/Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAdded) {
                            onRemoveFromWatchlist(asset.symbol);
                          } else {
                            onAddToWatchlist(asset.symbol);
                          }
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-rose-500/10 hover:text-rose-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-400 border border-slate-700'
                        }`}
                        title={isAdded ? "Remove from Watchlist" : "Add to Watchlist"}
                      >
                        {isAdded ? <CheckCircle className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="font-mono">
                        <span className="text-sm font-bold text-white">
                          ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.symbol === 'EURUSD' ? 4 : 2 })}
                        </span>
                      </div>
                      <div className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded flex items-center space-x-0.5 ${
                        isPriceUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        <span>{isPriceUp ? '▲' : '▼'}</span>
                        <span>{isPriceUp ? '+' : ''}{asset.changePercent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Informational Guide Link banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0">
                <Award className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-400">Unlock Pro Trading Strategies</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Gain stars, read indicators with deep neural layers, and save your visual canvas diagrams.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectAsset('RKLB')}
              className="px-3 py-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-1 uppercase tracking-wider cursor-pointer transition-all"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
