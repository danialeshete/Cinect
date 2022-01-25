import React, { useState } from "react";
import MovieCard from "../mediaContent/MovieCard";

export default function SearchMovies() {
  //states- input query, movies
  const [query, setQuery] = useState("");
  //create the state for movies, and update that state appropriate
  const [movies, setMovies] = useState([]);

  const [year, setYear] = useState();
  var tmdbKey = 'eeff9ca42dcc809611efdfe69f8348bc';

  const searchMovies = async e => {
    e.preventDefault();


    // localhost:3000/search?dune
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // use /search/multi endpoint and ignore people in response
    //https://api.themoviedb.org/3/search/multi?api_key=${tmdbKey}&language=en-US&query=${query}&page=1&include_adult=false
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&query=${query}&page=1&include_adult=false&year=${year}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <h1 className="title"> Movie Search</h1>
      <form className="form" onSubmit={searchMovies}>
        <label className="label" htmlFor="query">
          Movie Name
        </label>

        <input
          className="input"
          type="text"
          name="query"
          placeholder="i.e. Jurassic Park"
          value={query}
          pattern="^[0-9a-zA-Z][\sa-zA-Z]*"
          title="Can use upper and lower letters, and spaces but must not start with a space"
          onChange={e => setQuery(e.target.value)}
        />

        <div className="range">
          <span id="year" />
          <input
            type="range"
            min="1900"
            max="2021"
            value={year}
            onChange={e => {

              setYear(e.target.value);
              document.getElementById("year").innerHTML = e.target.value;
            }}
          />
        </div>

        <button disabled={query.length < 1} className="button" type="submit">
          Search
        </button>
      </form>
      <div className="card-list">
        {movies
          .filter(movie => movie.poster_path)
          .map(movie => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
      </div>
    </>
  );
}
