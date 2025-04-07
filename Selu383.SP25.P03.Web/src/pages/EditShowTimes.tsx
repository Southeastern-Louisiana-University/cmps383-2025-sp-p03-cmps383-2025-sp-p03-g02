import React, { useState, useEffect } from "react";
import "../styles/EditShowtimes.css";

interface ShowtimeDto {
  id?: number;
  movieId: number;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  theaterId: number;
}

interface MovieDto {
  id: number;
  title: string;
}

interface TheaterDto {
  id: number;
  name: string;
}

export function AddShowTimeForm() {
  const [showtimes, setShowtimes] = useState<ShowtimeDto[]>([]);
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [theaters, setTheaters] = useState<TheaterDto[]>([]);
  const [movieId, setMovieId] = useState<number | "">("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [ticketPrice, setTicketPrice] = useState<number | "">("");
  const [theaterId, setTheaterId] = useState<number | "">("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState("add");
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeDto | null>(null);

  useEffect(() => {
    fetchMovies();
    fetchTheaters();
    fetchShowtimes();
  }, []);

  const fetchMovies = () => {
    fetch("api/movie") 
      .then((response) => response.json())
      .then((data: MovieDto[]) => setMovies(data))
      .catch(() => setFormError("Failed to fetch movies"));
  };

  const fetchTheaters = () => {
    fetch("api/theaters") 
      .then((response) => response.json())
      .then((data: TheaterDto[]) => setTheaters(data))
      .catch(() => setFormError("Failed to fetch theaters"));
  };

  const fetchShowtimes = () => {
    fetch("api/showtimes") 
      .then((response) => response.json())
      .then((data: ShowtimeDto[]) => setShowtimes(data))
      .catch(() => setFormError("Failed to fetch showtimes"));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
  
    setFormError("");
    setLoading(true);
  
    // Combine showDate and showTime into a single ISO string
    const dateTime = `${showDate}T${showTime}`;
  
    // Log the values to check they're correct
    console.log("Movie ID:", movieId);
    console.log("Theater ID:", theaterId);
    
    const showtime = {
      movieId: movieId === "" ? 0 : Number(movieId), // Ensure ID is being sent, not title
      showDate: dateTime, // Send combined date and time as a string
      ticketPrice: ticketPrice === "" ? 0 : Number(ticketPrice),
      theaterId: theaterId === "" ? 0 : Number(theaterId), // Ensure ID is being sent, not name
    };
  
    if (operation === "add") {
      fetch("api/showtimes", { 
        method: "POST",
        body: JSON.stringify(showtime),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          setShowtimes([...showtimes, data]);
          resetForm();
        })
        .catch(() => setFormError("Failed to add showtime"))
        .finally(() => setLoading(false));
    } else if (operation === "edit" && selectedShowtime?.id) {
      fetch(`api/showtimes/${selectedShowtime.id}`, { 
        method: "PUT",
        body: JSON.stringify({ ...showtime, id: selectedShowtime.id }),
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          const updatedShowtimes = showtimes.map((item) =>
            item.id === selectedShowtime.id ? { ...selectedShowtime, ...showtime } : item
          );
          setShowtimes(updatedShowtimes);
          resetForm();
        })
        .catch(() => setFormError("Failed to update showtime"))
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = (id: number) => {
    fetch(`api/showtimes/${id}`, { 
      method: "DELETE",
    })
      .then(() => {
        setShowtimes(showtimes.filter((item) => item.id !== id));
      })
      .catch(() => setFormError("Failed to delete showtime"));
  };

  const resetForm = () => {
    setMovieId("");
    setShowDate("");
    setShowTime("");
    setTicketPrice("");
    setTheaterId("");
    setSelectedShowtime(null);
    setOperation("add");
  };

  return (
    <div className="showtime-menu">
      <h1>Manage Showtimes</h1>
      <form className="form-example" onSubmit={handleFormSubmit}>
        <div className="form-example">
          <label htmlFor="operation">Select Operation: </label>
          <select
            name="operation"
            id="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
          >
            <option value="add">Add Showtime</option>
            <option value="edit">Edit Showtime</option>
            <option value="delete">Delete Showtime</option>
          </select>
        </div>

        <div className="form-example">
          <label htmlFor="movieId">Movie: </label>
          <select
            name="movieId"
            id="movieId"
            required
            value={movieId}
            onChange={(e) =>
              setMovieId(e.target.value ? Number(e.target.value) : "") // Convert to number or empty string
            }
          >
            <option value="">Select Movie</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-example">
          <label htmlFor="showDate">Show Date: </label>
          <input
            type="date"
            name="showDate"
            id="showDate"
            required
            value={showDate}
            onChange={(e) => setShowDate(e.target.value)}
          />
        </div>

        <div className="form-example">
          <label htmlFor="showTime">Show Time: </label>
          <input
            type="time"
            name="showTime"
            id="showTime"
            required
            value={showTime}
            onChange={(e) => setShowTime(e.target.value)}
          />
        </div>

        <div className="form-example">
          <label htmlFor="ticketPrice">Ticket Price: </label>
          <input
            type="number"
            name="ticketPrice"
            id="ticketPrice"
            required
            value={ticketPrice}
            onChange={(e) =>
              setTicketPrice(e.target.value ? Number(e.target.value) : "") // Convert to number or empty string
            }
          />
        </div>

        <div className="form-example">
          <label htmlFor="theaterId">Theater: </label>
          <select
            name="theaterId"
            id="theaterId"
            required
            value={theaterId}
            onChange={(e) =>
              setTheaterId(e.target.value ? Number(e.target.value) : "") 
            }
          >
            <option value="">Select Theater</option>
            {theaters.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>

        {formError ? <p style={{ color: "red" }}>{formError}</p> : null}

        <div className="form-example">
          <input
            type="submit"
            value={loading ? "Loading..." : operation === "add" ? "Add Showtime" : "Update Showtime"}
            disabled={loading}
          />
        </div>
      </form>

      <h2>Showtimes List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Movie Title</th>
            <th>Show Date</th>
            <th>Show Time</th>
            <th>Ticket Price</th>
            <th>Theater Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {showtimes.map((showtime) => {
            const movie = movies.find((m) => m.id === showtime.movieId);
            const theater = theaters.find((t) => t.id === showtime.theaterId);
            return (
              <tr key={showtime.id}>
                <td>{showtime.id}</td>
                <td>{movie?.title}</td>
                <td>{showtime.showDate}</td>
                <td>{showtime.showTime}</td>
                <td>${showtime.ticketPrice.toFixed(2)}</td>
                <td>{theater?.name}</td>
                <td>
                  <button
                    onClick={() => {
                      setOperation("edit");
                      setSelectedShowtime(showtime);
                      setMovieId(showtime.movieId || "");
                      setShowDate(showtime.showDate);
                      setShowTime(showtime.showTime);
                      setTicketPrice(showtime.ticketPrice || "");
                      setTheaterId(showtime.theaterId || "");
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => showtime.id && handleDelete(showtime.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
