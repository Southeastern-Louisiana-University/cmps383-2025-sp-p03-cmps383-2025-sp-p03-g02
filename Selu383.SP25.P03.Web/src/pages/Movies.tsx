import "../styles/Movies.css";
import { useState } from "react";

interface Movie {
  id: number;
  title: string;
  time: string;
  imageUrl: string;
  description: string; 
}

const movies: Movie[] = [
  { 
    id: 1, 
    title: "The Dark Knight", 
    time: "7:30 PM", 
    imageUrl: "https://383g02p03theaterlionsden.neocities.org/movie/Dark-Knight-70822-scaled.jpg",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
  },
  { 
    id: 2, 
    title: "Inception", 
    time: "8:00 PM", 
    imageUrl: "https://383g02p03theaterlionsden.neocities.org/movie/inception_2010_imax_original_film_art_5000x.jpg",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
  },
  { 
    id: 3, 
    title: "Interstellar", 
    time: "6:45 PM", 
    imageUrl: "https://383g02p03theaterlionsden.neocities.org/movie/hari-krish-interstellar-filter-2.jpg",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival and find a new home for mankind."
  },
  { 
    id: 4, 
    title: "Novocaine", 
    time: "10:45 PM", 
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjM0MmU3MGUtNDhlNS00NjM3LWI5ODktMTNjZThjNDM3YTA4XkEyXkFqcGc@._V1_.jpg",
    description: "A dentist's ordinary life is complicated by high-maintenance patients, a brother with a criminal record, and a mysterious patient who steals his prescription pad."
  },
];

const Movies = () => {
  const [message, setMessage] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [hoveredMovieId, setHoveredMovieId] = useState<number | null>(null);

  const handleButtonClick = (action: string, title: string) => {
    setMessage(`${action} for "${title}" `);
    setShowMessage(true);
    
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className="movies-container">
      <h1 className="movies-title">Now Playing</h1>
      
      {showMessage && (
        <div className="message-popup">
          {message}
        </div>
      )}
      
      <div className="movies-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img 
              src={movie.imageUrl} 
              alt={movie.title} 
              className="movie-image" 
            />
            <h2>{movie.title}</h2>
            <p className="movie-time">{movie.time}</p>
            <div className="movie-actions">
              <button 
                className="buy-tickets-btn"
                onClick={() => handleButtonClick("Buying tickets", movie.title)}
              >
                Buy Tickets
              </button>
              <button 
                className="description-btn"
                onMouseEnter={() => setHoveredMovieId(movie.id)}
                onMouseLeave={() => setHoveredMovieId(null)}
                onClick={() => handleButtonClick("Viewing description", movie.title)}
              >
                Description
                {hoveredMovieId === movie.id && (
                  <div className="description-popup">
                    {movie.description}
                  </div>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;