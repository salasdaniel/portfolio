import { Check, ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

interface Option {
    id: number;
    name: string;
    color?: string;
}

interface MultiSelectProps {
    options: Option[];
    value: number[];
    onChange: (values: number[]) => void;
    placeholder?: string;
    className?: string;
    label?: string;
    error?: string;
}

export function MultiSelect({ 
    options, 
    value, 
    onChange, 
    placeholder = "Select options...", 
    className = "",
    label,
    error
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
                setHighlightedIndex(-1);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const toggleOption = useCallback((optionId: number) => {
        if (value.includes(optionId)) {
            onChange(value.filter(id => id !== optionId));
        } else {
            onChange([...value, optionId]);
        }
    }, [value, onChange]);

    const removeOption = (optionId: number) => {
        onChange(value.filter(id => id !== optionId));
    };

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setHighlightedIndex(prev => 
                        prev < filteredOptions.length - 1 ? prev + 1 : 0
                    );
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setHighlightedIndex(prev => 
                        prev > 0 ? prev - 1 : filteredOptions.length - 1
                    );
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                        toggleOption(filteredOptions[highlightedIndex].id);
                    }
                    break;
                case 'Escape':
                    setIsOpen(false);
                    setSearchTerm('');
                    setHighlightedIndex(-1);
                    break;
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, highlightedIndex, filteredOptions, toggleOption]);

    const selectedOptions = options.filter(option => value.includes(option.id));

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            
            <div className="relative" ref={containerRef}>
                {/* Main display area */}
                <div
                    className={`
                        min-h-[2.5rem] w-full rounded-md border bg-background px-3 py-2 text-sm cursor-pointer
                        ${error ? 'border-red-300' : 'border-input'}
                        focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500
                    `}
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) {
                            setSearchTerm('');
                            setHighlightedIndex(-1);
                        }
                    }}
                >
                    <div className="flex flex-wrap gap-1 items-center">
                        {selectedOptions.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            selectedOptions.map((option) => (
                                <span
                                    key={option.id}
                                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
                                >
                                    {option.color && (
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: option.color }}
                                        />
                                    )}
                                    {option.name}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeOption(option.id);
                                        }}
                                        className="hover:bg-primary/20 rounded-sm"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))
                        )}
                        <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {/* Dropdown menu */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
                        {/* Search input */}
                        <div className="p-2 border-b">
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full px-2 py-1 text-sm border rounded outline-none focus:border-indigo-500"
                                placeholder="Type to search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        
                        <div className="max-h-60 overflow-auto p-1">
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-2 text-sm text-gray-500">
                                    No options found
                                </div>
                            ) : (
                                filteredOptions.map((option, index) => (
                                    <div
                                        key={option.id}
                                        className={`
                                            relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm
                                            ${index === highlightedIndex ? 'bg-indigo-600 text-white' : 'hover:bg-accent hover:text-accent-foreground'}
                                            ${value.includes(option.id) ? 'bg-indigo-50' : ''}
                                        `}
                                        onClick={() => toggleOption(option.id)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                    >
                                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                            {value.includes(option.id) && <Check className="h-4 w-4" />}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {option.color && (
                                                <span
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: option.color }}
                                                />
                                            )}
                                            {option.name}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Background overlay */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
