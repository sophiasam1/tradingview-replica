export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number; // raw value change
  changePercent: number; // percentage change
  trend: 'up' | 'down' | 'flat';
  logoText: string;
  logoBg?: string;
  category: 'crypto' | 'stocks' | 'forex' | 'energy' | 'metals';
  history: number[]; // history of last 10 ticks for chart mini-previews
}

export interface FeaturedIPO {
  symbol: string;
  name: string;
  market: string;
  logoUrl?: string;
  logoBg?: string;
  status: 'Pending' | 'Live' | 'Watchlist';
  targetDateOrPrice: string;
  change?: string;
}

export interface CommunityIdea {
  id: string;
  symbol: string;
  title: string;
  description: string;
  author: string;
  authorRole: string;
  authorAvatarUrl: string;
  chartImageUrl: string;
  type: 'LONG' | 'SHORT';
  views: string;
  commentsCount: number;
  likes: number;
  timeAgo: string;
}

export interface StrategyScript {
  id: string;
  title: string;
  type: 'Indicator' | 'Strategy';
  description: string;
  author: string;
  stars: number;
  shares: number;
  iconName: 'TrendingUp' | 'Layers' | 'Activity' | 'Sliders';
}

export interface NewsStory {
  id: string;
  category: string;
  timeAgo: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface SimulatedTrade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  timestamp: string;
}

export type ActiveTab = 'watchlist' | 'chart' | 'explore' | 'community' | 'menu';
