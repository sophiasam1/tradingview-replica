import { Asset, FeaturedIPO, CommunityIdea, StrategyScript, NewsStory } from './types';

export const INITIAL_ASSETS: Asset[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 244.50,
    change: 4.40,
    changePercent: 1.83,
    trend: 'up',
    logoText: 'A',
    logoBg: 'bg-neutral-800 text-white',
    category: 'stocks',
    history: [238.10, 239.50, 241.00, 240.20, 242.10, 241.80, 243.00, 244.10, 243.80, 244.50]
  },
  {
    symbol: 'RKLB',
    name: 'Rocket Lab USA',
    price: 19.45,
    change: 2.15,
    changePercent: 12.43,
    trend: 'up',
    logoText: 'R',
    logoBg: 'bg-red-950 text-red-400 border border-red-800/30',
    category: 'stocks',
    history: [16.50, 16.90, 17.20, 17.00, 17.80, 18.20, 18.10, 18.90, 19.10, 19.45]
  },
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin / US Dollar',
    price: 102450.00,
    change: 4680.00,
    changePercent: 4.80,
    trend: 'up',
    logoText: '₿',
    logoBg: 'bg-amber-500/10 text-amber-500 border border-amber-500/30',
    category: 'crypto',
    history: [95400, 96800, 97100, 98000, 99500, 98200, 99900, 101200, 101500, 102450]
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 132.80,
    change: -2.92,
    changePercent: -2.15,
    trend: 'down',
    logoText: 'N',
    logoBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    category: 'stocks',
    history: [136.20, 135.50, 134.10, 135.00, 133.80, 134.20, 132.90, 133.10, 131.90, 132.80]
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 431.10,
    change: 2.87,
    changePercent: 0.67,
    trend: 'up',
    logoText: 'M',
    logoBg: 'bg-blue-600/10 text-blue-400 border border-blue-500/30',
    category: 'stocks',
    history: [427.50, 428.10, 429.00, 428.60, 429.90, 430.20, 429.50, 430.80, 430.50, 431.10]
  },
  {
    symbol: 'MSTR',
    name: 'MicroStrategy Inc.',
    price: 422.30,
    change: 34.50,
    changePercent: 8.90,
    trend: 'up',
    logoText: 'μ',
    logoBg: 'bg-purple-600/10 text-purple-400 border border-purple-500/30',
    category: 'stocks',
    history: [385.00, 390.10, 395.00, 392.20, 402.40, 408.10, 411.00, 415.50, 419.80, 422.30]
  },
  {
    symbol: 'XAUUSD',
    name: 'Gold Spot / US Dollar',
    price: 2845.20,
    change: 3.41,
    changePercent: 0.12,
    trend: 'up',
    logoText: 'Au',
    logoBg: 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30',
    category: 'metals',
    history: [2835.10, 2839.00, 2842.10, 2840.00, 2844.50, 2843.20, 2841.80, 2846.00, 2843.50, 2845.20]
  },
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    price: 1.0845,
    change: -0.0022,
    changePercent: -0.20,
    trend: 'down',
    logoText: '€',
    logoBg: 'bg-sky-500/10 text-sky-400 border border-sky-500/30',
    category: 'forex',
    history: [1.0872, 1.0868, 1.0855, 1.0859, 1.0851, 1.0848, 1.0852, 1.0841, 1.0849, 1.0845]
  }
];

export const FEATURED_IPOS: FeaturedIPO[] = [
  {
    symbol: 'CIG',
    name: 'Circle Internet Group',
    market: 'US NASDAQ',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb5E2O79uNZJsIMokk58SGL2N_KGQXW-WCKxAxunoVPL24NOJxkJPBxcqgZ0WR4bOrWNRR-XbX-CnHsWKkZiWCZR1EAg-MXEe2PV0F_Tn7PA8dDL17IZ7MugisgKUL6qV9Ukw_YZixX0A6bS40rE0Bu2AtxwfU-j6lUrZFLrwv7T1oHAYNZvtu-d0ACCxdmpHB1n60kzDLeQ_2GLoHYEdl30eb18T-90S-I9RHZ7LL-RR7RpMaXN1fzQ',
    logoBg: 'bg-[#1C36DF]',
    status: 'Pending',
    targetDateOrPrice: 'Aug 2026'
  },
  {
    symbol: 'STRV',
    name: 'Strava Inc.',
    market: 'US NYSE',
    status: 'Live',
    targetDateOrPrice: '$28.00 - $32.00',
    change: '+14.2%'
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    market: 'S&P 500 Entry',
    status: 'Watchlist',
    targetDateOrPrice: 'Active Tracking'
  }
];

export const COMMUNITY_IDEAS: CommunityIdea[] = [
  {
    id: 'idea-1',
    symbol: 'RKLB',
    title: 'ROCKET LAB (RKLB) MASSIVE BULL FLAG PATTERN TO TARGET $35.00',
    description: 'Rocket Lab (RKLB) is consolidating tightly in a classic bull flag structure following strong neutron engine program testing milestones. Retest of the $18.50 level has held beautifully, indicating aggressive institutional accumulation. We expect a violent continuation rally upwards to our final target of $35.00.',
    author: 'Rayannsr',
    authorRole: 'Pro Gold Creator',
    authorAvatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1qH8V-2QTQhWHN6_2-yRunLTe69V1hbjCDQtpjMFX2BnN_Cu31R179_-z3jKfa9guzQDfBtCwvIjS9RiM3N_-BUu4cthWJp2M7ZYQRGjPVSveMb-THq3NbqiX9MWr_L-mwOOkZwGQnesQ-5k2vZ-LW3kdSj2Wo_4aJpGYKItT3gNSrKap8Yfj1ItDvZc5G4_Bm-YZVcopiD9_FkrrXu6xAWm2pUFZgmrujm-y8fi9i5pMXcdFVQtluA',
    chartImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZsBmnDjGElTKethg3uQCsarHfBNm0MmWynLIqtBiBM8MOisYZXs-EwZx6H_RJ8maFnnj_JsFn9MEo5wJR_wxVUJOJHOkxMvCOAdwu_GR1JpckIZIw-z8VS8uo2zJjDWczpSVVgUrpME5YPMT1MxstSeGm1fEm6xmZWODXYVI7z-dSReT5oGPa_p2XCokmnJBxVX60XaMEDn_ih04AmNlnBIwlUzICmNIvxLTYmas53urQiSwzSTZOYg',
    type: 'LONG',
    views: '12.8K',
    commentsCount: 342,
    likes: 1854,
    timeAgo: '4 hours ago'
  },
  {
    id: 'idea-2',
    symbol: 'BTCUSD',
    title: 'BITCOIN (BTCUSD) - ROAD TO $150K AFTER SEC REGULATION & STABLE INFLOWS',
    description: 'Bitcoin has established a highly key support base at the $95,000 zone. Massive spot ETF inflows continue to deplete exchange supplies, and the technical daily golden cross indicates we are on track for a powerful wave-5 parabolic breakout. Clear structural target is set at $150,000 by late Q3.',
    author: 'Xanrox',
    authorRole: 'Market Analyst Expert',
    authorAvatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUQbAozu33qQU8vlmHrJZlUfLn5Xd_Yn-IBy_DUxbKfKaCzfOFVTz5T6b5AWIrfFzkYNi4IX56xJaL6GbiFvhZfbXxI781Sz8dw2UxFDgI2utxWzUaSrOmqs-O7gH-nivfC7J1CuFCDPxM6IcuAqQEmGLkWWN4ZYVBesnfi21OpPsDH0X72oU1Rgzsa9S9CbBcHoC3sJMuE50dPTUOC46Aj16MGlwoQ9V291L7Q2QoHDwr-f6rGwOg3Q',
    chartImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoAyCYjiCh6K2uIwf6heyN6TOsyiQLc_7WjulX7RC_4IMVGTqePlceDZ82DCvFecIlSXIqffuNnkRNjlZUdNPIv2ob0QHGoV5my_jSae4l8aEjF8ylG30rD96vBpZKXv1mqgflt0WbEVGgHUFydZiEqjdGG2O90KtoXXxEmK5ZNa3Lnb3wDdU2gZX4Ld8RIH0YmaeYwEGwebMClfLM382e8LhwyA0t-pzEA8f7KYwDdWWpi-ATRdKROg',
    type: 'LONG',
    views: '45.2K',
    commentsCount: 894,
    likes: 4210,
    timeAgo: '12 hours ago'
  },
  {
    id: 'idea-3',
    symbol: 'AAPL',
    title: 'APPLE INC (AAPL) BREAKOUT AT HEAVY VOLUME CONFIRMED',
    description: 'Apple has shattered resistance at $240 on enormous volume. This consolidation break confirms a bullish continuation cup-and-handle pattern. Next structural high-volume target is $265, with stop-loss strictly pinned at $235 to manage systemic downside risk.',
    author: 'Torik2x',
    authorRole: 'Chartist & Swing Trader',
    authorAvatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm_mNHwmwH-JgpqXZl5Z27mAhZgCyj85-j3o4FLgMJACVegq9tfkahKtMmVHwzOFQdICnHsFzY5x4ZwQdueTQ0k4l4cMvFUWMLrklSMklZPAC7HuRvSgLM8XQmOPFOfg-2lObtWam5AtcFwmmEflP3m8h5flUd4DcGMsTB0jyVY6iIp6AFwt6CB3SR_sosb7W43O_2DHl9xweTKen_izwX9-USEtnYIK-MIlMRd4lGGmSxJ_mFJ6zIAQ',
    chartImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbcQ-Eej5yOTg3CanzW9Ydm-eVe1lK1ywYPcvJK_eyxmqLEZHgoHPMsPUwrhfc9wpcAzBuL8DyF2ns5TPCk7VWDT_L6wiMvyUBsD_8fEjDKCFikW2YeFG_F9MQpzAOlsuIK6XHpXGoMJ_dlFJT8ctHjsTmuIAppMIhiyXI5PI0Ks7d3vr4tS-Ipvfixtdm_sgecaaZj-0YW6J7TqSObtPbgF7dDoxyUXQPtxqpeOm-PkuEeN_ddfRfbQ',
    type: 'LONG',
    views: '9.4K',
    commentsCount: 125,
    likes: 549,
    timeAgo: '1 day ago'
  },
  {
    id: 'idea-4',
    symbol: 'XAUUSD',
    title: 'GOLD Spot (XAUUSD) - MOVING AVERAGES IN CONVERGENCE SHOWS WEAKNESS',
    description: 'Gold spot is showing clear momentum exhaustion around the $2850 high limit. Indicators display a double top on the 4-hour interval with bearish divergence on the RSI. We expect a localized structural correction back to the 200 EMA support at $2780. Recommending defensive positions.',
    author: 'Lingrid',
    authorRole: 'Macro Strategist',
    authorAvatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGd5r0qyDzaBMvcW_xmFTbhCWDipt6ekt9ess8j67iYW4Ez--_BfAngIWI-D0CstlJVvaZXzM0-IQ-YHvxpd_GAHdaMW3-4fcbyXXL5zf2tp5xn_Q0pZ5aPbRm_9XZLk9JzxUyc4Ayb68J-2RUcdOnMmxuOjvLB6SyndFvfOUBLPOw4quwmqMe3fD708uaTHT4G-UPjmR_rlj1o0pBxIthqSluaBDsIH961PO8EMhV83XfLOrYY7hgKA',
    chartImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDxIEKYdotHZR-QlP0DKMezUs47OIHEFOcVz-zOtyR1kEaQ3O35cvcfeBhKi4dgZx-kKJCAMy0Y4HV82tHpPyXxb17qtlrSO9h-O5TUZtHmJuCK2oQlVp3actE1Elj27P8-Q5XSjCmU91RYaEVTPZJhbAoco_I6_ViMX14Ai0rCwgCxe7ZAqmRu7EcBNxd92m2ELNSXtE0D4kUtq55VPU95sBaBmM-uccK6bjyrHb1pbgld7VIRUvWGg',
    type: 'SHORT',
    views: '15.6K',
    commentsCount: 198,
    likes: 812,
    timeAgo: '2 days ago'
  }
];

export const STRATEGY_SCRIPTS: StrategyScript[] = [
  {
    id: 'script-1',
    title: 'Machine Learning RSI Classifier [LuxAlgo]',
    type: 'Indicator',
    description: 'Applies automated support-vector classification over standard Relative Strength Index lines to filter out false breakouts and highlight extreme supply-demand zones.',
    author: 'LuxAlgo',
    stars: 12543,
    shares: 4509,
    iconName: 'Activity'
  },
  {
    id: 'script-2',
    title: 'Intrabar Volume Profile with VPOC Highlighting',
    type: 'Indicator',
    description: 'Draws dynamic horizontal bars representing execution volume at specific price levels directly inside each candle interval. Displays Point of Control (VPOC) in orange.',
    author: 'CoreDev_FX',
    stars: 8712,
    shares: 3201,
    iconName: 'Layers'
  },
  {
    id: 'script-3',
    title: 'Smart Money Concepts & Order Blocks [LuxAlgo]',
    type: 'Strategy',
    description: 'Highlights market structure changes, breaker blocks, order blocks, equal highs/lows, and premium/discount zones in real-time based on high-frequency pricing flows.',
    author: 'LuxAlgo',
    stars: 18456,
    shares: 6112,
    iconName: 'TrendingUp'
  },
  {
    id: 'script-4',
    title: 'Adaptive Multi-EMA Trend Corridor',
    type: 'Indicator',
    description: 'Generates a beautiful dynamic gradient tunnel utilizing 8 separate exponential moving averages with logarithmic spacing, helping trend riders prevent premature exits.',
    author: 'QuantLeap',
    stars: 4320,
    shares: 1109,
    iconName: 'Sliders'
  }
];

export const NEWS_STORIES: NewsStory[] = [
  {
    id: 'news-1',
    category: 'Market Digest',
    timeAgo: '15 mins ago',
    title: 'S&P 500 Snaps Weekly Losing Streak as Technology and Microchip Stocks Experience Massive Revival',
    description: 'Institutional buying programs aggressively lifted tech mega-caps in late trading on Friday. Traders cite heavy short squeezing across semiconductor designs alongside solid corporate buybacks as key drivers.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdbNXKaBaYWPsglzfOxY_F3hlYHmZoUfzu-R4n6QsIOI0RqRLWEAQQ1hp8jIqB0JxUgh7qp2Zyq8URSl5h5C_a7_GV1FhIYyFLoiu8-avDQw2HTUjQyKOZN4_v9al8JloZ0sMYKylXeM5oUNWyAistIx771L5N6zozkmAEFAp60_vSTHBZmPT08DVrrPtaRlseoHulvCrdiorDH-1QaB3AMF6pamCG0vzBrReT3um44FjsUjyrY-pesA'
  },
  {
    id: 'news-2',
    category: 'Tech Frontier',
    timeAgo: '45 mins ago',
    title: 'Next-Generation Neural Accelerators Unveiled, Sparking Global Demand Surges in Data Infrastructure',
    description: 'Fab laboratories reported historic booking order backlogs following the debut of 3nm neural engine architectures. Sovereign wealth funds have reportedly committed billions in custom microchip infrastructure.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZe5JALQYXu5ftzpXmnilKbXUxQs5SgOTHI9W_7Wpcye7fPawD8hYpJ0Y-bIBcum_PbLbv0FEL4mhDJVJHjfyqbpUdx0lhiVc2eg5dD8O4ZOyzmMPkZK073qdNpb9WYmrZ1rvFOBJMZU41sASswI7q3w6zzLBO3XL6N7shehv90GvwXex59HR4701xtLhcgtBxb2HEUarT0n4wd8jH9m84L3aa7TjIWnk6jxcywOV1ImkbSVVQ4BUz3g'
  },
  {
    id: 'news-3',
    category: 'Analysis Spot',
    timeAgo: '2 hours ago',
    title: 'Apple prepares breakthrough AI integration across primary productivity and device applications',
    description: 'Leaked developer code outlines high-performance local inference models optimized to operate directly inside standard core silicon, bypassing standard server hops entirely and providing real-time agency.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO9h2098q55CmDUVXLX5SZpHsrIwp-gZX6ltMIqf9WVmMIa7Qy-q3wbm085skWXWG0ABR1VS1PYyzTgw6mNQeNoC5qxkeXf2QqhaAaN-pQ53Y3EtEcybCikwgvt0QxmOL4c38rf3VjSrM1p7YTVZpsGnyUQuEZFFRpPbNxX9Hi4ZbhGNX3a1fni_Gp6N9w60lHfkl_kpHnbCi7EzEDEuzNmOzswAe_zpKd6tlSSAwXIJe6106We1bH5Q'
  },
  {
    id: 'news-4',
    category: 'Digital Gold',
    timeAgo: '4 hours ago',
    title: 'Bitcoin maintains strong support floor as corporate treasury departments continue steady accumulation',
    description: 'On-chain analytics disclose significant blocks of supply moving to deep cold storage accounts. Regulated stablecoin supplies also touched lifetime highs, signaling massive latent liquidity ready for deployment.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNGf81G3JpuDp-qZrS_nWqNNKx2J7tuBWkUWU-KntCgouHjjmca7YRyMfltX42DxqGDnNuTFrcxLEuUIlORLpRl8ERKEq5s7pzlzz1B1SKy2RyxFfyMoxwefNqMi9dYsl36z9p7pz1kecdFfJZLEgUL7UcexSheh3I5bPm68tNjr6-kzRCh9fmr6ZsFmyWydKbLdsIxEJUqWKXOQuAqg_Gxthd0_JeOvKq7OmBKL99bs7Nl0FTVSz9IQ'
  }
];
