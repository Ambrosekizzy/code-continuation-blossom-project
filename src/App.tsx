
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import Index from './pages/Index';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import MovieDetails from './pages/MovieDetails';
import TVDetails from './pages/TVDetails';
import MovieWatch from './pages/MovieWatch';
import TVWatch from './pages/TVWatch';
import Filters from './pages/Filters';
import Search from './pages/Search';
import Auth from './pages/Auth';
import MyList from './pages/MyList';
import Profile from './pages/Profile';
import ActorDetails from './pages/ActorDetails';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TVShows />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TVDetails />} />
            <Route path="/movie/watch/:id" element={<MovieWatch />} />
            <Route path="/tv/watch/:id" element={<TVWatch />} />
            <Route path="/filters" element={<Filters />} />
            <Route path="/search" element={<Search />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/actor/:id" element={<ActorDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
