
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import MyListItem from '../components/MyListItem';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface MyListItemType {
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
  const { toast } = useToast();
  const [myListItems, setMyListItems] = useState<MyListItemType[]>([]);
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

  const handleDelete = async (tmdbId: number, mediaType: string) => {
    try {
      const { error } = await supabase
        .from('my_list')
        .delete()
        .eq('user_id', user?.id)
        .eq('tmdb_id', tmdbId)
        .eq('media_type', mediaType);

      if (error) {
        console.error('Error removing from my list:', error);
        toast({
          title: "Error",
          description: "Failed to remove item from your list.",
          variant: "destructive",
        });
      } else {
        setMyListItems(prev => prev.filter(item => 
          !(item.tmdb_id === tmdbId && item.media_type === mediaType)
        ));
        toast({
          title: "Removed from My List",
          description: "Item has been removed from your list.",
        });
      }
    } catch (error) {
      console.error('Error removing from my list:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from your list.",
        variant: "destructive",
      });
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

  // Convert MyListItem to the format expected by MyListItem component
  const formattedItems = myListItems.map(item => ({
    id: item.tmdb_id,
    title: item.media_type === 'movie' ? item.title : undefined,
    name: item.media_type === 'tv' ? item.title : undefined,
    poster_path: item.poster_path,
    media_type: item.media_type,
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {formattedItems.map((item) => (
                <MyListItem
                  key={`${item.id}-${item.media_type}`}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MyList;
