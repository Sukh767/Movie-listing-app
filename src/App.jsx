import { use, useEffect, useState } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouceedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);


  // useDebounce is a custom hook that delays the update of the searchTerm state by 500ms
  // This is useful to avoid making too many API calls while the user is typing
  // It will only update the searchTerm state after the user has stopped typing for 500ms
  useDebounce(()=> setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      console.log("Fetched movies:", data);
      if(data.Response === 'error') {
        setErrorMessage(data.error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        // Update the search count in the database
        const movie = data.results[0]; // Assuming you want to update the count for the first movie in the search results
        await updateSearchCount(query, movie);
      }

    } catch (error) {
      console.log("Error fetching movies:", error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  }

  useEffect(() => {
    fetchMovies(debouceedSearchTerm);
  },[debouceedSearchTerm])  //useEffect will run when the component mounts and when searchTerm changes

  useEffect(() => {
    loadTrendingMovies();
  },[]); 


  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/src/assets/hero.png" alt="Hero Banner" />
            <h1>Find <span className="text-gradient">Movies</span>You'll Enjoy Without the Hassle</h1>
            
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>

          {trendingMovies.length > 0 && (
            <section className='trending'>
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>              
            </section>
          )}

          
          <section className='all-movies'>
            <h2>All Movies</h2>
            {isLoading ?(<Spinner/>) : errorMessage ? (<p className='text-white'>{errorMessage}</p>) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard movie={movie} key={movie.id}/>
                ))}
              </ul>
            )}  
          </section>
        </div>
      </div>
    </main>
  )
}

export default App