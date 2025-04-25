import React, { useState, useEffect } from "react";
import "../styles/EditFoodMenu.css";

interface FoodItemDto {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export function AddFoodItemForm() {
  const [foodItems, setFoodItems] = useState<FoodItemDto[]>([]);
  const [formData, setFormData] = useState<FoodItemDto>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: ""
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState<"add" | "edit">("add");
  const [editingFoodItemId, setEditingFoodItemId] = useState<number | null>(null);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("api/fooditem");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFoodItems(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setFormError(error.message || "Failed to fetch food items");
      console.error("Fetch error:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "price" ? parseFloat(value) || 0 : value 
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setLoading(true);

    try {
      let response;
      const url = operation === "edit" && editingFoodItemId 
        ? `api/fooditem/${editingFoodItemId}`
        : "api/fooditem";

      response = await fetch(url, {
        method: operation === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(operation === "edit" 
          ? { ...formData, id: editingFoodItemId } 
          : formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${operation} food item`);
      }

      await fetchFoodItems();
      resetForm();
    } catch (error: any) {
      setFormError(error.message || `Failed to ${operation} food item`);
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (foodItem: FoodItemDto) => {
    setOperation("edit");
    setEditingFoodItemId(foodItem.id || null);
    setFormData({
      name: foodItem.name,
      description: foodItem.description,
      price: foodItem.price,
      imageUrl: foodItem.imageUrl,
      category: foodItem.category
    });
  };

  const handleDelete = async (id: number) => {
    if (loading) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this food item?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      const response = await fetch(`api/fooditem/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete food item");
      }

      setFoodItems(prev => prev.filter(item => item.id !== id));
    } catch (error: any) {
      setFormError(error.message || "Failed to delete food item");
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      category: ""
    });
    setOperation("add");
    setEditingFoodItemId(null);
  };

  return (
    <div className="food-form">
      <h1>Manage Food Items</h1>
      <div className="form-example">
        <label htmlFor="operation">Operation: </label>
        <select
          id="operation"
          value={operation}
          onChange={(e) => setOperation(e.target.value as "add" | "edit")}
        >
          <option value="add">Add Food Item</option>
          <option value="edit">Edit Food Item</option>
        </select>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="form-example">
          <label htmlFor="name">Food Name: </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
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
          <label htmlFor="price">Price: </label>
          <input
            type="number"
            name="price"
            id="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
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
            value={loading ? "Loading..." : operation === "add" ? "Add Food Item" : "Update Food Item"}
            disabled={loading}
          />
          {operation === "edit" && (
            <button type="button" onClick={resetForm} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Food Items List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foodItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td className="description-cell">{item.description}</td>
              <td>${item.price.toFixed(2)}</td>
              <td style={{ textAlign: 'center', padding: '5px' }}>
                {item.imageUrl && (
                  <div style={{ 
                    width: '80px', 
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
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
              <td>{item.category}</td>
              <td>
                <button
                  onClick={() => handleEdit(item)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => item.id && handleDelete(item.id)}
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