import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  value?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onClear, 
  placeholder = "Search bus stops...",
  value = ""
}) => {
  const [searchQuery, setSearchQuery] = useState(value);

  const handleSearch = () => {
    onSearch(searchQuery.trim());
  };

  const handleClear = () => {
    setSearchQuery('');
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-10 bg-card border-border focus:ring-primary focus:border-primary"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-accent"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      <Button 
        onClick={handleSearch}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={!searchQuery.trim()}
      >
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SearchBar;