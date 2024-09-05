import { WatchedMovies } from "./WatchedMovies";

export function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (<ul className="list">
    {watched.map((movie) => (
      <WatchedMovies movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
    ))}
  </ul>);
}
