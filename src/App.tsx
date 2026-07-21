import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeView } from './components/HomeView';
import { ChartView } from './components/ChartView';
import { ExploreView } from './components/ExploreView';
import { CommunityView } from './components/CommunityView';
import { ProfileView } from './components/ProfileView';

import { Asset, ActiveTab, SimulatedTrade } from './types';
import { INITIAL_ASSETS } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('watchlist');
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>('RKLB');
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [watchlist, setWatchlist] = useState<string[]>(['AAPL', 'RKLB', 'BTCUSD', 'XAUUSD']);
  const [portfolioBalance, setPortfolioBalance] = useState<number>(100000.00);
  const [tradeLog, setTradeLog] = useState<SimulatedTrade[]>([]);
  const [isPro, setIsPro] = useState<boolean>(false);

  // Live fluctuating pricing ticker simulation for all listed assets
  useEffect(() => {
    const timer = setInterval(() => {
      setAssets(prev =>
        prev.map(asset => {
          // 40% chance an asset ticks
          if (Math.random() > 0.4) return asset;

          const percentMultiplier = (Math.random() - 0.49) * 0.4; // random tick fluctuation
          const deltaMultiplier = 1 + percentMultiplier / 100;
          const newPrice = asset.price * deltaMultiplier;
          const oldPrice = asset.price;
          const diff = newPrice - oldPrice;

          // Slide the historical array keeping length strictly at 10
          const updatedHistory = [...asset.history.slice(1), Number(newPrice.toFixed(asset.symbol === 'EURUSD' ? 4 : 2))];

          return {
            ...asset,
            price: Number(newPrice.toFixed(asset.symbol === 'EURUSD' ? 4 : 2)),
            change: Number((asset.change + diff).toFixed(2)),
            changePercent: Number((asset.changePercent + percentMultiplier).toFixed(2)),
            trend: diff >= 0 ? 'up' : 'down',
            history: updatedHistory
          };
        })
      );
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const selectedAsset = assets.find(a => a.symbol === selectedAssetSymbol) || assets[0];

  // Watchlist Actions
  const handleAddToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist(prev => [...prev, symbol]);
    }
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  };

  // Switch to chart and load specific asset
  const handleSelectAsset = (symbol: string) => {
    setSelectedAssetSymbol(symbol);
    setActiveTab('chart');
  };

  // simulated trade log recording
  const handleExecuteTrade = (trade: Omit<SimulatedTrade, 'id' | 'timestamp'>) => {
    const cost = trade.price * trade.amount;
    const timeStr = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (trade.type === 'BUY') {
      setPortfolioBalance(prev => Number((prev - cost).toFixed(2)));
    } else {
      setPortfolioBalance(prev => Number((prev + cost).toFixed(2)));
    }

    const newLogEntry: SimulatedTrade = {
      id: `trade-${Date.now()}`,
      ...trade,
      timestamp: timeStr
    };

    setTradeLog(prev => [newLogEntry, ...prev]);
  };

  // Reset demo portfolio back to $100k
  const handleResetBalance = () => {
    if (window.confirm("Are you sure you want to reset your simulated demo portfolio? This will set cash back to $100,000.00 and clear your journal logs.")) {
      setPortfolioBalance(100000.00);
      setTradeLog([]);
    }
  };

  // Load community analysis setup directly into Chart
  const handleCopyTradeSetup = (symbol: string, type: 'BUY' | 'SELL') => {
    setSelectedAssetSymbol(symbol);
    setActiveTab('chart');
    alert(`Loaded ${symbol} analysis setup into active Chart! Try placing a simulated ${type} order.`);
  };

  // Loaded explore script handler
  const handleSelectScript = (title: string) => {
    setActiveTab('chart');
    alert(`Successfully compiled and overlayed strategy script: "${title}" directly onto the interactive candlestick canvas.`);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'watchlist':
        return (
          <HomeView
            assets={assets}
            watchlist={watchlist}
            onAddToWatchlist={handleAddToWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            onSelectAsset={handleSelectAsset}
            isPro={isPro}
          />
        );
      case 'chart':
        return (
          <ChartView
            selectedAsset={selectedAsset}
            assets={assets}
            onSelectAsset={(sym) => setSelectedAssetSymbol(sym)}
            portfolioBalance={portfolioBalance}
            onExecuteTrade={handleExecuteTrade}
            isPro={isPro}
          />
        );
      case 'explore':
        return (
          <ExploreView
            onSelectScript={handleSelectScript}
            isPro={isPro}
          />
        );
      case 'community':
        return (
          <CommunityView
            onCopyTradeSetup={handleCopyTradeSetup}
            isPro={isPro}
          />
        );
      case 'menu':
        return (
          <ProfileView
            portfolioBalance={portfolioBalance}
            tradeLog={tradeLog}
            isPro={isPro}
            onTogglePro={() => setIsPro(!isPro)}
            onResetBalance={handleResetBalance}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans select-none antialiased">
      {/* Top Header Section */}
      <Header
        assets={assets}
        portfolioBalance={portfolioBalance}
        isPro={isPro}
        onTogglePro={() => setIsPro(!isPro)}
        onSelectAsset={handleSelectAsset}
        onOpenProfile={() => setActiveTab('menu')}
      />

      {/* Main Content Pane */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {renderActiveScreen()}
      </main>

      {/* Bottom Floating Menu Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        isPro={isPro}
      />
    </div>
  );
}
