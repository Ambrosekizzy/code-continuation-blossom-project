
import React, { useState } from 'react';
import { Search, Menu, Filter, User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchResults from './SearchResults';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchFilter, setSearchFilter] = useState('all');

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      let endpoint = '';
      if (searchFilter === 'movie') {
        endpoint = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`;
      } else if (searchFilter === 'tv') {
        endpoint = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`;
      } else {
        endpoint = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`;
      }
      
      const response = await fetch(endpoint);
      const data = await response.json();
      setSearchResults(data.results.slice(0, 5));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <header className="w-full bg-gray-900 relative z-50">
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-800 rounded"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <Link to="/" className="text-2xl font-bold text-yellow-400">FMovies</Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-gray-800 rounded"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
          
          <Link to="/filters" className="p-2 hover:bg-gray-800 rounded">
            <Filter className="w-5 h-5 text-white" />
          </Link>

          <button className="p-2 hover:bg-gray-800 rounded">
            <LogIn className="w-5 h-5 text-white" />
          </button>

          <button className="p-2 hover:bg-gray-800 rounded">
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-4 bg-yellow-400 rounded-lg p-3 z-40 w-48">
          <ul className="space-y-2">
            <li><Link to="/" className="block text-black hover:underline">Home</Link></li>
            <li><Link to="/movies" className="block text-black hover:underline">Movies</Link></li>
            <li><Link to="/tv" className="block text-black hover:underline">TV Shows</Link></li>
            <li><Link to="/filters" className="block text-black hover:underline">Filters</Link></li>
            <li><Link to="/mylist" className="block text-black hover:underline">My List</Link></li>
          </ul>
        </div>
      )}

      {/* Search Container */}
      {isSearchOpen && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md z-40 px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies and TV shows..."
              className="w-full p-3 pl-12 bg-gray-800 text-white rounded-lg border-none outline-none text-center"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-900 px-2 py-1 rounded-xl flex items-center gap-2">
              <Search className="w-4 h-4 text-white" />
              <select 
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="text-xs font-bold text-white bg-transparent outline-none"
              >
                <option value="all" className="text-black">All</option>
                <option value="movie" className="text-black">Movies</option>
                <option value="tv" className="text-black">TV</option>
              </select>
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
