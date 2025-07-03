import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Plus } from 'lucide-react';
import Header from '../components/Header';
import TrailerDialog from '../components/TrailerDialog';
import { useAuth } from '../contexts/AuthContext';
import { useMyList } from '../hooks/useMyList';
import { useToast } from '../hooks/use-toast';

interface TVDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  seasons: Season[];
  number_of_seasons: number;
}

interface Season {
  season_number: number;
  episode_count: number;
}

interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

const TVWatch = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  const { toast } = useToast();
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [tvDetails, setTVDetails] = useState<TVDetails | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState('autoembed');

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  const servers = [
    { id: 'autoembed', name: 'AutoEmbed', url: `https://autoembed.pro/tv/${id}/${currentSeason}/${currentEpisode}` },
    { id: 'vidfast', name: 'VidFast', url: `https://vidfast.pro/tv/${id}/${currentSeason}/${currentEpisode}` },
    { id: 'videasy', name: 'Videasy', url: `https://player.videasy.net/tv/${id}/${currentSeason}/${currentEpisode}` }
  ];

  useEffect(() => {
    const fetchTVData = async () => {
      try {
        // Fetch TV details
        const tvResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
        const tvData = await tvResponse.json();
        setTVDetails(tvData);

        // Fetch cast
        const castResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${TMDB_API_KEY}`);
        const castData = await castResponse.json();
        setActors(castData.cast.slice(0, 10));
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

  const getEpisodeCount = (seasonNumber: number) => {
    const season = tvDetails?.seasons?.find(s => s.season_number === seasonNumber);
    return season?.episode_count || 10;
  };

  const handleAddToList = async () => {
    if (!tvDetails || !user) return;

    const tvItem = {
      tmdb_id: tvDetails.id,
      media_type: 'tv' as const,
      title: tvDetails.name,
      poster_path: tvDetails.poster_path,
      backdrop_path: tvDetails.backdrop_path,
      vote_average: tvDetails.vote_average,
      release_date: tvDetails.first_air_date,
      genre_ids: tvDetails.genres.map(g => g.id)
    };

    if (isInMyList(tvDetails.id, 'tv')) {
      await removeFromMyList(tvDetails.id, 'tv');
      toast({
        title: "Removed from list",
        description: `${tvDetails.name} has been removed from your list.`,
      });
    } else {
      await addToMyList(tvItem);
      toast({
        title: "Added to list",
        description: `${tvDetails.name} has been added to your list.`,
      });
    }
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
        <div className="w-full">
          <iframe
            src={currentServer?.url}
            className="w-full h-[50vh] border-0"
            allowFullScreen
            title="TV Show Player"
          />
        </div>
        
        {/* Server Selection */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="container mx-auto">
            <div className="flex items-center gap-4">
              <span className="text-white text-sm font-medium">Server:</span>
              <div className="flex gap-2">
                {servers.map(server => (
                  <button
                    key={server.id}
                    onClick={() => setSelectedServer(server.id)}
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
          </div>
        </div>
        
        {/* Season/Episode Navigation */}
        <div className="bg-gray-800 p-4">
          <div className="container mx-auto">
            <h2 className="text-white text-xl font-bold mb-4">
              {tvDetails.name} - Season {currentSeason}, Episode {currentEpisode}
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
                  {Array.from({ length: tvDetails.number_of_seasons || 1 }, (_, i) => i + 1).map(season => (
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

        {/* TV Show Details */}
        <div className="bg-gray-800 p-6">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-4">{tvDetails.name}</h1>
                
                <div className="flex items-center gap-4 mb-4 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{tvDetails.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(tvDetails.first_air_date).getFullYear()}</span>
                  </div>
                  <span>{tvDetails.number_of_seasons} Season{tvDetails.number_of_seasons !== 1 ? 's' : ''}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tvDetails.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mb-4">
                  {user && (
                    <button
                      onClick={handleAddToList}
                      className={`flex items-center gap-2 px-4 py-2 rounded transition-colors min-w-[140px] justify-center ${
                        isInMyList(tvDetails.id, 'tv')
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="whitespace-nowrap">
                        {isInMyList(tvDetails.id, 'tv') ? 'In My List' : 'Add to List'}
                      </span>
                    </button>
                  )}
                  
                  <TrailerDialog 
                    movieId={tvDetails.id} 
                    movieTitle={tvDetails.name}
                    mediaType="tv"
                  />
                </div>

                <p className="text-gray-300 leading-relaxed">{tvDetails.overview}</p>
              </div>

              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500${tvDetails.poster_path}`}
                  alt={tvDetails.name}
                  className="w-48 h-72 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {actors.length > 0 && (
          <div className="bg-gray-900 p-6">
            <div className="container mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {actors.map(actor => (
                  <Link 
                    key={actor.id} 
                    to={`/actor/${actor.id}`}
                    className="text-center hover:bg-gray-800 p-2 rounded transition-colors"
                  >
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                          : '/placeholder.svg'
                      }
                      alt={actor.name}
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    <h3 className="text-white font-medium text-sm">{actor.name}</h3>
                    <p className="text-gray-400 text-xs">{actor.character}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TVWatch;
