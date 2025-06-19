
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '../components/ui/button';

interface Season {
  season_number: number;
  episode_count: number;
}

interface TVDetails {
  id: number;
  name: string;
  seasons: Season[];
  number_of_seasons: number;
}

const TVWatch = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [tvDetails, setTVDetails] = useState<TVDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  useEffect(() => {
    fetchTVDetails();
  }, [id]);

  const fetchTVDetails = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
      const data: TVDetails = await response.json();
      setTVDetails(data);
    } catch (error) {
      console.error('Error fetching TV details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSeason = () => {
    return tvDetails?.seasons.find(season => season.season_number === selectedSeason);
  };

  const renderSeasonButtons = () => {
    if (!tvDetails) return null;

    return tvDetails.seasons
      .filter(season => season.season_number > 0)
      .map(season => (
        <Button
          key={season.season_number}
          variant={selectedSeason === season.season_number ? "default" : "outline"}
          onClick={() => {
            setSelectedSeason(season.season_number);
            setSelectedEpisode(1);
          }}
          className="mr-2 mb-2"
        >
          Season {season.season_number}
        </Button>
      ));
  };

  const renderEpisodeButtons = () => {
    const currentSeason = getCurrentSeason();
    if (!currentSeason) return null;

    const episodes = [];
    for (let i = 1; i <= currentSeason.episode_count; i++) {
      episodes.push(
        <Button
          key={i}
          variant={selectedEpisode === i ? "default" : "outline"}
          onClick={() => setSelectedEpisode(i)}
          className="mr-2 mb-2"
          size="sm"
        >
          EP {i}
        </Button>
      );
    }
    return episodes;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-4 text-white text-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-4">
        <div className="w-full mb-6">
          <iframe
            src={`https://autoembed.pro/tv/${id}/${selectedSeason}/${selectedEpisode}`}
            className="w-full h-[50vh] rounded-lg"
            allowFullScreen
            title="TV Show Player"
          />
        </div>

        {tvDetails && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold text-white mb-4">{tvDetails.name}</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Seasons</h3>
              <div className="flex flex-wrap">
                {renderSeasonButtons()}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Season {selectedSeason} Episodes
              </h3>
              <div className="flex flex-wrap">
                {renderEpisodeButtons()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TVWatch;
