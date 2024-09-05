import { useState } from "react";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { WatchedSummary } from "./componants/WatchedSummary";
import { WatchedMoviesList } from "./componants/WatchedMoviesList";
import { MovieList } from "./componants/MovieList";
import { Box } from "./componants/Box";
import { Main } from "./componants/Main";
import { NumResults } from "./componants/NumResults";
import { Search } from "./componants/Search";
import { NavBar } from "./componants/NavBar";
import { MovieDetails } from "./componants/MovieDetails";
import { ErrorMessage } from "./componants/ErrorMessage";
import { Loader } from "./componants/Loader";


export const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export const key = "e8f4ad65"

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null)

  const { movies, isLoading, error } = useMovies(query)
  const [watched, setWatched] = useLocalStorageState([], key)



  function handleSelectMovie(id) {
    setSelectedId(selected => selected === id ? null : id)
  }
  function handleCloseMovie() {
    setSelectedId(null)
  }
  function handleAddWatch(movie) {
    setWatched(watched => [...watched, movie])
  }
  function handleDeleteWatched(id) {

    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box >
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {
            selectedId ?
              <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatch={handleAddWatch} watched={watched} /> :
              <>
                <WatchedSummary watched={watched} />
                <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
              </>
          }
        </Box>
      </Main>
    </>
  );
}

