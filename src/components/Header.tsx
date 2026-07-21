import React, { useState, useEffect } from 'react';
import { TrendingUp, User, Shield, Zap, RefreshCw, Layers } from 'lucide-react';
import { Asset } from '../types';

interface HeaderProps {
  assets: Asset[];
  portfolioBalance: number;
  isPro: boolean;
  onTogglePro: () => void;
  onSelectAsset: (symbol: string) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  assets,
  portfolioBalance,
  isPro,
  onTogglePro,
  onSelectAsset,
  onOpenProfile
}) => {
  const [tickerAssets, setTickerAssets] = useState<Asset[]>(assets);

  // Micro-fluctuations for the top ticker tape to feel alive
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerAssets(prev =>
        prev.map(asset => {
          const changePercent = (Math.random() - 0.48) * 0.1; // small random tick
          const priceMultiplier = 1 + changePercent / 100;
          const newPrice = asset.price * priceMultiplier;
          const oldPrice = asset.price;
          const diff = newPrice - oldPrice;
          return {
            ...asset,
            price: Number(newPrice.toFixed(asset.symbol === 'EURUSD' ? 4 : 2)),
            change: Number((asset.change + diff).toFixed(2)),
            changePercent: Number((asset.changePercent + changePercent).toFixed(2)),
            trend: diff >= 0 ? 'up' : 'down'
          };
        })
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/95 border-b border-slate-800 backdrop-blur-md">
      {/* Real-time Ticker Tape */}
      <div className="w-full bg-slate-900 h-9 border-b border-slate-800/50 overflow-hidden flex items-center select-none text-[11px] font-mono">
        <div className="flex animate-marquee whitespace-nowrap gap-6 py-1 px-4">
          {tickerAssets.concat(tickerAssets).map((asset, idx) => (
            <button
              key={`${asset.symbol}-${idx}`}
              onClick={() => onSelectAsset(asset.symbol)}
              className="flex items-center space-x-2 shrink-0 hover:bg-slate-800/40 px-2 py-0.5 rounded transition-all cursor-pointer text-left focus:outline-none"
            >
              <span className="text-slate-200 font-bold">{asset.symbol}</span>
              <span className="text-slate-400">${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.symbol === 'EURUSD' ? 4 : 2 })}</span>
              <span className={`font-semibold ${asset.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {asset.changePercent >= 0 ? '▲' : '▼'} {Math.abs(asset.changePercent)}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main AppBar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Slogan */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectAsset('RKLB')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              TradeView
              {isPro && (
                <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-widest flex items-center gap-0.5 shadow-sm">
                  <Zap className="w-2.5 h-2.5 fill-black" /> PRO
                </span>
              )}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Look First, Then Leap</p>
          </div>
        </div>

        {/* Dynamic Portfolio Summary & Controller */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden md:block">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Simulated Cash</div>
            <div className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1">
              ${portfolioBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">USD</span>
            </div>
          </div>

          {/* Quick Pro Upgrade button */}
          <button
            onClick={onTogglePro}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
              isPro
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isPro ? 'fill-amber-400 text-amber-400' : 'text-white'}`} />
            <span>{isPro ? 'Pro Active' : 'Upgrade Pro'}</span>
          </button>

          {/* User Profile Button */}
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-200 transition-colors cursor-pointer"
            title="Simulator Portfolio"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
