
import React from 'react';
import { Trash2 } from 'lucide-react';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
}

interface MovieGridProps {
  movies: Movie[];
  type: 'movie' | 'tv';
  onDelete?: (id: number, mediaType: string) => void;
  showDeleteButton?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, type, onDelete, showDeleteButton = false }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {movies.map((movie) => {
        const itemMediaType = movie.media_type || type;
        return (
          <div key={`${movie.id}-${itemMediaType}`} className="text-center relative group">
            <a
              href={itemMediaType === 'movie' ? `/movie/watch/${movie.id}` : `/tv/watch/${movie.id}`}
              className="block no-underline"
            >
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="w-full h-72 object-cover rounded-lg mb-2"
                />
                {showDeleteButton && onDelete && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(movie.id, itemMediaType);
                    }}
                    className="absolute bottom-2 left-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                    title="Remove from list"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="text-white font-bold text-sm mb-1">
                {movie.title || movie.name}
              </div>
              <div className="text-white text-xs">
                {itemMediaType === 'movie' ? 'Movie' : 'TV'} · {' '}
                {movie.release_date ? movie.release_date.split('-')[0] : 
                 movie.first_air_date ? movie.first_air_date.split('-')[0] : 'N/A'}
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default MovieGrid;
