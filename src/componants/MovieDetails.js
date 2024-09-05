import { useState, useRef, useEffect } from "react";
import { key } from "./App";
import { Loader } from "./Loader";
import StarRating from "./StarRating";
import { useKey } from "./useKey";

export function MovieDetails({ selectedId, onCloseMovie, onAddWatch, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const countRef = useRef(0);
  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      runtime: Number(movie.Runtime.split(" ")[0]),
      imdbRating: movie.imdbRating,
      userRating: userRating,
      countRatingDecisions: countRef.current
    };

    onAddWatch(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);




  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    if (selectedId) {
      getMovieDetails();
    }
  }, [selectedId]);

  useEffect(() => {
    if (!movie.Title) return;
    document.title = `Movie | ${movie.Title}`;
    return () => { document.title = "usePopcorn"; };

  }, [movie]);

  return (
    <div className="details">
      {isLoading ? <Loader /> : <>
        <header>

          <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <div className="details-overview">
            <h2>{movie.Title}</h2>
            <p>
              {movie.Released} &bull; {movie.Runtime}
            </p>
            <p>
              {movie.Genre}
            </p>
            <p>
              <span>🌟</span>
              {movie.imdbRating} IMDB rating
            </p>
          </div>
        </header>
        <section>
          <div className="rating">
            {!isWatched ? <>
              <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
              {userRating > 0 && <button className="btn-add" onClick={handleAdd}>add to list</button>}
            </> : <p>you rated with movie {watchedUserRating} <span>⭐</span></p>}
          </div>
          <p><em>{movie.Plot}</em></p>
          <p>starring {movie.Actors}</p>
          <p>directed by {movie.Director}</p>
        </section>
      </>}
    </div>


  );
}
