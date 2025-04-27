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
  const [formData, setFormData] = useState<MovieDto>({
    title: "",
    description: "",
    imageUrl: "",
    category: ""
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState<"add" | "edit">("add");
  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch("api/movie");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setFormError(error.message || "Failed to fetch movies");
      console.error("Fetch error:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setLoading(true);

    try {
      let response;
      const url = operation === "edit" && editingMovieId 
        ? `api/movie/${editingMovieId}`
        : "api/movie";

      response = await fetch(url, {
        method: operation === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(operation === "edit" 
          ? { ...formData, id: editingMovieId } 
          : formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${operation} movie`);
      }

      await fetchMovies();
      resetForm();
    } catch (error: any) {
      setFormError(error.message || `Failed to ${operation} movie`);
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movie: MovieDto) => {
    setOperation("edit");
    setEditingMovieId(movie.id || null);
    setFormData({
      title: movie.title,
      description: movie.description,
      imageUrl: movie.imageUrl,
      category: movie.category
    });
  };

  const handleDelete = async (id: number) => {
    if (loading) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      const response = await fetch(`api/movie/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete movie");
      }

      setMovies(prev => prev.filter(movie => movie.id !== id));
    } catch (error: any) {
      setFormError(error.message || "Failed to delete movie");
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      category: ""
    });
    setOperation("add");
    setEditingMovieId(null);
  };

  return (
    <div className="movie-form">
      <h1>Manage Movies</h1>
      <div className="form-example">
        <label htmlFor="operation">Operation: </label>
        <select
          id="operation"
          value={operation}
          onChange={(e) => setOperation(e.target.value as "add" | "edit")}
        >
          <option value="add">Add Movie</option>
          <option value="edit">Edit Movie</option>
        </select>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="form-example">
          <label htmlFor="title">Movie Title: </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-example">
          <label htmlFor="description">Description: </label>
          <textarea
            name="description"
            id="description"
            required
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-example">
          <label htmlFor="imageUrl">Image URL: </label>
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            required
            value={formData.imageUrl}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-example">
          <label htmlFor="category">Category: </label>
          <input
            type="text"
            name="category"
            id="category"
            required
            value={formData.category}
            onChange={handleInputChange}
          />
        </div>

        {formError && <p className="error-message">{formError}</p>}

        <div className="form-example">
          <input
            type="submit"
            value={loading ? "Loading..." : operation === "add" ? "Add Movie" : "Update Movie"}
            disabled={loading}
          />
          {operation === "edit" && (
            <button type="button" onClick={resetForm} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Movie List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th style={{ width: '100px' }}>Image</th> {/* Fixed width for image column */}
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.id}</td>
              <td>{movie.title}</td>
              <td className="description-cell">{movie.description}</td>
              <td style={{ textAlign: 'center', padding: '5px' }}>
                {movie.imageUrl && (
                  <div style={{ 
                    width: '80px', 
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                )}
              </td>
              <td>{movie.category}</td>
              <td>
                <button
                  onClick={() => handleEdit(movie)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => movie.id && handleDelete(movie.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}