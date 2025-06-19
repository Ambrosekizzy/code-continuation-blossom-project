
import React from 'react';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
}

interface MovieGridProps {
  movies: Movie[];
  type: 'movie' | 'tv';
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, type }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <div key={movie.id} className="text-center">
          <a
            href={type === 'movie' ? `/movie/watch/${movie.id}` : `/tv/watch/${movie.id}`}
            className="block no-underline"
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="w-full rounded-lg mb-2"
            />
            <div className="text-white font-bold text-sm mb-1">
              {movie.title || movie.name}
            </div>
            <div className="text-white text-xs">
              {type === 'movie' ? 'Movie' : 'TV'} · {' '}
              {movie.release_date ? movie.release_date.split('-')[0] : 
               movie.first_air_date ? movie.first_air_date.split('-')[0] : 'N/A'}
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
