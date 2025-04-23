import { useState, useEffect } from 'react';
import { getInventory, createInventory, getCategories } from '../api/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    part_number: '',
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    category_id: '',
    low_stock_threshold: 10,
  });

  const fetchInventory = async () => {
    try {
      const response = await getInventory();
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to fetch inventory');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createInventory({
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        low_stock_threshold: parseInt(formData.low_stock_threshold),
      });
      await fetchInventory();
      setFormData({
        part_number: '',
        name: '',
        description: '',
        quantity: 0,
        price: 0,
        category_id: '',
        low_stock_threshold: 10,
      });
      setError('');
    } catch (error) {
      console.error('Error creating inventory:', error);
      setError('Failed to create inventory item');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-8">
        <h3 className="text-xl mb-2">Create Inventory Item</h3>
        <div className="space-y-4">
          <input
            type="text"
            name="part_number"
            value={formData.part_number}
            onChange={handleInputChange}
            placeholder="Part Number"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Quantity"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
            step="0.01"
            className="w-full p-2 border rounded"
          />
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="low_stock_threshold"
            value={formData.low_stock_threshold}
            onChange={handleInputChange}
            placeholder="Low Stock Threshold"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xl mb-2">Inventory List</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Part Number</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.part_number}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">${item.price.toFixed(2)}</td>
                <td className="border p-2">{item.category?.name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
