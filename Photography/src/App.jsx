import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItemId) {
        // Update existing item
        await axios.patch(`http://localhost:5000/api/items/${editItemId}`, {
          name,
          description,
        });
        setEditItemId(null);
      } else {
        // Create a new item
        await axios.post('http://localhost:5000/api/items', { name, description });
      }
      setName('');
      setDescription('');
      fetchItems();
    } catch (error) {
      console.error('Error submitting item:', error);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setDescription(item.description);
    setEditItemId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">MERN Stack Items</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Item description"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editItemId ? 'Update Item' : 'Add Item'}
        </button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item._id} className="mb-2 flex justify-between items-center">
            <div>
              <strong>{item.name}</strong>: {item.description}
            </div>
            <div>
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-700 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-700 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
