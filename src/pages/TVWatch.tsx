import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import Header from '../components/Header';

interface TVDetails {
  id: number;
  name: string;
  number_of_seasons: number;
  seasons: Season[];
}

interface Season {
  season_number: number;
  episode_count: number;
}

const TVWatch = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [currentSeason, setCurrentSeason] = useState(() => {
    return Number(searchParams.get('season')) || 1;
  });
  const [currentEpisode, setCurrentEpisode] = useState(() => {
    return Number(searchParams.get('episode')) || 1;
  });
  const [tvDetails, setTVDetails] = useState<TVDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState(() => {
    return localStorage.getItem('selectedServer') || 'autoembed';
  });

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  const servers = [
    { id: 'autoembed', name: 'AutoEmbed', url: `https://autoembed.pro/tv/${id}/${currentSeason}/${currentEpisode}` },
    { id: 'vidfast', name: 'VidFast', url: `https://vidfast.pro/tv/${id}/${currentSeason}/${currentEpisode}` },
    { id: 'videasy', name: 'Videasy', url: `https://player.videasy.net/tv/${id}/${currentSeason}/${currentEpisode}` }
  ];

  useEffect(() => {
    const fetchTVData = async () => {
      try {
        const tvResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
        const tvData = await tvResponse.json();
        setTVDetails(tvData);
      } catch (error) {
        console.error('Error fetching TV data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTVData();
    }
  }, [id]);

  const handleSeasonChange = (season: number) => {
    setCurrentSeason(season);
    setCurrentEpisode(1);
  };

  const handleServerChange = (serverId: string) => {
    setSelectedServer(serverId);
    localStorage.setItem('selectedServer', serverId);
  };

  const getEpisodeCount = (seasonNumber: number) => {
    const season = tvDetails?.seasons?.find(s => s.season_number === seasonNumber);
    return season?.episode_count || 10;
  };

  const handleDownload = () => {
    window.open(`https://dl.vidsrc.vip/tv/${id}/${currentSeason}/${currentEpisode}`, '_blank');
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

  if (!tvDetails) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-white">TV Show not found</div>
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
        <div className="w-full h-[70vh]">
          <iframe
            src={currentServer?.url}
            className="w-full h-full border-0"
            allowFullScreen
            title="TV Show Player"
          />
        </div>
        
        {/* Controls */}
        <div className="bg-gray-800 p-4">
          <div className="container mx-auto">
            <div className="flex flex-col items-center gap-4">
              {/* Episode Info */}
              <h2 className="text-white text-xl font-bold">
                {tvDetails.name} - Season {currentSeason}, Episode {currentEpisode}
              </h2>
              
              <p className="text-gray-400 text-sm text-center font-bold">
                If a server doesn't work, switch to another
              </p>

              {/* Server Selection */}
              <div className="flex items-center gap-4">
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
              
              {/* Season/Episode Selection */}
              <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                <div className="flex-1">
                  <label className="block text-white text-sm font-medium mb-2">Season</label>
                  <select
                    value={currentSeason}
                    onChange={(e) => handleSeasonChange(Number(e.target.value))}
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 outline-none"
                  >
                    {Array.from({ length: tvDetails.number_of_seasons || 1 }, (_, i) => i + 1).map(season => (
                      <option key={season} value={season}>Season {season}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-white text-sm font-medium mb-2">Episode</label>
                  <select
                    value={currentEpisode}
                    onChange={(e) => setCurrentEpisode(Number(e.target.value))}
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 outline-none"
                  >
                    {Array.from({ length: getEpisodeCount(currentSeason) }, (_, i) => i + 1).map(episode => (
                      <option key={episode} value={episode}>Episode {episode}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Episode Navigation */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => currentEpisode > 1 && setCurrentEpisode(currentEpisode - 1)}
                  disabled={currentEpisode === 1}
                  className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous Episode
                </button>
                <button
                  onClick={() => currentEpisode < getEpisodeCount(currentSeason) && setCurrentEpisode(currentEpisode + 1)}
                  disabled={currentEpisode === getEpisodeCount(currentSeason)}
                  className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Episode
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TVWatch;
