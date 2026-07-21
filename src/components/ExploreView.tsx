import React, { useState } from 'react';
import { Search, Star, Share2, Layers, Sliders, Activity, TrendingUp, Compass, Award, ExternalLink, Bookmark, Clock, Eye } from 'lucide-react';
import { STRATEGY_SCRIPTS, NEWS_STORIES } from '../data';
import { StrategyScript, NewsStory } from '../types';

interface ExploreViewProps {
  onSelectScript: (scriptTitle: string) => void;
  isPro: boolean;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectScript,
  isPro
}) => {
  const [scriptSearch, setScriptSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'Indicators' | 'Strategies'>('all');
  const [scripts, setScripts] = useState<StrategyScript[]>(STRATEGY_SCRIPTS);
  const [savedStories, setSavedStories] = useState<string[]>([]);

  // Toggle favorite a script and increment stars
  const handleToggleFavoriteScript = (id: string) => {
    setScripts(prev =>
      prev.map(script => {
        if (script.id === id) {
          const wasStared = localStorage.getItem(`star-${id}`) === 'true';
          if (wasStared) {
            localStorage.removeItem(`star-${id}`);
            return { ...script, stars: script.stars - 1 };
          } else {
            localStorage.setItem(`star-${id}`, 'true');
            return { ...script, stars: script.stars + 1 };
          }
        }
        return script;
      })
    );
  };

  const handleToggleBookmarkStory = (id: string) => {
    if (savedStories.includes(id)) {
      setSavedStories(prev => prev.filter(storyId => storyId !== id));
    } else {
      setSavedStories(prev => [...prev, id]);
    }
  };

  // Filter scripts
  const filteredScripts = scripts.filter(s => {
    const matchesCategory = activeCategory === 'all' || 
      (activeCategory === 'Indicators' && s.type === 'Indicator') ||
      (activeCategory === 'Strategies' && s.type === 'Strategy');
    const matchesSearch = s.title.toLowerCase().includes(scriptSearch.toLowerCase()) || 
      s.description.toLowerCase().includes(scriptSearch.toLowerCase()) ||
      s.author.toLowerCase().includes(scriptSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getScriptIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-5 h-5 text-amber-400 animate-pulse" />;
      case 'Layers': return <Layers className="w-5 h-5 text-sky-400" />;
      case 'Sliders': return <Sliders className="w-5 h-5 text-purple-400" />;
      default: return <TrendingUp className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Search Header for Scripts & Indicators */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-5.5 h-5.5 text-indigo-400" />
              <span>Explore Technical Scripts</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Discover verified community scripts, indicators, and advanced backtesting strategy rulesets.
            </p>
          </div>

          {/* Script Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search strategy, indicators, scripts..."
              value={scriptSearch}
              onChange={(e) => setScriptSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-xs text-white rounded-xl pl-9 pr-4 py-2.5 focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Categories toggler */}
        <div className="flex gap-1.5 border-t border-slate-800/50 pt-3">
          {(['all', 'Indicators', 'Strategies'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  : 'bg-slate-950 text-slate-500 hover:bg-slate-800 hover:text-slate-200 border-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Strategy Scripts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScripts.map(script => {
          const isStared = localStorage.getItem(`star-${script.id}`) === 'true';
          return (
            <div
              key={script.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 relative group shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800">
                      {getScriptIcon(script.iconName)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{script.title}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold">
                        by <span className="text-slate-300">{script.author}</span> • <span className="text-slate-500 uppercase">{script.type}</span>
                      </p>
                    </div>
                  </div>

                  {/* Add Alert / Overlay Button */}
                  <button
                    onClick={() => onSelectScript(script.title)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase border border-indigo-500/20 cursor-pointer transition-all"
                  >
                    Load Script
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {script.description}
                </p>
              </div>

              {/* Strategy Footprint */}
              <div className="flex items-center justify-between border-t border-slate-800/50 pt-3 text-[10px] font-mono text-slate-500">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleFavoriteScript(script.id)}
                    className={`flex items-center space-x-1 hover:text-amber-400 cursor-pointer transition-colors ${isStared ? 'text-amber-400 font-bold' : ''}`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isStared ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{script.stars.toLocaleString()}</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <Share2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>{script.shares.toLocaleString()}</span>
                  </div>
                </div>

                <span className="text-[9px] text-indigo-400 font-extrabold uppercase bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                  Open source
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Stories Section with Grayscale to Color Transition */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span>Top Stories</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">Live Feed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NEWS_STORIES.map(story => {
            const isBookmarked = savedStories.includes(story.id);
            return (
              <div
                key={story.id}
                className="group flex flex-col sm:flex-row bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                {/* Image Container with Grayscale to Color Transition on Hover */}
                <div className="relative w-full sm:w-36 h-36 shrink-0 bg-slate-950 overflow-hidden">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-slate-950/85 text-[8px] font-bold text-white uppercase px-2 py-0.5 rounded tracking-wide border border-slate-800/50">
                    {story.category}
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-600" />
                        <span>{story.timeAgo}</span>
                      </div>
                      <button
                        onClick={() => handleToggleBookmarkStory(story.id)}
                        className="text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors"
                        title={isBookmarked ? "Remove Bookmark" : "Save Story"}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-indigo-500 text-indigo-400' : ''}`} />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
                      {story.title}
                    </h4>
                    
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 font-medium">
                      {story.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[10px] font-bold text-indigo-400">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Opening article: "${story.title}"\n(Fully connected simulated link!)`);
                      }}
                      className="flex items-center space-x-1 hover:underline cursor-pointer"
                    >
                      <span>Read Story</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    
                    <div className="flex items-center space-x-1.5 text-slate-600 font-mono text-[9px]">
                      <Eye className="w-3 h-3" />
                      <span>{Math.floor(Math.random() * 400 + 100)} views</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
