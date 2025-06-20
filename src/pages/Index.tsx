
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Slider from '../components/Slider';
import TrendingSection from '../components/TrendingSection';
import MovieGrid from '../components/MovieGrid';
import { Link } from 'react-router-dom';

const Index = () => {
  const [sliderData, setSliderData] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTvShows, setTrendingTvShows] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [latestTvShows, setLatestTvShows] = useState([]);

  const TMDB_API_KEY = '54e00466a09676df57ba51c4ca30b1a6';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch slider data
      const sliderResponse = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}`);
      const sliderData = await sliderResponse.json();
      setSliderData(sliderData.results.slice(0, 10));

      // Fetch trending movies
      const trendingMoviesResponse = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`);
      const trendingMoviesData = await trendingMoviesResponse.json();
      setTrendingMovies(trendingMoviesData.results.slice(0, 5));

      // Fetch trending TV shows
      const trendingTvResponse = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`);
      const trendingTvData = await trendingTvResponse.json();
      setTrendingTvShows(trendingTvData.results.slice(0, 5));

      // Fetch latest movies
      const latestMoviesResponse = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
      const latestMoviesData = await latestMoviesResponse.json();
      setLatestMovies(latestMoviesData.results.slice(0, 20));

      // Fetch latest TV shows
      const latestTvResponse = await fetch(`https://api.themoviedb.org/3/tv/airing_today?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
      const latestTvData = await latestTvResponse.json();
      setLatestTvShows(latestTvData.results.slice(0, 20));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 w-full">
      <Header />
      <main className="w-full">
        <Slider data={sliderData} />
        <div className="w-full px-4">
          <TrendingSection movies={trendingMovies} tvShows={trendingTvShows} />
          
          <div className="flex justify-between items-center my-6">
            <h2 className="text-3xl font-bold text-white">Latest Movies</h2>
            <Link to="/movies" className="bg-gray-300 text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-400 transition-colors">
              See More
            </Link>
          </div>
          <MovieGrid movies={latestMovies} type="movie" />

          <div className="flex justify-between items-center my-6">
            <h2 className="text-3xl font-bold text-white">Latest TV Shows</h2>
            <Link to="/tv" className="bg-gray-300 text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-400 transition-colors">
              See More
            </Link>
          </div>
          <MovieGrid movies={latestTvShows} type="tv" />
        </div>
      </main>
    </div>
  );
};

export default Index;
