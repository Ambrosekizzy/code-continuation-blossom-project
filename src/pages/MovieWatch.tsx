
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

const MovieWatch = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="w-full">
        <div className="w-full">
          <iframe
            src={`https://autoembed.pro/movie/${id}`}
            className="w-full h-[50vh] border-0"
            allowFullScreen
            title="Movie Player"
          />
        </div>
      </main>
    </div>
  );
};

export default MovieWatch;
