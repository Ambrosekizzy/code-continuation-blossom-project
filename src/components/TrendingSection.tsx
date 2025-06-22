
import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface TrendingItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  number_of_episodes?: number;
  number_of_seasons?: number;
}

interface TrendingSectionProps {
  movies: TrendingItem[];
  tvShows: TrendingItem[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ movies, tvShows }) => {
  const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies');

  const currentData = activeTab === 'movies' ? movies : tvShows;

  return (
    <div className="px-5 mb-8 relative z-20">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-xl font-bold text-white">
          Trending <TrendingUp className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-3 py-1.5 text-sm rounded border border-yellow-400 transition-colors ${
              activeTab === 'movies' 
                ? 'bg-yellow-400/20 text-yellow-400' 
                : 'text-yellow-400 hover:bg-yellow-400/10'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab('tv')}
            className={`px-3 py-1.5 text-sm rounded border border-yellow-400 transition-colors ${
              activeTab === 'tv' 
                ? 'bg-yellow-400/20 text-yellow-400' 
                : 'text-yellow-400 hover:bg-yellow-400/10'
            }`}
          >
            Shows
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {currentData.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between p-3 border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
            <a
              href={activeTab === 'movies' ? `/movie/watch/${item.id}` : `/tv/watch/${item.id}`}
              className="flex items-center w-full text-white no-underline"
            >
              <div className="relative mr-5">
                <span className="absolute -left-5 top-1/2 transform -translate-y-1/2 bg-gray-900 text-yellow-400 font-bold text-sm w-8 h-8 rounded-full border-2 border-yellow-400 flex items-center justify-center">
                  {index + 1}
                </span>
                <img
                  src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-15 h-24 object-cover rounded"
                />
              </div>
              <div className="flex items-center gap-3 flex-grow">
                <div>
                  <h5 className="font-bold text-sm mb-1">{item.title || item.name}</h5>
                  <span className="text-xs text-gray-400">
                    {activeTab === 'movies' 
                      ? `Movie • ${120} min` 
                      : `TV • EP${item.number_of_episodes || 10} • SS${item.number_of_seasons || 1}`
                    }
                  </span>
                </div>
                <span className="text-xs text-gray-400 ml-auto">
                  {item.release_date ? item.release_date.split('-')[0] : 
                   item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A'}
                </span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
