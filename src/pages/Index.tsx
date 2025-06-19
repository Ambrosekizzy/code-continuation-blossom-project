
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Slider from '../components/Slider';
import TrendingSection from '../components/TrendingSection';
import MovieGrid from '../components/MovieGrid';

const Index = () => {
  const [sliderData, setSliderData] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [latestTV, setLatestTV] = useState([]);

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  useEffect(() => {
    fetchSliderData();
    fetchTrendingData();
    fetchLatestData();
  }, []);

  const fetchSliderData = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      setSliderData(data.results.slice(0, 10));
    } catch (error) {
      console.error('Error fetching slider data:', error);
    }
  };

  const fetchTrendingData = async () => {
    try {
      const [moviesRes, tvRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`),
        fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`)
      ]);
      
      const moviesData = await moviesRes.json();
      const tvData = await tvRes.json();
      
      setTrendingMovies(moviesData.results.slice(0, 5));
      setTrendingTV(tvData.results.slice(0, 5));
    } catch (error) {
      console.error('Error fetching trending data:', error);
    }
  };

  const fetchLatestData = async () => {
    try {
      const [moviesRes, tvRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
        fetch(`https://api.themoviedb.org/3/tv/airing_today?api_key=${TMDB_API_KEY}&language=en-US&page=1`)
      ]);
      
      const moviesData = await moviesRes.json();
      const tvData = await tvRes.json();
      
      setLatestMovies(moviesData.results.slice(0, 20));
      setLatestTV(tvData.results.slice(0, 20));
    } catch (error) {
      console.error('Error fetching latest data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Slider data={sliderData} />
      <TrendingSection movies={trendingMovies} tvShows={trendingTV} />
      
      <div className="px-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">Latest Movies</h2>
          <a href="/movies?page=1" className="bg-gray-300 text-black px-3 py-1.5 rounded-full text-sm font-bold hover:bg-gray-400 transition-colors">
            See More
          </a>
        </div>
        <MovieGrid movies={latestMovies} type="movie" />
      </div>

      <div className="px-5 mt-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">Latest TV Shows</h2>
          <a href="/tv?page=1" className="bg-gray-300 text-black px-3 py-1.5 rounded-full text-sm font-bold hover:bg-gray-400 transition-colors">
            See More
          </a>
        </div>
        <MovieGrid movies={latestTV} type="tv" />
      </div>
    </div>
  );
};

export default Index;
