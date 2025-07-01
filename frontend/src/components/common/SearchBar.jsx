import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <input
        type="text"
        placeholder="Search users or posts..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="border rounded px-3 py-1 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Search</button>
    </form>
  );
};

export default SearchBar; 