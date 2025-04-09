import React, { useEffect, useState } from "react";
import "../styles/EditSeats.css";

interface SeatDto {
  id?: number;
  seatNumber: string;
  showtimeId: number;
  isBooked: boolean;
}

interface ShowtimeDto {
  id: number;
  showtimeDate: string;
  movieId: number;
}

interface MovieDto {
  id: number;
  title: string;
}

export function AddSeatForm() {
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [showtimes, setShowtimes] = useState<ShowtimeDto[]>([]);
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [seatNumber, setSeatNumber] = useState("");
  const [showtimeId, setShowtimeId] = useState<number | "">("");
  const [isBooked, setIsBooked] = useState(true);
  const [operation, setOperation] = useState("add");
  const [selectedSeat, setSelectedSeat] = useState<SeatDto | null>(null);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSeats();
    fetchShowtimes();
    fetchMovies();
  }, []);

  const fetchSeats = () => {
    fetch("api/seats")
      .then((res) => res.json())
      .then((data: SeatDto[]) => setSeats(data))
      .catch(() => setFormError("Failed to fetch seats"));
  };

  const fetchShowtimes = () => {
    fetch("api/showtimes")
      .then((res) => res.json())
      .then((data: ShowtimeDto[]) => setShowtimes(data))
      .catch(() => setFormError("Failed to fetch showtimes"));
  };

  const fetchMovies = () => {
    fetch("api/movie")
      .then((res) => res.json())
      .then((data: MovieDto[]) => setMovies(data))
      .catch(() => setFormError("Failed to fetch movies"));
  };

  const getMovieTitle = (movieId: number): string => {
    const movie = movies.find((m) => m.id === movieId);
    return movie ? movie.title : "Unknown Movie";
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setLoading(true);

    const seat: SeatDto = {
      seatNumber,
      showtimeId: showtimeId === "" ? 0 : Number(showtimeId),
      isBooked,
    };

    if (operation === "add") {
      fetch("api/seats", {
        method: "POST",
        body: JSON.stringify(seat),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setSeats([...seats, data]);
          resetForm();
        })
        .catch(() => setFormError("Failed to add seat"))
        .finally(() => setLoading(false));
    } else if (operation === "edit" && selectedSeat?.id) {
      fetch(`api/seats/${selectedSeat.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...seat, id: selectedSeat.id }),
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          const updated = seats.map((s) =>
            s.id === selectedSeat.id ? { ...selectedSeat, ...seat } : s
          );
          setSeats(updated);
          resetForm();
        })
        .catch(() => setFormError("Failed to update seat"))
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = (id: number) => {
    fetch(`api/seats/${id}`, { method: "DELETE" })
      .then(() => {
        setSeats(seats.filter((s) => s.id !== id));
      })
      .catch(() => setFormError("Failed to delete seat"));
  };

  const resetForm = () => {
    setSeatNumber("");
    setShowtimeId("");
    setIsBooked(true);
    setSelectedSeat(null);
    setOperation("add");
  };

  return (
    <div className="seat-menu">
      <h1>Manage Seats</h1>
      <form className="form-example" onSubmit={handleFormSubmit}>
        <div className="form-example">
          <label>Operation</label>
          <select value={operation} onChange={(e) => setOperation(e.target.value)}>
            <option value="add">Add Seat</option>
            <option value="edit">Edit Seat</option>
          </select>
        </div>

        <div className="form-example">
          <label>Seat Number</label>
          <input
            type="text"
            required
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
          />
        </div>

        <div className="form-example">
          <label>Showtime</label>
          <select
            required
            value={showtimeId}
            onChange={(e) =>
              setShowtimeId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">Select Showtime</option>
            {showtimes.map((st) => (
              <option key={st.id} value={st.id}>
                {`${getMovieTitle(st.movieId)} — ${new Date(st.showtimeDate).toLocaleString()}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-example">
          <label>Booked</label>
          <select
            value={isBooked ? "yes" : "no"}
            onChange={(e) => setIsBooked(e.target.value === "yes")}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {formError && <p style={{ color: "red" }}>{formError}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : operation === "add" ? "Add Seat" : "Update Seat"}
        </button>
      </form>

      <h2>Seat List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Seat Number</th>
            <th>Showtime</th>
            <th>Booked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {seats.map((seat) => {
            const showtime = showtimes.find((s) => s.id === seat.showtimeId);
            const title = showtime ? getMovieTitle(showtime.movieId) : "N/A";
            const time = showtime
              ? new Date(showtime.showtimeDate).toLocaleString()
              : "";
            return (
              <tr key={seat.id}>
                <td>{seat.id}</td>
                <td>{seat.seatNumber}</td>
                <td>{showtime ? `${title} — ${time}` : "N/A"}</td>
                <td>{seat.isBooked ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => {
                      setOperation("edit");
                      setSelectedSeat(seat);
                      setSeatNumber(seat.seatNumber);
                      setShowtimeId(seat.showtimeId);
                      setIsBooked(seat.isBooked);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => seat.id && handleDelete(seat.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
