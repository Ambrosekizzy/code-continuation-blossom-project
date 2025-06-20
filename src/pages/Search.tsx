
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  media_type: string;
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  useEffect(() => {
    if (query) {
      searchContent(currentPage);
    }
  }, [query, currentPage]);

  useEffect(() => {
    applyFilters();
  }, [results, mediaTypeFilter, yearFilter]);

  const searchContent = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await response.json();
      
      // Filter out person results and results without posters
      const filteredResults = data.results.filter((item: any) => 
        item.media_type !== 'person' && item.poster_path
      );
      
      setResults(filteredResults);
      setTotalPages(Math.min(data.total_pages, 500));
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...results];

    // Filter by media type
    if (mediaTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.media_type === mediaTypeFilter);
    }

    // Filter by year
    if (yearFilter !== 'all') {
      const year = parseInt(yearFilter);
      filtered = filtered.filter(item => {
        const itemYear = item.release_date ? 
          parseInt(item.release_date.split('-')[0]) : 
          item.first_air_date ? parseInt(item.first_air_date.split('-')[0]) : 0;
        
        switch (yearFilter) {
          case '2020s':
            return itemYear >= 2020;
          case '2010s':
            return itemYear >= 2010 && itemYear < 2020;
          case '2000s':
            return itemYear >= 2000 && itemYear < 2010;
          case '1990s':
            return itemYear >= 1990 && itemYear < 2000;
          default:
            return true;
        }
      });
    }

    setFilteredResults(filtered);
  };

  const clearFilters = () => {
    setMediaTypeFilter('all');
    setYearFilter('all');
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
              className={`cursor-pointer text-white border-yellow-400 hover:bg-yellow-400 hover:text-black ${
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }`}
            />
          </PaginationItem>
          
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={page === currentPage}
                className={`cursor-pointer ${
                  page === currentPage 
                    ? 'bg-yellow-400 text-black border-yellow-400' 
                    : 'text-white border-yellow-400 hover:bg-yellow-400 hover:text-black'
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className={`cursor-pointer text-white border-yellow-400 hover:bg-yellow-400 hover:text-black ${
                currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
              }`}
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
        <h1 className="text-3xl font-bold text-white mb-6">
          Search Results for "{query}"
        </h1>
        
        {loading ? (
          <div className="text-white text-center py-8">Loading...</div>
        ) : (
          <>
            {/* Filter Section */}
            {results.length > 0 && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <label className="text-white text-sm">Type:</label>
                    <Select value={mediaTypeFilter} onValueChange={setMediaTypeFilter}>
                      <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all" className="text-white">All</SelectItem>
                        <SelectItem value="movie" className="text-white">Movies</SelectItem>
                        <SelectItem value="tv" className="text-white">TV Shows</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-white text-sm">Year:</label>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all" className="text-white">All</SelectItem>
                        <SelectItem value="2020s" className="text-white">2020s</SelectItem>
                        <SelectItem value="2010s" className="text-white">2010s</SelectItem>
                        <SelectItem value="2000s" className="text-white">2000s</SelectItem>
                        <SelectItem value="1990s" className="text-white">1990s</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(mediaTypeFilter !== 'all' || yearFilter !== 'all') && (
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                      className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                {filteredResults.length} Results Found
                {(mediaTypeFilter !== 'all' || yearFilter !== 'all') && ' (filtered)'}
              </h2>
            </div>
            
            {filteredResults.length > 0 && (
              <MovieGrid 
                movies={filteredResults.map(item => ({
                  ...item,
                  media_type: item.media_type || 'movie'
                }))} 
                type="movie" 
              />
            )}
            
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </main>
    </div>
  );
};

export default Search;
