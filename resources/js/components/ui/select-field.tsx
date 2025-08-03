import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Label } from './label';

interface Option {
  id: number | string;
  name: string;
}

interface SelectFieldProps {
  options: Option[];
  value?: string | number | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  emptyText?: string;
  className?: string;
  required?: boolean;
}

export function SelectField({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  label,
  emptyText = "No options found",
  className,
  required = false
}: SelectFieldProps) {
  const handleValueChange = (val: string) => {
    if (val === "none") {
      onValueChange(null);
    } else {
      onValueChange(val);
    }
  };

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
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {/* Clear selection option */}
          <SelectItem value="none">
            None
          </SelectItem>
          
          {/* Options */}
          {options.length > 0 ? (
            options.map((option) => (
              <SelectItem 
                key={option.id} 
                value={String(option.id)}
              >
                {option.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-results" disabled>
              {emptyText}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
