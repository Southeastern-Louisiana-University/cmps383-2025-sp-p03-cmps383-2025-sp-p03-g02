import React, { useState, useEffect } from "react";
import "../styles/EditFoodMenu.css";

interface FoodItemDto {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export function AddFoodItemForm() {
  const [foodItems, setFoodItems] = useState<FoodItemDto[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState("add"); // Dropdown value for CRUD operations
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItemDto | null>(null);

  useEffect(() => {
    // Fetch food items from the API to populate the table
    fetchFoodItems();
  }, []);

  const fetchFoodItems = () => {
    fetch("api/fooditem")
      .then((response) => response.json())
      .then((data: FoodItemDto[]) => setFoodItems(data))
      .catch(() => {
        setFormError("Failed to fetch food items.");
      });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setLoading(true);

    const foodItem = { name, description, price, imageUrl };

    if (operation === "add") {
      // Add food item
      fetch("api/fooditem", {
        method: "POST",
        body: JSON.stringify(foodItem),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          setFoodItems([...foodItems, data]);
          resetForm();
        })
        .catch(() => setFormError("Failed to add food item"))
        .finally(() => setLoading(false));


    } else if (operation === "edit" && selectedFoodItem?.id) {
      // Update food item
      fetch(`api/fooditem/${selectedFoodItem.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...foodItem, id: selectedFoodItem.id }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then(() => {
          // Update the foodItems array with the modified food item
          const updatedItems = foodItems.map((item) =>
            item.id === selectedFoodItem.id ? { ...selectedFoodItem, ...foodItem } : item
          );
          setFoodItems(updatedItems);
          resetForm();
        })
        .catch(() => setFormError("Failed to update food item"))
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = (id: number) => {
    fetch(`api/fooditem/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setFoodItems(foodItems.filter((item) => item.id !== id));
      })
      .catch(() => setFormError("Failed to delete food item"));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice(0);
    setImageUrl("");
    setSelectedFoodItem(null);
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
            <option value="add">Add Food Item</option>
            <option value="edit">Edit Food Item</option>
            <option value="delete">Delete Food Item</option>
          </select>
        </div>

        <div className="form-example">
          <label htmlFor="name">Food Name: </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label htmlFor="price">Price: </label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
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
        {formError ? <p style={{ color: "red" }}>{formError}</p> : null}
        <div className="form-example">
          <input
            type="submit"
            value={loading ? "Loading..." : operation === "add" ? "Add Food Item" : "Update Food Item"}
            disabled={loading}
          />
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foodItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.price}</td>
              <td>
                <img src={item.imageUrl} alt={item.name} style={{ width: "50px", height: "50px" }} />
              </td>
              <td>
                <button onClick={() => { setOperation("edit"); setSelectedFoodItem(item); setName(item.name); setDescription(item.description); setPrice(item.price); setImageUrl(item.imageUrl); }}>
                  Edit
                </button>
                <button onClick={() => item.id && handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
