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
  const [showtimeId, setShowtimeId] = useState<number | null>(null);
  const [isBooked, setIsBooked] = useState(true);
  const [operation, setOperation] = useState("add");
  const [selectedSeat, setSelectedSeat] = useState<SeatDto | null>(null);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGridView, setIsGridView] = useState(false);

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
      showtimeId: showtimeId ?? 0,
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

  const handleDelete = async (id: number) => {
    if (loading) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this seat?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      const response = await fetch(`api/seats/${id}`, { 
        method: "DELETE" 
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete seat: ${errorText}`);
      }
      
      setSeats(seats.filter((s) => s.id !== id));
    } catch (error: any) {
      setFormError(error.message || "Failed to delete seat");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSeatNumber("");
    setShowtimeId(null);
    setIsBooked(true);
    setSelectedSeat(null);
    setOperation("add");
  };

  const generateSeatsForAllShowtimes = async () => {
    const rows = "ABCDEFG";
    const cols = 10;

    setLoading(true);
    setFormError("");

    try {
      for (const showtime of showtimes) {
        const existingSeats = seats.filter((seat) => seat.showtimeId === showtime.id);
        const existingSeatNumbers = existingSeats.map((seat) => seat.seatNumber);

        for (let r = 0; r < rows.length; r++) {
          for (let c = 1; c <= cols; c++) {
            const seatNumber = `${rows[r]}${c}`;
            if (existingSeatNumbers.includes(seatNumber)) continue;

            const seat: SeatDto = {
              seatNumber,
              showtimeId: showtime.id,
              isBooked: false,
            };

            await fetch("api/seats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(seat),
            });
          }
        }
      }

      fetchSeats();
      alert("Seats generated for all showtimes.");
    } catch (err) {
      setFormError("Failed to generate seats.");
    } finally {
      setLoading(false);
    }
  };

  const toggleGridView = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div className="seat-menu">
      <h1>Manage Seats</h1>

      <button onClick={toggleGridView}>
        {isGridView ? "Switch to List View" : "Switch to Grid View"}
      </button>

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
            value={showtimeId ?? ""}
            onChange={(e) =>
              setShowtimeId(e.target.value ? Number(e.target.value) : null)
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

      <button onClick={generateSeatsForAllShowtimes} disabled={loading}>
        {loading ? "Generating..." : "Generate Seats for All Showtimes"}
      </button>

      <h2>Seat List</h2>

      {isGridView ? (
        <div className="grid-view">
          {showtimes.map((showtime) => {
            const showtimeSeats = seats.filter(
              (seat) => seat.showtimeId === showtime.id
            );
            return (
              <div key={showtime.id} className="showtime-grid">
                <h3>{getMovieTitle(showtime.movieId)} - {new Date(showtime.showtimeDate).toLocaleString()}</h3>
                <div className="grid-container">
                  {showtimeSeats.map((seat) => (
                    <div
                      key={seat.id}
                      className={`seat-block ${seat.isBooked ? "booked" : "available"}`}
                      onClick={() => {
                        setOperation("edit");
                        setSelectedSeat(seat);
                        setSeatNumber(seat.seatNumber);
                        setShowtimeId(seat.showtimeId);
                        setIsBooked(seat.isBooked);
                      }}
                    >
                      {seat.seatNumber}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
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
            {seats.map((seat) => (
              <tr key={seat.id}>
                <td>{seat.id}</td> 
                <td>{seat.seatNumber}</td>
                <td>
                  {showtimes
                    .filter((showtime) => showtime.id === seat.showtimeId)
                    .map((showtime) => (
                      <div key={showtime.id}>
                        {`${getMovieTitle(showtime.movieId)} — ${new Date(
                          showtime.showtimeDate
                        ).toLocaleString()}`}
                      </div>
                    ))}
                </td>
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
                  <button 
                    onClick={() => seat.id && handleDelete(seat.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}