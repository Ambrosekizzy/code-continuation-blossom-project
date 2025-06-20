
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

interface TVDetails {
  id: number;
  name: string;
  seasons: Season[];
  number_of_seasons: number;
}

interface Season {
  season_number: number;
  episode_count: number;
}

const TVWatch = () => {
  const { id } = useParams<{ id: string }>();
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [tvDetails, setTVDetails] = useState<TVDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  useEffect(() => {
    const fetchTVDetails = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
        const data = await response.json();
        setTVDetails(data);
      } catch (error) {
        console.error('Error fetching TV details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTVDetails();
    }
  }, [id]);

  const handleSeasonChange = (season: number) => {
    setCurrentSeason(season);
    setCurrentEpisode(1);
  };

  const getEpisodeCount = (seasonNumber: number) => {
    const season = tvDetails?.seasons?.find(s => s.season_number === seasonNumber);
    return season?.episode_count || 10;
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="w-full">
        <div className="w-full">
          <iframe
            src={`https://autoembed.pro/tv/${id}/${currentSeason}/${currentEpisode}`}
            className="w-full h-[50vh] border-0"
            allowFullScreen
            title="TV Show Player"
          />
        </div>
        
        {/* Season/Episode Navigation */}
        <div className="bg-gray-800 p-4">
          <div className="container mx-auto">
            <h2 className="text-white text-xl font-bold mb-4">
              {tvDetails?.name} - Season {currentSeason}, Episode {currentEpisode}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Season Selection */}
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">Season</label>
                <select
                  value={currentSeason}
                  onChange={(e) => handleSeasonChange(Number(e.target.value))}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 outline-none"
                >
                  {Array.from({ length: tvDetails?.number_of_seasons || 1 }, (_, i) => i + 1).map(season => (
                    <option key={season} value={season}>Season {season}</option>
                  ))}
                </select>
              </div>

              {/* Episode Selection */}
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
            <div className="flex gap-2 mt-4 flex-wrap">
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
      </main>
    </div>
  );
};

export default TVWatch;
