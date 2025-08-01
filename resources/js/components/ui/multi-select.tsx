import { Check, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

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
}

export function MultiSelect({ options, value, onChange, placeholder = "Select options...", className = "" }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (optionId: number) => {
        if (value.includes(optionId)) {
            onChange(value.filter(id => id !== optionId));
        } else {
            onChange([...value, optionId]);
        }
    };

    const removeOption = (optionId: number) => {
        onChange(value.filter(id => id !== optionId));
    };

    const selectedOptions = options.filter(option => value.includes(option.id));

    return (
        <div className={`relative ${className}`}>
            <div
                className="min-h-[2.5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
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

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="max-h-60 overflow-auto p-1">
                        {options.map((option) => (
                            <div
                                key={option.id}
                                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                onClick={() => toggleOption(option.id)}
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
                        ))}
                    </div>
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
