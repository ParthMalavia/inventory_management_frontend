import { useState, useEffect } from 'react';
import { getCategories, createCategory } from '../api/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

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
      await createCategory({ name, description });
      await fetchCategories();
      setName('');
      setDescription('');
      setError('');
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-8">
        <h3 className="text-xl mb-2">Create Category</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
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
        <h3 className="text-xl mb-2">Category List</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="border p-2">{category.name}</td>
                <td className="border p-2">{category.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
