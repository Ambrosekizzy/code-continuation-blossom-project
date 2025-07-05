
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import Header from '../components/Header';

interface MovieDetails {
  id: number;
  title: string;
}

const MovieWatch = () => {
  const { id } = useParams<{ id: string }>();
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState(() => {
    return localStorage.getItem('selectedServer') || 'autoembed';
  });

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  const servers = [
    { id: 'autoembed', name: 'AutoEmbed', url: `https://autoembed.pro/movie/${id}` },
    { id: 'vidfast', name: 'VidFast', url: `https://vidfast.pro/movie/${id}` },
    { id: 'videasy', name: 'Videasy', url: `https://player.videasy.net/movie/${id}` }
  ];

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
        const movieData = await movieResponse.json();
        setMovieDetails(movieData);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id]);

  const handleServerChange = (serverId: string) => {
    setSelectedServer(serverId);
    localStorage.setItem('selectedServer', serverId);
  };

  const handleDownload = () => {
    window.open(`https://dl.vidsrc.vip/movie/${id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Movie not found</div>
        </div>
      </div>
    );
  }

  const currentServer = servers.find(server => server.id === selectedServer);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="w-full">
        {/* Video Player */}
        <div className="w-full h-[50vh]">
          <iframe
            src={currentServer?.url}
            className="w-full h-full border-0"
            allowFullScreen
            title="Movie Player"
          />
        </div>
        
        {/* Controls */}
        <div className="bg-gray-800 p-4">
          <div className="container mx-auto">
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-400 text-sm text-center font-bold">
                If a server doesn't work, switch to another
              </p>

              {/* Server Selection */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <span className="text-white text-sm font-medium">Server:</span>
                <div className="flex gap-2">
                  {servers.map(server => (
                    <button
                      key={server.id}
                      onClick={() => handleServerChange(server.id)}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        selectedServer === server.id
                          ? 'bg-yellow-400 text-black'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {server.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieWatch;
