import React, { useState, useEffect } from "react";
import "../styles/EditMovie.css";

interface MovieDto {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export function AddMovieForm() {
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState("add");
  const [selectedMovie, setSelectedMovie] = useState<MovieDto | null>(null);

  useEffect(() => {
    // Fetch movie items from the API to populate the table
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    fetch("api/movie")
      .then((response) => response.json())
      .then((data: MovieDto[]) => setMovies(data))
      .catch(() => {
        setFormError("Failed to fetch movies.");
      });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setLoading(true);

    const movie = { title, description, imageUrl, category };

    if (operation === "add") {
      // Add movie item
      fetch("api/movie", {
        method: "POST",
        body: JSON.stringify(movie),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          setMovies([...movies, data]);
          resetForm();
        })
        .catch(() => setFormError("Failed to add movie"))
        .finally(() => setLoading(false));
    } else if (operation === "edit" && selectedMovie?.id) {
      // Update movie item
      fetch(`api/movie/${selectedMovie.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...movie, id: selectedMovie.id }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then(() => {
          // Update the movies array with the modified movie
          const updatedMovies = movies.map((item) =>
            item.id === selectedMovie.id ? { ...selectedMovie, ...movie } : item
          );
          setMovies(updatedMovies);
          resetForm();
        })
        .catch(() => setFormError("Failed to update movie"))
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = (id: number) => {
    fetch(`api/movie/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setMovies(movies.filter((item) => item.id !== id));
      })
      .catch(() => setFormError("Failed to delete movie"));
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setCategory("");
    setSelectedMovie(null);
    setOperation("add");
  };

  return (
    <div>
      <form className="form-example" onSubmit={handleFormSubmit}>
        <div className="form-example">
          <label htmlFor="operation">Select Operation: </label>
          <select
            name="operation"
            id="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
          >
            <option value="add">Add Movie</option>
            <option value="edit">Edit Movie</option>
            <option value="delete">Delete Movie</option>
          </select>
        </div>

        <div className="form-example">
          <label htmlFor="title">Movie Title: </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-example">
          <label htmlFor="description">Description: </label>
          <textarea
            name="description"
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-example">
          <label htmlFor="imageUrl">Image URL: </label>
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div className="form-example">
          <label htmlFor="category">Category: </label>
          <input
            type="text"
            name="category"
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {formError ? <p style={{ color: "red" }}>{formError}</p> : null}

        <div className="form-example">
          <input
            type="submit"
            value={loading ? "Loading..." : operation === "add" ? "Add Movie" : "Update Movie"}
            disabled={loading}
          />
        </div>
      </form>

      <h2>Movie List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.id}</td>
              <td>{movie.title}</td>
              <td>{movie.description}</td>
              <td><img src={movie.imageUrl} alt={movie.title} style={{ width: "50px", height: "50px" }} /></td>
              <td>{movie.category}</td>
              <td>
                <button onClick={() => { setOperation("edit"); setSelectedMovie(movie); setTitle(movie.title); setDescription(movie.description); setImageUrl(movie.imageUrl); setCategory(movie.category); }}>
                  Edit
                </button>
                <button onClick={() => movie.id && handleDelete(movie.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
