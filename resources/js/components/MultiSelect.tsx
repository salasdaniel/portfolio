import React from 'react';

interface MultiSelectProps {
    label: string;
    options: { id: number; name: string }[];
    selected: number[];
    onChange: (selectedIds: number[]) => void;
    placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    label,
    options,
    selected,
    onChange,
    // placeholder = "Select options..."
}) => {
    const handleCheckboxChange = (id: number) => {
        if (selected.includes(id)) {
            onChange(selected.filter(selectedId => selectedId !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-1">
                {options.map(option => (
                    <label key={option.id} className="flex items-center space-x-2 text-sm">
                        <input
                            type="checkbox"
                            checked={selected.includes(option.id)}
                            onChange={() => handleCheckboxChange(option.id)}
                            className="rounded border-gray-300"
                        />
                        <span>{option.name}</span>
                    </label>
                ))}
            </div>
            {selected.length > 0 && (
                <p className="text-xs text-gray-500">
                    {selected.length} selected
                </p>
            )}
        </div>
    );
};

export default MultiSelect;
