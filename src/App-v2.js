import { useEffect, useState } from "react";
import StarRating from "./StarRating"



const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedId, setSelectedId] = useState(null)

  const key = "e8f4ad65"

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




  useEffect(() => {
    const controller = new AbortController()
    async function fetchMovies(params) {
      try {
        setError("")
        setIsLoading(true)
        const res = await fetch(`http://www.omdbapi.com/?apikey=${key}&s=${query}&plot=full`, { signal: controller.signal })
        if (!res.ok)
          throw new Error("something went wrong with featching movies")
        const data = await res.json()

        if (data.Response === "False")
          throw new Error(`${query} Movies not found`)
        setMovies(data.Search)
      } catch (err) {
        if (err !== "") {
          console.log(err.message)
          setError(err.message)
        }
      } finally {
        setIsLoading(false)

      }
    }
    if (query.length < 3) {
      setMovies([])
      setError("")
      return
    }
    handleCloseMovie()
    fetchMovies()

    return () => {
      controller.abort()
    }
  }, [query])

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
              <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} setError={setError} onAddWatch={handleAddWatch} watched={watched} /> :
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
function ErrorMessage({ message }) {
  return <p className="error">{message}</p>
}

function Loader() {
  return (
    <p className="loader">loading...</p>
  )
}
function MovieDetails({ selectedId, onCloseMovie, setError, onAddWatch, watched }) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)
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
    }

    onAddWatch(newWatchedMovie)
    onCloseMovie()
  }
  useEffect(() => {

    function callbackfn(e) {
      if (e.code === "Escape") {
        onCloseMovie()
      }
    }

    document.addEventListener("keydown", callbackfn)

    return () => {
      document.removeEventListener("keydown", callbackfn)
    }

  }, [onCloseMovie])




  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true)
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?apikey=e8f4ad65&i=${selectedId}`)
        if (!res.ok)
          throw new Error("something went wrong with featching movie details")
        const data = await res.json()
        if (data.Response === "False")
          throw new Error(` Movie details not found`)
        setMovie(data)
        setIsLoading(false)
      } catch (err) {
        console.error(err.message)
        setError(err.message)
      }
    }
    if (selectedId) {
      getMovieDetails()
    }
  }, [selectedId])

  useEffect(() => {
    if (!movie.Title) return
    document.title = `Movie | ${movie.Title}`
    return () => { document.title = "usePopcorn" }

  }, [movie])

  return (
    <div className="details" >
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


  )
}

function NavBar({ children }) {

  return <nav className="nav-bar">
    <Logo />

    {children}
  </nav>
}

function Logo() {
  return <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
}
function Search({ query, setQuery }) {

  return <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
}
function NumResults({ movies }) {
  return <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
}



function Main({ children }) {
  return <main className="main">
    {children}
  </main>
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return <div className="box">
    <Button isOpen={isOpen} onClick={() => setIsOpen((open) => !open)} />
    {isOpen && children}
  </div>

}
function Button({ isOpen, onClick }) {
  return <button
    className="btn-toggle"
    onClick={onClick}
  >
    {isOpen ? "–" : "+"}
  </button>
}
function MovieList({ movies, onSelectMovie }) {
  return <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movies movie={movie} key={crypto.randomUUID()} onSelectMovie={onSelectMovie} />
    ))}
  </ul>
}

function Movies({ movie, onSelectMovie }) {
  return (<li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>)
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (<ul className="list">
    {watched.map((movie) => (
      <WatchedMovies movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
    ))}
  </ul>)
}
function WatchedSummary({ watched }) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(2);
  const avgUserRating = average(watched.map((movie) => movie.userRating)).toFixed(2);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(2);
  return (<div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>)
}
function WatchedMovies({ movie, onDeleteWatched }) {
  return <li key={movie.imdbID}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>
      <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>X</button>
    </div>
  </li>

}