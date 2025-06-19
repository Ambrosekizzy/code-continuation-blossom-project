
import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import SearchResults from './SearchResults';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`);
      const data = await response.json();
      setSearchResults(data.results.slice(0, 5));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <header className="relative mb-16">
      <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-800 rounded"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <div className="text-2xl font-bold text-yellow-400">FMovies</div>
        </div>

        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="p-2 hover:bg-gray-800 rounded"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-5 bg-yellow-400 rounded-lg p-3 z-40 w-48">
          <ul className="space-y-2">
            <li><a href="/" className="block text-black hover:underline">Home</a></li>
            <li><a href="/movies" className="block text-black hover:underline">Movies</a></li>
            <li><a href="/tv" className="block text-black hover:underline">TV Shows</a></li>
          </ul>
        </div>
      )}

      {/* Search Container */}
      {isSearchOpen && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md z-40 px-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies and TV shows..."
              className="w-full p-3 pl-12 bg-gray-800 text-white rounded-lg border-none outline-none text-center"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-900 px-2 py-1 rounded-xl flex items-center gap-1">
              <Search className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">All</span>
            </div>
            
            {searchResults.length > 0 && (
              <SearchResults results={searchResults} query={searchQuery} />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
