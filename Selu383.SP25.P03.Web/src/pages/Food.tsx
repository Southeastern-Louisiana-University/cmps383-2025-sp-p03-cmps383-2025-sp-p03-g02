import { useEffect, useState } from "react";
import { UserDto } from "../models/UserDto";
import "../styles/Food.css";
import { FaTrash } from "react-icons/fa";
import { Toast } from "../components/Toast";

interface FoodItemDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface FoodProps {
  currentUser?: UserDto;
}
const Food = ({ currentUser }: FoodProps) => {
  const [foodItems, setFoodItems] = useState<FoodItemDto[]>([]);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<{ [key: number]: number }>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {};
  });
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    () => {
      const storedQuantities = localStorage.getItem("quantities");
      return storedQuantities ? JSON.parse(storedQuantities) : {};
    }
  );
  const [showCart, setShowCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!currentUser) {
      // Clear cart and quantities when user logs out
      setCart({});
      setQuantities({});
      localStorage.removeItem("cart");
      localStorage.removeItem("quantities");
    }
  }, [currentUser]);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("quantities", JSON.stringify(quantities));
  }, [quantities]);

  const fetchFoodItems = () => {
    fetch("api/fooditem")
      .then((response) => response.json())
      .then((data: FoodItemDto[]) => {
        setFoodItems(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((item) => item.category))
        );
        setCategories(["All", ...uniqueCategories]);
      })
      .catch(() => {
        setError("Failed to fetch food items.");
      });
  };

  // Filter food items based on selected category
  const filteredFoodItems =
    selectedCategory === "All"
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  //cart handlers
  const updateQuantity = (itemId: number, amount: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) + amount, 0),
    }));
  };
  const addToCart = (itemId: number) => {
    if (!currentUser) {
      setToastMessage("Please log in to order food.");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2750);
      return;
    }

    const qtyToAdd = quantities[itemId] || 0;
    if (qtyToAdd === 0) return;

    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + qtyToAdd,
    }));

    setQuantities((prev) => ({
      ...prev,
      [itemId]: 0,
    }));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // const increaseQuantity = (itemId: number) => {
  //   setCart((prev) => ({
  //     ...prev,
  //     [itemId]: (prev[itemId] || 0) + 1,
  //   }));
  // };

  // const decreaseQuantity = (itemId: number) => {
  //   setCart((prev) => {
  //     const updated = { ...prev };
  //     if (updated[itemId] > 1) {
  //       updated[itemId] -= 1;
  //     } else {
  //       delete updated[itemId];
  //     }
  //     return updated;
  //   });
  // };

  return (
    <div className="food-container">
      <h1 className="food-title">Concessions</h1>
      <p className="food-subtitle">Order food & drinks to your seat</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Tabs */}
      <div className="food-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`food-tab ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Food List */}
      <div className="food-list">
        {filteredFoodItems.map((item) => (
          <div key={item.id} className="food-item">
            {/* Quantity Badge */}
            {cart[item.id] > 0 && (
              <span className="food-quantity-badge">x{cart[item.id]}</span>
            )}
            <h2>{item.name}</h2>
            <div className="food-image-wrapper">
              <img src={item.imageUrl} alt={item.name} className="food-image" />
            </div>
            <p className="food-description">{item.description}</p>
            <p className="food-price">${item.price.toFixed(2)}</p>

            {/* Quantity Input + Add to Cart */}
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span>{quantities[item.id] || 0}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
            <button
              className="add-to-cart-btn"
              onClick={() => addToCart(item.id)}
              disabled={(quantities[item.id] || 0) === 0}
            >
              Add to Cart
              {quantities[item.id] > 0 ? ` (${quantities[item.id]})` : ""}
            </button>
          </div>
        ))}
      </div>

      {/* View Cart Button */}
      {Object.keys(cart).length > 0 && (
        <button className="view-cart-btn" onClick={() => setShowCart(true)}>
          View Cart
        </button>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <h2>Your Cart</h2>
            <ul>
              {Object.entries(cart).map(([id, qty]) => {
                const item = foodItems.find((i) => i.id === parseInt(id));
                if (!item) return null;
                return (
                  <li key={id}>
                    {item.name} x{qty} = ${(item.price * qty).toFixed(2)}
                    <button
                      onClick={() => removeFromCart(parseInt(id))}
                      className="remove-cart-item-btn"
                    >
                      <FaTrash />
                    </button>
                  </li>
                );
              })}
            </ul>
            {/* Total price calculation */}
            <div
              style={{
                fontWeight: "bold",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              Total: $
              {Object.entries(cart)
                .reduce((total, [id, qty]) => {
                  const item = foodItems.find((i) => i.id === parseInt(id));
                  return item ? total + item.price * qty : total;
                }, 0)
                .toFixed(2)}
            </div>
            <button
              className="close-cart-btn"
              onClick={() => setShowCart(false)}
            >
              Close
            </button>
            <br />
            <button
              className="checkout-btn"
              onClick={() => {
                setToastMessage("Your food will be delivered shortly!");
                setShowToast(true);
                //clears Cart and Item Quantaties
                setCart({});
                setQuantities({});
                localStorage.removeItem("cart");
                localStorage.removeItem("quantities");
                setShowCart(false);
                setTimeout(() => {
                  setShowToast(false);
                }, 2750);
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};
export default Food;
