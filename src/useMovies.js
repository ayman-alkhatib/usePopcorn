import { useState, useEffect } from "react"

export function useMovies(query) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [movies, setMovies] = useState([])
    const key = "e8f4ad65"

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
        fetchMovies()

        return () => {
            controller.abort()
        }
    }, [query])

    return { movies, isLoading, error }
}