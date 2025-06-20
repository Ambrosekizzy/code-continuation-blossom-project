
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import MovieWatch from './pages/MovieWatch';
import TVWatch from './pages/TVWatch';
import Filters from './pages/Filters';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TVShows />} />
          <Route path="/movie/watch/:id" element={<MovieWatch />} />
          <Route path="/tv/watch/:id" element={<TVWatch />} />
          <Route path="/filters" element={<Filters />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
