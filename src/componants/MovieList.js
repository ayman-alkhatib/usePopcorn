import { Movies } from "./Movies";

export function MovieList({ movies, onSelectMovie }) {
  return <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movies movie={movie} key={crypto.randomUUID()} onSelectMovie={onSelectMovie} />
    ))}
  </ul>;
}
