import React, { useState } from 'react';
import { Search, Heart, MessageSquare, Eye, Bookmark, Award, ExternalLink, RefreshCw, X, TrendingUp, BarChart } from 'lucide-react';
import { COMMUNITY_IDEAS } from '../data';
import { CommunityIdea } from '../types';

interface CommunityViewProps {
  onCopyTradeSetup: (symbol: string, type: 'BUY' | 'SELL') => void;
  isPro: boolean;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  onCopyTradeSetup,
  isPro
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'LONG' | 'SHORT'>('ALL');
  const [ideas, setIdeas] = useState<CommunityIdea[]>(COMMUNITY_IDEAS);
  const [selectedIdea, setSelectedIdea] = useState<CommunityIdea | null>(null);
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState<string[]>([]);

  // Toggle Like with animation and state persist
  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdeas(prev =>
      prev.map(idea => {
        if (idea.id === id) {
          const likedKey = `like-${id}`;
          const isLiked = localStorage.getItem(likedKey) === 'true';
          if (isLiked) {
            localStorage.removeItem(likedKey);
            return { ...idea, likes: idea.likes - 1 };
          } else {
            localStorage.setItem(likedKey, 'true');
            return { ...idea, likes: idea.likes + 1 };
          }
        }
        return idea;
      })
    );
  };

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIdeas.includes(id)) {
      setBookmarkedIdeas(prev => prev.filter(ideaId => ideaId !== id));
    } else {
      setBookmarkedIdeas(prev => [...prev, id]);
    }
  };

  // Filter ideas
  const filteredIdeas = ideas.filter(idea => {
    const matchesFilter = activeFilter === 'ALL' || idea.type === activeFilter;
    const matchesSearch =
      idea.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Search Header for community */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart className="w-5.5 h-5.5 text-indigo-400" />
              <span>Community Strategy Feed</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Explore charting breakdowns, macro forecasts, and dynamic ideas uploaded by top-ranked certified creators.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ticker, strategies, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-xs text-white rounded-xl pl-9 pr-4 py-2.5 focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Long/Short Tabs */}
        <div className="flex gap-1.5 border-t border-slate-800/50 pt-3">
          {(['ALL', 'LONG', 'SHORT'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                activeFilter === filter
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10 border-indigo-500/20'
                  : 'bg-slate-950 text-slate-500 hover:bg-slate-800 hover:text-slate-200 border-slate-800/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Card Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIdeas.map(idea => {
          const isLiked = localStorage.getItem(`like-${idea.id}`) === 'true';
          const isBookmarked = bookmarkedIdeas.includes(idea.id);

          return (
            <div
              key={idea.id}
              onClick={() => setSelectedIdea(idea)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-sm"
            >
              {/* Card Header Profile */}
              <div className="p-4 flex justify-between items-center bg-slate-900">
                <div className="flex items-center space-x-3">
                  <img
                    src={idea.authorAvatarUrl}
                    alt={idea.author}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {idea.author}
                      <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-1.5 py-0.2 rounded font-bold uppercase">
                        PRO
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{idea.authorRole}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[9px] text-slate-500 font-mono font-semibold">{idea.timeAgo}</span>
                  <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wide border uppercase ${
                    idea.type === 'LONG' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {idea.type}
                  </span>
                </div>
              </div>

              {/* Chart Screenshot thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-y border-slate-800/80">
                <img
                  src={idea.chartImageUrl}
                  alt={`${idea.symbol} chart breakdown`}
                  className="w-full h-full object-cover transform group-hover:scale-[1.01] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Ticker Floating Label */}
                <span className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white shadow-md">
                  {idea.symbol}
                </span>
              </div>

              {/* Text Area */}
              <div className="p-4 space-y-2 flex-1">
                <h3 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2 uppercase">
                  {idea.title}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 font-medium">
                  {idea.description}
                </p>
              </div>

              {/* Card Footer metrics */}
              <div className="px-4 py-3 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <div className="flex items-center space-x-4">
                  {/* Like btn */}
                  <button
                    onClick={(e) => handleToggleLike(idea.id, e)}
                    className={`flex items-center space-x-1.5 hover:text-rose-400 transition-colors cursor-pointer ${isLiked ? 'text-rose-400 font-bold' : ''}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-400' : ''}`} />
                    <span>{idea.likes}</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                    <span>{idea.commentsCount}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>{idea.views}</span>
                  </div>

                  <button
                    onClick={(e) => handleToggleBookmark(idea.id, e)}
                    className="hover:text-indigo-400 cursor-pointer transition-colors"
                    title={isBookmarked ? "Remove Bookmark" : "Save Strategy"}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-indigo-500 text-indigo-400' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Analysis Detail Modal Drawer */}
      {selectedIdea && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative animate-scaleUp">
            
            {/* Close btn */}
            <button
              onClick={() => setSelectedIdea(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Context */}
            <div className="p-6 pb-4 border-b border-slate-800/80 flex items-center space-x-3 bg-slate-900">
              <img
                src={selectedIdea.authorAvatarUrl}
                alt={selectedIdea.author}
                className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                  {selectedIdea.author}
                  <span className="text-[9px] bg-amber-500/10 text-amber-450 border border-amber-500/20 px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wide">
                    VIP
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold">{selectedIdea.authorRole} • Uploaded {selectedIdea.timeAgo}</p>
              </div>
            </div>

            {/* Strategy Title & Graphic */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase border ${
                  selectedIdea.type === 'LONG' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  Action: {selectedIdea.type} Setup
                </span>
                <h2 className="text-base font-bold text-white uppercase tracking-wide leading-snug">
                  {selectedIdea.title}
                </h2>
              </div>

              {/* Full sized high quality diagram */}
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={selectedIdea.chartImageUrl}
                  alt="High quality trading diagram setup"
                  className="w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Detailed Breakdown Text */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Technical Analysis Notes</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium whitespace-pre-line bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  {selectedIdea.description}
                  {"\n\n"}
                  <strong className="text-white">Risk Parameters:</strong>{"\n"}
                  • Entry Zone: Around current consolidated levels.{"\n"}
                  • Target Profit Level: ~35% - 40% upper band breakout.{"\n"}
                  • Strict Stop-Loss Margin: 8.5% below secondary key support levels to manage systemic drawdown.
                </p>
              </div>

              {/* Direct Copy Trade Simulator CTA */}
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left space-y-0.5">
                  <h5 className="text-xs font-bold text-indigo-400">Instantly Test This Setup</h5>
                  <p className="text-[10px] text-slate-500 font-semibold">Copies ticker and direction into your simulated trade module.</p>
                </div>
                
                <button
                  onClick={() => {
                    onCopyTradeSetup(selectedIdea.symbol, selectedIdea.type === 'LONG' ? 'BUY' : 'SELL');
                    setSelectedIdea(null);
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 fill-white" />
                  <span>Copy Trade Setup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
