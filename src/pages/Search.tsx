
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';

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
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  useEffect(() => {
    if (query) {
      searchContent(currentPage);
    }
  }, [query, currentPage]);

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
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                {results.length} Results Found
              </h2>
            </div>
            
            {results.length > 0 && (
              <MovieGrid 
                movies={results.map(item => ({
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
