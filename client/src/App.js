// @ts-nocheck
import './App.css';

import Navigation from './components/Navigation';


import Profile from './components/Profile';
import SearchMovies from './components/SearchMovies';

import {
  Routes,
  Route
} from "react-router-dom";
import Home from './components/Home';

function App() {
  return (
    <div className="app">
      <Navigation />
      <header className="app-header">
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watchlist" element={<SearchMovies />} />
            <Route path="/library" element={<Home />} />
            <Route path="/user" element={<Profile />} />
            <Route path="*" element={<Home />} />

          </Routes>
        </div>
      </header>
    </div>
  );
}

export default App;
