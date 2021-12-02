import React, { useState, useEffect } from "react";
import FilmList from "./FilmList";
import SeriesList from "./SeriesList";


export default function SearchFilmList() {


  //create the state for movies, and update that state appropriate
  const [moviesList, setMoviesList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  
  //APIKEY
  var tmdbKey = 'eeff9ca42dcc809611efdfe69f8348bc';

  //async fetch movielist
  useEffect(() => {
    const fetchMoviesList = async () => {

      const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbKey}&language=en-US&page=1`);
      const json = await res.json();
      setMoviesList(json.results);
    }; fetchMoviesList();
  }, [setMoviesList]);

  //async fetch SeriesList
  useEffect(() => {
    const fetchSeriesList = async () => {

      const res = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${tmdbKey}&language=en-US&page=1`);
      const json = await res.json();
      setSeriesList(json.results);
    }; fetchSeriesList();
  }, [setSeriesList]);

  return (
    <div>
      <h1>Movies Now Playing</h1>
      <div className="card-list d-flex flex-row flex-nowrap">

        {moviesList
          .filter(movie => movie.poster_path)
          .map(movie => (
            <FilmList movie={movie} key={movie.id} />
          ))}
      </ div >

      <h1>Series On Air</h1>
      <div className="card-list d-flex flex-row flex-nowrap">

        {seriesList
          .filter(series => series.poster_path)
          .map(series => (
            <SeriesList series={series} key={series.id} />
          ))}
      </ div >
    </div>
  )
};



