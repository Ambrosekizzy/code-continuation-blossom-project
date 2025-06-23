
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Play, X } from 'lucide-react';

interface TrailerDialogProps {
  movieId: number;
  movieTitle: string;
  mediaType?: 'movie' | 'tv';
}

interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

const TrailerDialog: React.FC<TrailerDialogProps> = ({ movieId, movieTitle, mediaType = 'movie' }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const data = await response.json();
      
      // Filter for trailers and teasers from YouTube
      const trailers = data.results?.filter(
        (video: Video) => 
          video.site === 'YouTube' && 
          (video.type === 'Trailer' || video.type === 'Teaser')
      ) || [];
      
      setVideos(trailers);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && videos.length === 0) {
      fetchVideos();
    }
  }, [open]);

  const getTrailer = () => {
    // Prefer official trailers first
    const officialTrailer = videos.find(video => 
      video.name.toLowerCase().includes('official') && video.type === 'Trailer'
    );
    
    if (officialTrailer) return officialTrailer;
    
    // Then any trailer
    const anyTrailer = videos.find(video => video.type === 'Trailer');
    if (anyTrailer) return anyTrailer;
    
    // Finally any teaser
    return videos.find(video => video.type === 'Teaser');
  };

  const trailer = getTrailer();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white">
          <Play className="w-4 h-4" />
          Watch Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            {movieTitle} - Trailer
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Loading trailer...</div>
            </div>
          ) : trailer ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={trailer.name}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">No trailer available</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerDialog;
