import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Star } from 'lucide-react';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';

interface ActorDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  profile_path: string;
  known_for_department: string;
  popularity: number;
}

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  character?: string;
  job?: string;
  popularity?: number;
}

const ActorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [actorDetails, setActorDetails] = useState<ActorDetails | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        // Fetch actor details
        const actorResponse = await fetch(
          `https://api.themoviedb.org/3/person/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const actorData = await actorResponse.json();
        setActorDetails(actorData);

        // Fetch actor's movies and TV shows
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const creditsData = await creditsResponse.json();
        
        // Sort by popularity and take top 20
        const sortedCredits = creditsData.cast
          ?.sort((a: Movie, b: Movie) => (b.popularity || 0) - (a.popularity || 0))
          ?.slice(0, 20) || [];
        
        setMovies(sortedCredits);
      } catch (error) {
        console.error('Error fetching actor data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActorData();
    }
  }, [id]);

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

  if (!actorDetails) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Actor not found</div>
        </div>
      </div>
    );
  }

  const calculateAge = (birthDate: string, deathDate?: string | null) => {
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    return age;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Actor Image */}
          <div className="flex-shrink-0">
            <img
              src={
                actorDetails.profile_path
                  ? `https://image.tmdb.org/t/p/w500${actorDetails.profile_path}`
                  : '/placeholder.svg'
              }
              alt={actorDetails.name}
              className="w-80 h-96 object-cover rounded-lg mx-auto"
            />
          </div>

          {/* Actor Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-4">{actorDetails.name}</h1>

            <div className="flex items-center gap-4 mb-4 text-gray-300">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Popularity: {actorDetails.popularity.toFixed(1)}</span>
              </div>
              
              {actorDetails.birthday && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(actorDetails.birthday).toLocaleDateString()} 
                    {actorDetails.birthday && (
                      <span className="text-gray-400 ml-1">
                        (Age {calculateAge(actorDetails.birthday, actorDetails.deathday)})
                      </span>
                    )}
                  </span>
                </div>
              )}
              
              {actorDetails.place_of_birth && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{actorDetails.place_of_birth}</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">
                {actorDetails.known_for_department}
              </span>
            </div>

            {actorDetails.deathday && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-gray-300">
                  <strong>Died:</strong> {new Date(actorDetails.deathday).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-3">Biography</h2>
              <p className="text-gray-300 leading-relaxed">
                {actorDetails.biography || 'No biography available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Known For Section */}
        {movies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Known For</h2>
            <MovieGrid movies={movies} type="movie" />
          </div>
        )}
      </main>
    </div>
  );
};

export default ActorDetails;
