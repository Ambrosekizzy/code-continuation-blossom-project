
import React, { useState, useEffect } from 'react';
import { useMyList } from '../hooks/useMyList';

interface SliderItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: string;
  genre_ids: number[];
}

interface SliderProps {
  data: SliderItem[];
}

const Slider: React.FC<SliderProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();

  const genreMap: { [key: number]: string } = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
    18: "Drama", 10751: "Family", 14: "Fantasy", 27: "Horror", 9648: "Mystery",
    878: "Science Fiction", 53: "Thriller"
  };

  const getGenreName = (id: number) => genreMap[id] || "Unknown";

  useEffect(() => {
    if (data.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  const toggleMyList = async (item: SliderItem) => {
    const itemId = `${item.id}-${item.media_type}`;
    
    if (isInMyList(item.id, item.media_type)) {
      await removeFromMyList(item.id, item.media_type);
    } else {
      await addToMyList({
        tmdb_id: item.id,
        media_type: item.media_type,
        title: item.title || item.name || '',
        poster_path: item.backdrop_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date,
        genre_ids: item.genre_ids
      });
    }
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (data.length === 0) return null;

  const currentItem = data[currentIndex];

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {data.map((item, index) => (
          <div key={`${item.id}-${index}`} className="min-w-full relative">
            <img
              src={`https://image.tmdb.org/t/p/w780${item.backdrop_path}`}
              alt={item.title || item.name}
              className="w-full h-80 md:h-[80vh] object-cover object-top"
            />
            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="text-3xl font-bold mb-3 drop-shadow-lg text-white">
                {item.title || item.name}
              </h2>
              <div className="flex items-center gap-4 mb-2 text-lg drop-shadow-lg text-white">
                <span className="font-bold">
                  {item.release_date ? item.release_date.split('-')[0] : 
                   item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A'}
                </span>
                <span>{item.media_type === 'movie' ? 'Movie' : 'TV'}</span>
                <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold border-2 border-black">
                  IMDb
                </span>
                <span>
                  <span className="text-yellow-400">★</span> {item.vote_average.toFixed(1)}
                </span>
              </div>
              <div className="text-lg mb-4 drop-shadow-lg text-white">
                {item.genre_ids.map(id => getGenreName(id)).join(', ')}
              </div>
              <div className="flex gap-3">
                <a
                  href={item.media_type === 'movie' ? `/movie/watch/${item.id}` : `/tv/watch/${item.id}`}
                  className="bg-white text-black px-5 py-3 rounded font-semibold hover:bg-gray-200 transition-colors border-2 border-black"
                >
                  ▶ Play
                </a>
                <button 
                  onClick={() => toggleMyList(item)}
                  className={`px-5 py-3 rounded font-semibold transition-colors border-2 border-black ${
                    isInMyList(item.id, item.media_type)
                      ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {isInMyList(item.id, item.media_type) ? '✓ In My List' : '+ My List'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        ←
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        →
      </button>
      
      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-yellow-500' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
