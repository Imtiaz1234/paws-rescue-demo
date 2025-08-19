import React, { useState } from 'react';

const SearchFilter = ({ onSearch }) => {
  const [age, setAge] = useState('');
  const [rescueCenter, setRescueCenter] = useState(''); // New state
  const [specialNeeds, setSpecialNeeds] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      age: age === '' ? undefined : Number(age),
      rescueCenter: rescueCenter === '' ? undefined : rescueCenter,
      specialNeeds,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
      <input placeholder="Rescue Center" value={rescueCenter} onChange={e => setRescueCenter(e.target.value)} />
      <input placeholder="Special Needs" value={specialNeeds} onChange={e => setSpecialNeeds(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchFilter;
