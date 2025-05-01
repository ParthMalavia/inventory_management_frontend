import { useState, useEffect } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder, getCustomers, getInventory } from '../api/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    items: [{ inventory_id: '', quantity: '' }],
  });
  const [editFormData, setEditFormData] = useState({
    status: '',
  });
  const [editOrderId, setEditOrderId] = useState(null);
  const [quantityErrors, setQuantityErrors] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customers');
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await getInventory();
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to fetch inventory');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (quantityErrors.some(err => err)) {
      setError('Please fix quantity errors before creating the order');
      return;
    }
    try {
      await createOrder({
        customer_id: parseInt(formData.customer_id),
        items: formData.items.map(item => ({
          inventory_id: parseInt(item.inventory_id),
          quantity: parseInt(item.quantity),
        })),
      });
      await fetchOrders();
      setFormData({ customer_id: '', items: [{ inventory_id: '', quantity: '' }] });
      setQuantityErrors([]);
      setError('');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateOrder(editOrderId, { status: editFormData.status });
      await fetchOrders();
      setEditFormData({ status: '' });
      setEditOrderId(null);
      setError('');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update order');
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId);
        await fetchOrders();
        setError('');
      } catch (error) {
        console.error('Error deleting order:', error);
        setError('Failed to delete order');
      }
    }
  };

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const newItems = [...formData.items];
      newItems[index][name] = value;

      // Validate quantity against available inventory
      if (name === 'quantity' || name === 'inventory_id') {
        const newErrors = [...quantityErrors];
        const inventoryId = parseInt(newItems[index].inventory_id);
        const quantity = parseInt(newItems[index].quantity);
        const selectedInventory = inventory.find(inv => inv.id === inventoryId);

        if (selectedInventory && quantity && quantity > selectedInventory.quantity) {
          newErrors[index] = `Quantity exceeds available stock (${selectedInventory.quantity})`;
        } else {
          newErrors[index] = '';
        }
        setQuantityErrors(newErrors);
      }

      setFormData({ ...formData, items: newItems });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { inventory_id: '', quantity: '' }],
    });
    setQuantityErrors([...quantityErrors, '']);
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const newErrors = quantityErrors.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
    setQuantityErrors(newErrors);
  };

  const openCreateModal = () => {
    setFormData({ customer_id: '', items: [{ inventory_id: '', quantity: '' }] });
    setQuantityErrors([]);
    setError('');
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openEditModal = (order) => {
    setEditFormData({ status: order.status });
    setEditOrderId(order.id);
    setError('');
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Get filtered inventory, but include the current item's inventory_id for display
  const getInventoryOptions = (currentInventoryId) => {
    const selectedIds = formData.items
      .filter(item => item.inventory_id)
      .map(item => parseInt(item.inventory_id));

    // Start with the filtered inventory (excluding selected items)
    let availableInventory = inventory.filter(inv => !selectedIds.includes(inv.id));

    // If the current row has a selected inventory_id, include it in the options for display
    if (currentInventoryId) {
      const currentItem = inventory.find(inv => inv.id === parseInt(currentInventoryId));
      if (currentItem && !availableInventory.some(inv => inv.id === currentItem.id)) {
        availableInventory = [currentItem, ...availableInventory];
      }
    }

    return availableInventory;
  };

  // Determine if Create button should be disabled
  const isCreateDisabled = !formData.customer_id || 
    formData.items.length === 0 || 
    formData.items.some(item => !item.inventory_id || !item.quantity || quantityErrors.some(err => err));

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchInventory();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={openCreateModal}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Order
      </button>
      <div>
        <h3 className="text-xl mb-2">Order List</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Customer ID</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">{order.customer_id}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">{new Date(order.created_at).toLocaleString()}</td>
                <td className="border p-2">{order.items.length} item(s)</td>
                <td className="border p-2">
                  <button
                    onClick={() => openEditModal(order)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
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

      {/* Modal for creating an order */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create Order</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer</label>
                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-800"
                >
                  <option value="">Select a customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <div className="w-1/2">
                      <select
                        name="inventory_id"
                        value={item.inventory_id}
                        onChange={(e) => handleInputChange(e, index)}
                        className="w-full p-2 border rounded text-gray-800"
                      >
                        <option value="">Select an item</option>
                        {getInventoryOptions(item.inventory_id).map(inv => (
                          <option key={inv.id} value={inv.id}>
                            {inv.name}
                          </option>
                        ))}
                      </select>
                      {quantityErrors[index] && (
                        <p className="text-red-500 text-sm mt-1">{quantityErrors[index]}</p>
                      )}
                    </div>
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, index)}
                      placeholder="Quantity"
                      className="w-1/4 p-2 border rounded text-gray-800"
                      min="1"
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Item
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreateDisabled}
                  className={`px-4 py-2 rounded text-white ${
                    isCreateDisabled
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for editing an order */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Order</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded text-gray-800"
                >
                  <option value="pending">Pending</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="canceled">Canceled</option>
                </select>
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
    </div>
  );
};

export default Orders;
