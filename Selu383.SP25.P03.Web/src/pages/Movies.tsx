import "../styles/Movies.css"; 

const movies = [
    { id: 1, title: "The Dark Knight", time: "7:30 PM" },
    { id: 2, title: "Inception", time: "8:00 PM" },
    { id: 3, title: "Interstellar", time: "6:45 PM" }
];

const Movies = () => {
    return (
        <div className="movies-container">
            <h1 className="movies-title">Now Playing</h1>
            <div className="movies-list">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-item">
                        <h2>{movie.title}</h2>
                        <p className="movie-time">{movie.time}</p>
                        <button className="buy-tickets-btn">Buy Tickets</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Movies;
