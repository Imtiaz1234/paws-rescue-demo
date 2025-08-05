import { useEffect, useState } from 'react';
import axios from 'axios';
import CatCard from '../components/CatCard';

export default function Home() {
  const [cats, setCats] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:5000/api/cats')
      .then(res => setCats(res.data));
  }, []);
  
  return (
    <div className="cat-grid">
      {cats.map(cat => <CatCard key={cat._id} cat={cat} />)}
    </div>
  );
}
