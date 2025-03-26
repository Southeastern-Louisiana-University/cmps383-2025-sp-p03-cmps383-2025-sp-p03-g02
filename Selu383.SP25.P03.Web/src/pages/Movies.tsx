import "../styles/Movies.css";
import { useState } from "react";

// Define the movie type
interface Movie {
  id: number;
  title: string;
  time: string;
}

// Sample movie data
const movies: Movie[] = [
  { id: 1, title: "The Dark Knight", time: "7:30 PM" },
  { id: 2, title: "Inception", time: "8:00 PM" },
  { id: 3, title: "Interstellar", time: "6:45 PM" }
];

const Movies = () => {
  const [message, setMessage] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const handleButtonClick = (action: string, title: string) => {
    setMessage(`${action} for "${title}" - It works!`);
    setShowMessage(true);
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className="movies-container">
      <h1 className="movies-title">Now Playing</h1>
      
      {/* Message popup - styling moved to CSS file */}
      {showMessage && (
        <div className="message-popup">
          {message}
        </div>
      )}
      
      <div className="movies-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <div className="movie-content">
              <h2>{movie.title}</h2>
              <p className="movie-time">{movie.time}</p>
              <button 
                className="buy-tickets-btn"
                onClick={() => handleButtonClick("Buying tickets", movie.title)}
              >
                Buy Tickets
              </button>
              <button 
                className="description-btn"
                onClick={() => handleButtonClick("Viewing description", movie.title)}
              >
                Description
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;