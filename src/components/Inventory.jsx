import { useState, useEffect } from 'react';
import { getInventory, createInventory, getCategories, updateInventory, deleteInventory, updateInventoryQuantity } from '../api/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    part_number: '',
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    category_id: '',
    low_stock_threshold: 10,
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    category_id: '',
    low_stock_threshold: 10,
  });
  const [quantityInputs, setQuantityInputs] = useState({});
  const [editPartNumber, setEditPartNumber] = useState(null);

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
        category_id: parseInt(formData.category_id) || null,
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
      setIsModalOpen(false); // Close the modal after successful creation
    } catch (error) {
      console.error('Error creating inventory:', error);
      setError('Failed to create inventory item');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateInventory(editPartNumber, {
        ...editFormData,
        quantity: parseInt(editFormData.quantity),
        price: parseFloat(editFormData.price),
        category_id: parseInt(editFormData.category_id) || null,
        low_stock_threshold: parseInt(editFormData.low_stock_threshold) || null,
      });
      await fetchInventory();
      setEditFormData({
        name: '',
        description: '',
        quantity: 0,
        price: 0,
        category_id: '',
        low_stock_threshold: 10,
      });
      setEditPartNumber(null);
      setError('');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating inventory:', error);
      setError('Failed to update inventory item');
    }
  };

  const handleDelete = async (partNumber) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await deleteInventory(partNumber);
        await fetchInventory();
        setError('');
      } catch (error) {
        console.error('Error deleting inventory:', error);
        setError('Failed to delete inventory item');
      }
    }
  };

  const handleUpdateQuantity = async (partNumber, quantity) => {
    try {
      await updateInventoryQuantity(partNumber, {
        quantity: parseInt(quantity),
      });
      await fetchInventory();
      setQuantityInputs((prev) => ({ ...prev, [partNumber]: undefined }));
      setError('');
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity');
    }
  };

  const handleQuantityInputChange = (partNumber, value) => {
    setQuantityInputs((prev) => ({ ...prev, [partNumber]: value }));
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const openEditModal = (item) => {
    setEditFormData({
      name: item.name,
      description: item.description || '',
      quantity: item.quantity,
      price: item.price,
      category_id: item.category_id || '',
      low_stock_threshold: item.low_stock_threshold || 10,
    });
    setEditPartNumber(item.part_number);
    setError('');
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openModal = () => {
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Inventory</h2>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="container mx-auto p-4">
      {/* ... (header and create modal JSX unchanged) */}
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
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.part_number}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={quantityInputs[item.part_number] ?? item.quantity}
                      onChange={(e) => handleQuantityInputChange(item.part_number, e.target.value)}
                      placeholder={item.quantity.toString()}
                      className="w-12 p-1 border rounded text-gray-800 placeholder-gray-600"
                      min="0"
                    />
                    <button
                      onClick={() => handleUpdateQuantity(item.part_number, quantityInputs[item.part_number])}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      disabled={
                        quantityInputs[item.part_number] === undefined ||
                        parseInt(quantityInputs[item.part_number]) === item.quantity ||
                        quantityInputs[item.part_number] < 0
                      }
                    >
                      Save
                    </button>
                  </div>
                </td>
                <td className="border p-2">${item.price.toFixed(2)}</td>
                <td className="border p-2">{item.category?.name || '-'}</td>
                <td className="border p-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.part_number)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ... (edit modal JSX unchanged) */}
      {/* ... (create modal JSX unchanged) */}
    </div>

      {/* Modal for editing an inventory item */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Inventory Item</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  placeholder="Name"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editFormData.quantity}
                  onChange={handleEditInputChange}
                  placeholder="Quantity"
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditInputChange}
                  placeholder="Price"
                  step="0.01"
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category_id"
                  value={editFormData.category_id}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  name="low_stock_threshold"
                  value={editFormData.low_stock_threshold}
                  onChange={handleEditInputChange}
                  placeholder="Low Stock Threshold"
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for creating a new inventory item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create Inventory Item</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Part Number</label>
                <input
                  type="text"
                  name="part_number"
                  value={formData.part_number}
                  onChange={handleInputChange}
                  placeholder="Part Number"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Quantity"
                  className="w-full p-2 border rounded"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  step="0.01"
                  className="w-full p-2 border rounded"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  name="low_stock_threshold"
                  value={formData.low_stock_threshold}
                  onChange={handleInputChange}
                  placeholder="Low Stock Threshold"
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;