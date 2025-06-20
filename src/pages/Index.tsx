
import React from 'react';
import Header from '../components/Header';
import Slider from '../components/Slider';
import TrendingSection from '../components/TrendingSection';
import MovieGrid from '../components/MovieGrid';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 w-full">
      <Header />
      <main className="w-full">
        <Slider />
        <div className="w-full px-4">
          <TrendingSection />
          
          <div className="flex justify-between items-center my-6">
            <h2 className="text-3xl font-bold text-white">Latest Movies</h2>
            <Link to="/movies" className="bg-gray-300 text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-400 transition-colors">
              See More
            </Link>
          </div>
          <MovieGrid movies={[]} type="movie" />

          <div className="flex justify-between items-center my-6">
            <h2 className="text-3xl font-bold text-white">Latest TV Shows</h2>
            <Link to="/tv" className="bg-gray-300 text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-400 transition-colors">
              See More
            </Link>
          </div>
          <MovieGrid movies={[]} type="tv" />
        </div>
      </main>
    </div>
  );
};

export default Index;
