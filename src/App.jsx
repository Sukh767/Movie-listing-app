import { useEffect, useState } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';

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

    } catch (error) {
      console.log("Error fetching movies:", error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouceedSearchTerm);
  },[debouceedSearchTerm])  //useEffect will run when the component mounts and when searchTerm changes
  
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/src/assets/hero.png" alt="Hero Banner" />
            <h1>Find <span className="text-gradient">Movies</span>You'll Enjoy Without the Hassle</h1>
            
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>
          
          <section className='all-movies'>
            <h2 className='mt-[40px]'>All Movies</h2>
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