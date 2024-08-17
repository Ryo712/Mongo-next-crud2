import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Item {
  _id: string;
  name: string;
  description: string;
}

const ItemPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<Item | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        const res = await axios.get(`/api/items/${id}`);
        setItem(res.data.data);
        setName(res.data.data.name);
        setDescription(res.data.data.description);
      };

      fetchItem();
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`/api/items/${id}`, { name, description });
      setItem(res.data.data);
      console.log('successfully updated!');
    } catch (err) {
      console.error('Failed to update item.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/items/${id}`);
      console.log('item deleted!');
      router.push('/');
    } catch (err) {
      console.error('Failed to delete item.');
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <h2>Edit Item</h2>
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
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default ItemPage;
