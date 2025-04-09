import "../styles/Movies.css";
import { useState, useEffect } from "react";

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  category: string; 
}

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [message, setMessage] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [hoveredMovieId, setHoveredMovieId] = useState<number | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    fetch("/api/movie")
      .then((response) => response.json())
      .then((data: Movie[]) => {
        setMovies(data);
        const uniqueCategories = Array.from(new Set(data.map((movie) => movie.category)));
        setCategories(["All", ...uniqueCategories]);
      })
      .catch(() => {
        setMessage("Failed to fetch movies.");
        setShowMessage(true);
      });
  };

  const handleButtonClick = (action: string, title: string) => {
    setMessage(`${action} for "${title}"`);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const filteredMovies = selectedCategory === "All" ? movies : movies.filter((movie) => movie.category === selectedCategory);

  return (
    <div className="movies-container">
      <h1 className="movies-title">Now Playing</h1>

      {showMessage && <div className="message-popup">{message}</div>}

      {/* Tabs for categories */}
      <div className="movies-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`movies-tab ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="movies-list">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img src={movie.imageUrl} alt={movie.title} className="movie-image" />
            <h2>{movie.title}</h2>
            <div className="movie-actions">
              <button className="buy-tickets-btn" onClick={() => handleButtonClick("Buying tickets", movie.title)}>
                Buy Tickets
              </button>
              <button
                className="description-btn"
                onMouseEnter={() => setHoveredMovieId(movie.id)}
                onMouseLeave={() => setHoveredMovieId(null)}
                onClick={() => handleButtonClick("Viewing description", movie.title)}
              >
                Description
                {hoveredMovieId === movie.id && <div className="description-popup">{movie.description}</div>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;