
import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MyListItemProps {
  item: {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    media_type: string;
  };
  onDelete: (tmdbId: number, mediaType: string) => void;
}

const MyListItem: React.FC<MyListItemProps> = ({ item, onDelete }) => {
  const title = item.title || item.name || 'Untitled';
  const mediaType = item.media_type;
  
  return (
    <div className="relative group">
      <Link 
        to={mediaType === 'movie' ? `/movie/watch/${item.id}` : `/tv/watch/${item.id}`}
        className="block relative"
      >
        <img
          src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.svg'}
          alt={title}
          className="w-full h-auto rounded-lg transition-transform hover:scale-105"
          loading="lazy"
        />
        
        {/* Always visible delete button in bottom right corner */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(item.id, mediaType);
          }}
          className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg transition-colors z-10"
          title="Remove from My List"
        >
          <X className="w-4 h-4" />
        </button>
      </Link>
      
      <h3 className="text-white text-sm mt-2 text-center truncate px-1">
        {title}
      </h3>
    </div>
  );
};

export default MyListItem;
