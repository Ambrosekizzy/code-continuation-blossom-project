
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Plus, Play, Download, Minus } from 'lucide-react';
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
  name: string;
  overview: string;
  poster_path: string;
}

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  vote_average: number;
  air_date: string;
  runtime: number;
}

interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

const TVDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  const { toast } = useToast();
  const [tvDetails, setTVDetails] = useState<TVDetails | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [loading, setLoading] = useState(true);

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

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

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!id || !selectedSeason) return;
      
      try {
        const episodesResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${TMDB_API_KEY}&language=en-US`);
        const episodesData = await episodesResponse.json();
        setEpisodes(episodesData.episodes || []);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    };

    fetchEpisodes();
  }, [id, selectedSeason]);

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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="w-full">
        {/* Hero Section with Backdrop */}
        <div className="relative w-full h-[60vh]">
          <img
            src={`https://image.tmdb.org/t/p/w1280${tvDetails.backdrop_path}`}
            alt={tvDetails.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        </div>
        
        {/* TV Show Details */}
        <div className="bg-gray-900 p-6 -mt-32 relative z-10">
          <div className="container mx-auto">
            <div className="flex flex-col gap-6">
              {/* Details */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">{tvDetails.name}</h1>
                
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

                <div className="flex flex-wrap gap-2 mb-6">
                  {tvDetails.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mb-6">
                  <Link
                    to={`/tv/watch/${tvDetails.id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded font-semibold transition-colors whitespace-nowrap"
                  >
                    <Play className="w-4 h-4" />
                    Watch Now
                  </Link>

                  {user && (
                    <button
                      onClick={handleAddToList}
                      className={`flex items-center gap-2 px-4 py-2 rounded transition-colors whitespace-nowrap ${
                        isInMyList(tvDetails.id, 'tv')
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      {isInMyList(tvDetails.id, 'tv') ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>
                        {isInMyList(tvDetails.id, 'tv') ? '- In My List' : '+ Add to List'}
                      </span>
                    </button>
                  )}
                  
                  <TrailerDialog 
                    movieId={tvDetails.id} 
                    movieTitle={tvDetails.name}
                    mediaType="tv"
                  />
                </div>

                <p className="text-gray-300 leading-relaxed text-lg mb-8">{tvDetails.overview}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Season & Episode Navigation */}
        <div className="bg-gray-800 p-6">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Episodes</h2>
            
            {/* Season Selection */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">Season</label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 outline-none"
              >
                {Array.from({ length: tvDetails.number_of_seasons || 1 }, (_, i) => i + 1).map(season => (
                  <option key={season} value={season}>Season {season}</option>
                ))}
              </select>
            </div>

            {/* Episodes List */}
            <div className="grid gap-4">
              {episodes.map(episode => (
                <div key={episode.id} className="bg-gray-700 rounded-lg p-4 flex gap-4">
                  {/* Episode Image */}
                  <div className="flex-shrink-0">
                    {episode.still_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                        alt={episode.name}
                        className="w-40 h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-40 h-24 bg-gray-600 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Episode Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold">
                          {episode.episode_number}. {episode.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          {episode.runtime && <span>{episode.runtime}min</span>}
                          {episode.vote_average > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span>{episode.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                          {episode.air_date && <span>{new Date(episode.air_date).getFullYear()}</span>}
                        </div>
                      </div>
                      
                      {/* Episode Actions */}
                      <div className="flex gap-2">
                        <Link
                          to={`/tv/watch/${tvDetails.id}?season=${selectedSeason}&episode=${episode.episode_number}`}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded text-sm font-medium transition-colors whitespace-nowrap"
                        >
                          <Play className="w-3 h-3" />
                          Watch
                        </Link>
                        <button
                          onClick={() => window.open(`https://dl.vidsrc.vip/tv/${tvDetails.id}/${selectedSeason}/${episode.episode_number}`, '_blank')}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors whitespace-nowrap"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    </div>
                    
                    {episode.overview && (
                      <p className="text-gray-300 text-sm line-clamp-2">{episode.overview}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {actors.length > 0 && (
          <div className="bg-gray-800 p-6">
            <div className="container mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {actors.map(actor => (
                  <Link 
                    key={actor.id} 
                    to={`/actor/${actor.id}`}
                    className="text-center hover:bg-gray-700 p-2 rounded transition-colors"
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

export default TVDetails;
