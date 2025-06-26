
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

interface MyListItemProps {
  item: {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    media_type: string;
    genre_ids: number[];
  };
  onDelete: (tmdbId: number, mediaType: string) => void;
}

const MyListItem = ({ item, onDelete }: MyListItemProps) => {
  const title = item.title || item.name || 'Unknown Title';
  const releaseDate = item.release_date || item.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(item.id, item.media_type);
  };

  return (
    <div className="group relative">
      <Link
        to={item.media_type === 'movie' ? `/movie/watch/${item.id}` : `/tv/watch/${item.id}`}
        className="block"
      >
        <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105">
          {/* Poster Image */}
          <div className="relative aspect-[2/3]">
            {item.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )}
            
            {/* Delete button - always visible in bottom-right corner */}
            <button
              onClick={handleDelete}
              className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 transition-colors duration-200 shadow-lg z-10"
              title="Remove from My List"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Movie Info */}
          <div className="p-3">
            <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
              {title}
            </h3>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>{year}</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span>{rating}</span>
              </div>
            </div>
            <div className="mt-1">
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MyListItem;
