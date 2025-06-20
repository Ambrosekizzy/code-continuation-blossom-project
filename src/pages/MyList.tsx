
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import { supabase } from '@/integrations/supabase/client';

interface MyListItem {
  id: string;
  tmdb_id: number;
  media_type: string;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  added_at: string;
}

const MyList = () => {
  const { user, loading: authLoading } = useAuth();
  const [myListItems, setMyListItems] = useState<MyListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyList();
    }
  }, [user]);

  const fetchMyList = async () => {
    try {
      const { data, error } = await supabase
        .from('my_list')
        .select('*')
        .order('added_at', { ascending: false });

      if (error) {
        console.error('Error fetching my list:', error);
      } else {
        setMyListItems(data || []);
      }
    } catch (error) {
      console.error('Error fetching my list:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Convert MyListItem to the format expected by MovieGrid
  const formattedItems = myListItems.map(item => ({
    id: item.tmdb_id,
    title: item.title,
    name: item.title,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    vote_average: item.vote_average,
    release_date: item.release_date,
    first_air_date: item.release_date,
    media_type: item.media_type,
    genre_ids: item.genre_ids || []
  }));

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-6">My List</h1>
        
        {loading ? (
          <div className="text-white text-center py-8">Loading your list...</div>
        ) : myListItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-400 mb-4">Your list is empty</h2>
            <p className="text-gray-500">Start adding movies and TV shows to your list!</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                {myListItems.length} {myListItems.length === 1 ? 'Item' : 'Items'} in Your List
              </h2>
            </div>
            <MovieGrid movies={formattedItems} type="movie" />
          </>
        )}
      </main>
    </div>
  );
};

export default MyList;
