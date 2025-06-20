
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface MyListItem {
  tmdb_id: number;
  media_type: string;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
}

export const useMyList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myListIds, setMyListIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyListIds();
    } else {
      setMyListIds(new Set());
      setLoading(false);
    }
  }, [user]);

  const fetchMyListIds = async () => {
    try {
      const { data, error } = await supabase
        .from('my_list')
        .select('tmdb_id, media_type');

      if (error) {
        console.error('Error fetching my list:', error);
      } else {
        const ids = new Set(data?.map(item => `${item.tmdb_id}-${item.media_type}`) || []);
        setMyListIds(ids);
      }
    } catch (error) {
      console.error('Error fetching my list:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToMyList = async (item: MyListItem) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your list.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('my_list')
        .insert({
          user_id: user.id,
          tmdb_id: item.tmdb_id,
          media_type: item.media_type,
          title: item.title,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          vote_average: item.vote_average,
          release_date: item.release_date,
          genre_ids: item.genre_ids || []
        });

      if (error) {
        console.error('Error adding to my list:', error);
        toast({
          title: "Error",
          description: "Failed to add item to your list.",
          variant: "destructive",
        });
      } else {
        setMyListIds(prev => new Set([...prev, `${item.tmdb_id}-${item.media_type}`]));
        toast({
          title: "Added to My List",
          description: `${item.title} has been added to your list.`,
        });
      }
    } catch (error) {
      console.error('Error adding to my list:', error);
      toast({
        title: "Error",
        description: "Failed to add item to your list.",
        variant: "destructive",
      });
    }
  };

  const removeFromMyList = async (tmdbId: number, mediaType: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('my_list')
        .delete()
        .eq('user_id', user.id)
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
        setMyListIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(`${tmdbId}-${mediaType}`);
          return newSet;
        });
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

  const isInMyList = (tmdbId: number, mediaType: string) => {
    return myListIds.has(`${tmdbId}-${mediaType}`);
  };

  return {
    addToMyList,
    removeFromMyList,
    isInMyList,
    loading
  };
};
