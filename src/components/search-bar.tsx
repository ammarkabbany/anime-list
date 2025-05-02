import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full max-w-lg items-center">
      <Input
        type="text"
        placeholder="Search anime..."
        className="pr-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button 
        type="submit" 
        size="icon" 
        variant="ghost" 
        className="absolute right-0 h-full"
      >
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default SearchBar;