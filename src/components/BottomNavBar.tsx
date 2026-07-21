import React from 'react';
import { Star, BarChart2, Compass, MessageSquare, Briefcase, Zap } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  isPro: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  isPro
}) => {
  const tabs = [
    { id: 'watchlist', label: 'Watchlist', icon: Star },
    { id: 'chart', label: 'Chart', icon: BarChart2 },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'menu', label: 'Simulator', icon: Briefcase }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md pb-safe">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className="relative py-2 px-3 flex flex-col items-center justify-center space-y-1 group transition-all duration-200 cursor-pointer focus:outline-none"
            >
              {/* Highlight background on hover/active */}
              <div
                className={`absolute inset-0 rounded-xl transition-all duration-300 -z-10 ${
                  isActive ? 'bg-indigo-500/10 scale-100' : 'scale-75 opacity-0 group-hover:opacity-100 group-hover:bg-slate-800/50 group-hover:scale-100'
                }`}
              />

              {/* Icon */}
              <div className="relative">
                <Icon
                  className={`w-5.5 h-5.5 transition-all duration-300 ${
                    isActive ? 'text-indigo-400 scale-110 stroke-[2.5]' : 'text-slate-500 group-hover:text-slate-200 stroke-[2]'
                  }`}
                />
                {tab.id === 'menu' && isPro && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-semibold tracking-wide transition-all duration-200 ${
                  isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-200'
                }`}
              >
                {tab.label}
              </span>

              {/* Bottom active line indicator */}
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
