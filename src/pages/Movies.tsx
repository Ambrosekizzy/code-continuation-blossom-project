
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  const fetchMovies = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&vote_count.gte=100`);
      const data: MoviesResponse = await response.json();
      setMovies(data.results.slice(0, 24));
      setTotalPages(Math.min(data.total_pages, 500));
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

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
      <main className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">All Movies</h2>
        </div>
        
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <>
            <MovieGrid movies={movies} type="movie" />
            {renderPagination()}
          </>
        )}
      </main>
    </div>
  );
};

export default Movies;
