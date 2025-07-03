import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Plus } from 'lucide-react';
import Header from '../components/Header';
import TrailerDialog from '../components/TrailerDialog';
import { useAuth } from '../contexts/AuthContext';
import { useMyList } from '../hooks/useMyList';
import { useToast } from '../hooks/use-toast';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
}

interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

const MovieWatch = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  const { toast } = useToast();
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState('autoembed');

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  const servers = [
    { id: 'autoembed', name: 'AutoEmbed', url: `https://autoembed.pro/movie/${id}` },
    { id: 'vidfast', name: 'VidFast', url: `https://vidfast.pro/movie/${id}` },
    { id: 'videasy', name: 'Videasy', url: `https://player.videasy.net/movie/${id}` }
  ];

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // Fetch movie details
        const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
        const movieData = await movieResponse.json();
        setMovieDetails(movieData);

        // Fetch cast
        const castResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`);
        const castData = await castResponse.json();
        setActors(castData.cast.slice(0, 10));
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

  const handleAddToList = async () => {
    if (!movieDetails || !user) return;

    const movieItem = {
      tmdb_id: movieDetails.id,
      media_type: 'movie' as const,
      title: movieDetails.title,
      poster_path: movieDetails.poster_path,
      backdrop_path: movieDetails.backdrop_path,
      vote_average: movieDetails.vote_average,
      release_date: movieDetails.release_date,
      genre_ids: movieDetails.genres.map(g => g.id)
    };

    if (isInMyList(movieDetails.id, 'movie')) {
      await removeFromMyList(movieDetails.id, 'movie');
      toast({
        title: "Removed from list",
        description: `${movieDetails.title} has been removed from your list.`,
      });
    } else {
      await addToMyList(movieItem);
      toast({
        title: "Added to list",
        description: `${movieDetails.title} has been added to your list.`,
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
        <div className="w-full">
          <iframe
            src={currentServer?.url}
            className="w-full h-[50vh] border-0"
            allowFullScreen
            title="Movie Player"
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
        
        {/* Movie Details */}
        <div className="bg-gray-800 p-6">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-4">{movieDetails.title}</h1>
                
                <div className="flex items-center gap-4 mb-4 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{movieDetails.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(movieDetails.release_date).getFullYear()}</span>
                  </div>
                  <span>{movieDetails.runtime} min</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {movieDetails.genres.map(genre => (
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
                        isInMyList(movieDetails.id, 'movie')
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="whitespace-nowrap">
                        {isInMyList(movieDetails.id, 'movie') ? 'In My List' : 'Add to List'}
                      </span>
                    </button>
                  )}
                  
                  <TrailerDialog 
                    movieId={movieDetails.id} 
                    movieTitle={movieDetails.title}
                    mediaType="movie"
                  />
                </div>

                <p className="text-gray-300 leading-relaxed">{movieDetails.overview}</p>
              </div>

              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                  alt={movieDetails.title}
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

export default MovieWatch;
