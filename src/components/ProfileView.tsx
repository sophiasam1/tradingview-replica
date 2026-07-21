import React, { useState } from 'react';
import { User, Shield, Briefcase, RotateCcw, Calculator, DollarSign, Percent, ArrowUpRight, ArrowDownRight, Award, Zap, HelpCircle } from 'lucide-react';
import { SimulatedTrade } from '../types';

interface ProfileViewProps {
  portfolioBalance: number;
  tradeLog: SimulatedTrade[];
  isPro: boolean;
  onTogglePro: () => void;
  onResetBalance: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  portfolioBalance,
  tradeLog,
  isPro,
  onTogglePro,
  onResetBalance
}) => {
  // Position Sizing Calculator state
  const [riskPercent, setRiskPercent] = useState(2);
  const [entryPrice, setEntryPrice] = useState(150);
  const [stopLoss, setStopLoss] = useState(135);

  // Risk Calculations
  const riskAmount = (portfolioBalance * riskPercent) / 100;
  const priceDifference = Math.abs(entryPrice - stopLoss);
  const suggestedUnits = priceDifference > 0 ? riskAmount / priceDifference : 0;
  const totalExposure = suggestedUnits * entryPrice;

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Profile Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_40%)]" />
        
        <div className="flex items-center space-x-4 z-10 text-center md:text-left flex-col md:flex-row gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-white text-xl font-bold shadow-xl">
            <User className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
              <span>Paper Trader Elite</span>
              {isPro ? (
                <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-sm">
                  PRO MEMBER
                </span>
              ) : (
                <span className="bg-slate-850 text-slate-500 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border border-slate-800">
                  Free Tier
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-0.5">
              Level 4 Portfolio Strategist • Trading simulated with 100% risk-free market data.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="z-10 flex gap-2">
          <button
            onClick={onResetBalance}
            className="px-3.5 py-2.5 text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset simulated portfolio cash back to $100,000 and clear trades list"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Portfolio</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk sizing calculator - 5 cols */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="border-b border-slate-800 pb-2 flex items-center space-x-2">
            <Calculator className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Position Sizing Calculator</h3>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Determine your safe transaction quantities dynamically using your active simulated capital base.
          </p>

          <div className="space-y-3.5 pt-2">
            {/* Input 1: Risk % */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                <span>Risk Percentage per trade</span>
                <span className="text-slate-300 font-mono font-bold">{riskPercent}%</span>
              </div>
              <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 px-3 py-2">
                <Percent className="w-3.5 h-3.5 text-slate-650 mr-2 shrink-0" />
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Input 2: Entry Price */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Entry Price ($)</label>
              <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 px-3 py-2">
                <span className="text-slate-550 font-bold mr-1 text-xs">$</span>
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Math.max(0.01, parseFloat(e.target.value) || 0))}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Input 3: Stop loss */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Stop Loss Target ($)</label>
              <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 px-3 py-2">
                <span className="text-slate-550 font-bold mr-1 text-xs">$</span>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Math.max(0.01, parseFloat(e.target.value) || 0))}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-2.5 font-mono text-[11px] text-slate-450">
            <div className="flex justify-between">
              <span>Capital Risk Amount:</span>
              <span className="text-rose-450 font-bold">${riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Suggested Share Quantity:</span>
              <span className="text-white font-bold">{suggestedUnits > 0 ? Number(suggestedUnits.toFixed(1)) : 0} units</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/60 pt-2.5 text-xs">
              <span className="font-bold text-slate-350">Suggested Capital Exposure:</span>
              <span className="text-indigo-400 font-bold">${totalExposure.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Trade Logs / Active Sandbox - 7 cols */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
                <span>Simulated Order Journal</span>
              </h3>
              <span className="text-[10px] bg-slate-950 text-slate-500 border border-slate-800 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {tradeLog.length} Records
              </span>
            </div>

            {tradeLog.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <p className="text-xs text-slate-450 font-semibold">No transactions recorded yet.</p>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
                  Go to the <strong>Chart</strong> screen to test and execute mock transactions. Watchlist securities can also be used as targets.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {tradeLog.map(trade => {
                  const isBuy = trade.type === 'BUY';
                  return (
                    <div
                      key={trade.id}
                      className="p-3 bg-slate-950/85 border border-slate-850 rounded-xl flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                          isBuy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-rose-500/10 text-rose-400 border border-rose-500/15'
                        }`}>
                          {trade.type}
                        </div>
                        <div>
                          <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                            {trade.symbol}
                            <span className="text-[8px] bg-slate-900 text-slate-500 border border-slate-800/80 font-semibold px-1 rounded">Simulated</span>
                          </div>
                          <div className="text-[9px] text-slate-500 font-semibold font-mono">{trade.timestamp}</div>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <div className="font-bold text-white">${(trade.price * trade.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <div className="text-[9px] text-slate-500 font-medium">
                          {trade.amount} units @ ${trade.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats Summary Footer inside paper sandbox logs */}
          <div className="border-t border-slate-800/80 pt-4 mt-4 grid grid-cols-2 gap-3">
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 text-center">
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Trading Win Rate</div>
              <div className="text-base font-extrabold text-amber-400 mt-0.5">85.3%</div>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 text-center">
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Drawdown Risk</div>
              <div className="text-base font-extrabold text-emerald-400 mt-0.5">Low (1.4%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
