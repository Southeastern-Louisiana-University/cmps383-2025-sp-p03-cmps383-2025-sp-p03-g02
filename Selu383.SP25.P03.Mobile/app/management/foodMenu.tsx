import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";

interface FoodItemDto {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function AddFoodItemScreen() {
  const [foodItems, setFoodItems] = useState<FoodItemDto[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState<"add" | "edit">("add");
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItemDto | null>(null);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = () => {
    fetch("https://your-api-url/api/fooditem")
      .then((response) => response.json())
      .then((data: FoodItemDto[]) => setFoodItems(data))
      .catch(() => Alert.alert("Error", "Failed to fetch food items."));
  };

  const handleSubmit = () => {
    if (loading) return;

    setLoading(true);
    const foodItem = { name, description, price: parseFloat(price), imageUrl };

    if (operation === "add") {
      fetch("http://localhost:5249/api/Fooditem", {
        method: "POST",
        body: JSON.stringify(foodItem),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          setFoodItems([...foodItems, data]);
          resetForm();
        })
        .catch(() => Alert.alert("Error", "Failed to add food item"))
        .finally(() => setLoading(false));
    } else if (operation === "edit" && selectedFoodItem?.id) {
      fetch(`http://localhost:5249/api/Fooditem/${selectedFoodItem.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...foodItem, id: selectedFoodItem.id }),
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          setFoodItems(foodItems.map((item) => (item.id === selectedFoodItem.id ? { ...selectedFoodItem, ...foodItem } : item)));
          resetForm();
        })
        .catch(() => Alert.alert("Error", "Failed to update food item"))
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:5249/api/Fooditem/${id}`, { method: "DELETE" })
      .then(() => setFoodItems(foodItems.filter((item) => item.id !== id)))
      .catch(() => Alert.alert("Error", "Failed to delete food item"));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setSelectedFoodItem(null);
    setOperation("add");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{operation === "add" ? "Add Food Item" : "Edit Food Item"}</Text>

      <TextInput style={styles.input} placeholder="Food Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Price" keyboardType="numeric" value={price} onChangeText={setPrice} />
      <TextInput style={styles.input} placeholder="Image URL" value={imageUrl} onChangeText={setImageUrl} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title={operation === "add" ? "Add Food Item" : "Update Food Item"} onPress={handleSubmit} />
      )}

      <Text style={styles.subtitle}>Food Items List</Text>

      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => { 
              setOperation("edit"); 
              setSelectedFoodItem(item); 
              setName(item.name); 
              setDescription(item.description); 
              setPrice(item.price.toString()); 
              setImageUrl(item.imageUrl); 
            }}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => item.id && handleDelete(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 5, borderRadius: 5 },
  item: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderColor: "#ccc" },
  image: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
  itemText: { fontSize: 16, fontWeight: "bold" },
  price: { color: "green", fontWeight: "bold" },
  editButton: { color: "blue", marginLeft: 10 },
  deleteButton: { color: "red", marginLeft: 10 },
});

