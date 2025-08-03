import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Label } from './label';
import { Input } from './input';
import { Search } from 'lucide-react';

interface Option {
  id: number | string;
  name: string;
}

interface SearchableSelectFieldProps {
  options: Option[];
  value?: string | number | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  emptyText?: string;
  className?: string;
  required?: boolean;
}

export function SearchableSelectField({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  label,
  emptyText = "No options found",
  className,
  required = false
}: SearchableSelectFieldProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleValueChange = (val: string) => {
    if (val === "none") {
      onValueChange(null);
    } else {
      onValueChange(val);
    }
    setOpen(false);
    setSearchTerm(''); // Clear search when selection is made
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchTerm(''); // Clear search when closing
    }
  };

  // Get selected option for display
  const selectedOption = options.find(option => String(option.id) === String(value));

  return (
    <div className={className}>
      {label && (
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Select 
        value={value ? String(value) : "none"} 
        onValueChange={handleValueChange}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            {selectedOption ? selectedOption.name : placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {/* Search input */}
          <div className="flex items-center px-3 pb-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-full bg-transparent border-0 focus:ring-0 focus:border-0 p-0"
            />
          </div>
          
          {/* Clear selection option */}
          <SelectItem value="none">
            None
          </SelectItem>
          
          {/* Filtered options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <SelectItem 
                key={option.id} 
                value={String(option.id)}
              >
                {option.name}
              </SelectItem>
            ))
          ) : searchTerm ? (
            <SelectItem value="no-results" disabled>
              No results found for "{searchTerm}"
            </SelectItem>
          ) : (
            <SelectItem value="no-options" disabled>
              {emptyText}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
