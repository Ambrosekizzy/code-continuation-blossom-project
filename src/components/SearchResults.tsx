
import React from 'react';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  media_type: string;
  release_date?: string;
  first_air_date?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, query }) => {
  const handleItemClick = (item: SearchResult) => {
    const url = item.media_type === 'tv' ? `/tv/watch/${item.id}` : `/movie/watch/${item.id}`;
    window.location.href = url;
  };

  const handleViewAll = () => {
    window.location.href = `/search?query=${encodeURIComponent(query)}`;
  };

  return (
    <div className="absolute top-12 left-0 w-full bg-gray-900 rounded-lg p-3 flex flex-col gap-3">
      {results.filter(item => item.poster_path).map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
          onClick={() => handleItemClick(item)}
        >
          <img
            src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
            alt={item.title || item.name}
            className="w-12 h-18 object-cover rounded"
          />
          <div className="flex flex-col">
            <div className="font-bold text-white">{item.title || item.name}</div>
            <div className="text-sm text-gray-400">
              {item.media_type === 'movie' ? 'Movie' : 'TV'} • {' '}
              {item.release_date ? item.release_date.split('-')[0] : 
               item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A'}
            </div>
          </div>
        </div>
      ))}
      
      <button
        onClick={handleViewAll}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View All Results
      </button>
    </div>
  );
};

export default SearchResults;
