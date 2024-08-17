'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Item {
  _id: string;
  name: string;
  description: string;
}

const IndexPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('/api/items');
        setItems(res.data.data);
      } catch (err) {
        setError('Failed to fetch items.');
      }
    };

    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/items', { name, description });
      setItems([...items, res.data.data]);
      setName('');
      setDescription('');
      console.log('successfully added!');
    } catch (err) {
      setError('Failed to add item.');
      console.error('Failed to add item.');
    }
  };

  return (
    <div>
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Add Item</button>
      </form>

      <h1>Item List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <Link href={`/items/${item._id}`}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndexPage;
