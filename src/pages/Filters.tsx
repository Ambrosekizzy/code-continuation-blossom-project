
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';

interface FilterOptions {
  type: 'all' | 'movie' | 'tv';
  genre: string;
  year: string;
  rating: string;
  sortBy: string;
}

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
}

const Filters = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity.desc'
  });
  const [results, setResults] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  const genres = [
    { id: '28', name: 'Action' },
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '18', name: 'Drama' },
    { id: '10751', name: 'Family' },
    { id: '14', name: 'Fantasy' },
    { id: '27', name: 'Horror' },
    { id: '9648', name: 'Mystery' },
    { id: '878', name: 'Science Fiction' },
    { id: '53', name: 'Thriller' }
  ];

  const years = Array.from({ length: 30 }, (_, i) => (2024 - i).toString());

  const applyFilters = async (page: number = 1) => {
    setLoading(true);
    try {
      let endpoint = '';
      const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: page.toString(),
        sort_by: filters.sortBy
      });

      if (filters.genre) params.append('with_genres', filters.genre);
      if (filters.year) params.append('year', filters.year);
      if (filters.rating) params.append('vote_average.gte', filters.rating);

      if (filters.type === 'movie') {
        endpoint = `https://api.themoviedb.org/3/discover/movie?${params}`;
      } else if (filters.type === 'tv') {
        endpoint = `https://api.themoviedb.org/3/discover/tv?${params}`;
        if (filters.year) {
          params.delete('year');
          params.append('first_air_date_year', filters.year);
        }
        endpoint = `https://api.themoviedb.org/3/discover/tv?${params}`;
      } else {
        // For 'all', we'll fetch both movies and TV shows
        const movieParams = new URLSearchParams(params);
        const tvParams = new URLSearchParams(params);
        if (filters.year) {
          tvParams.delete('year');
          tvParams.append('first_air_date_year', filters.year);
        }
        
        const [movieRes, tvRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/discover/movie?${movieParams}`),
          fetch(`https://api.themoviedb.org/3/discover/tv?${tvParams}`)
        ]);
        
        const movieData = await movieRes.json();
        const tvData = await tvRes.json();
        
        const combined = [
          ...movieData.results.map((item: any) => ({ ...item, media_type: 'movie' })),
          ...tvData.results.map((item: any) => ({ ...item, media_type: 'tv' }))
        ].slice(0, 20);
        
        setResults(combined);
        setTotalPages(Math.max(movieData.total_pages, tvData.total_pages));
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint);
      const data = await response.json();
      setResults(data.results.map((item: any) => ({
        ...item,
        media_type: filters.type === 'movie' ? 'movie' : 'tv'
      })));
      setTotalPages(Math.min(data.total_pages, 500));
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters(currentPage);
  }, [filters, currentPage]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={page === currentPage}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-6">Filters</h1>
        
        {/* Filter Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 outline-none"
              >
                <option value="all">All</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 outline-none"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 outline-none"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Min Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 outline-none"
              >
                <option value="">Any Rating</option>
                <option value="7">7+ Stars</option>
                <option value="8">8+ Stars</option>
                <option value="9">9+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 outline-none"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="release_date.desc">Newest</option>
                <option value="title.asc">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-white text-center py-8">Loading...</div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                {results.length} Results Found
              </h2>
            </div>
            <MovieGrid movies={results} type="multi" />
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </main>
    </div>
  );
};

export default Filters;
