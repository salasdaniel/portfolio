import React from 'react';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    label?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
    const colors = [
        '#3B82F6', // blue
        '#10B981', // green
        '#F59E0B', // yellow
        '#EF4444', // red
        '#8B5CF6', // purple
        '#F97316', // orange
        '#06B6D4', // cyan
        '#84CC16', // lime
        '#EC4899', // pink
        '#6B7280', // gray
    ];

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => onChange(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                            value === color ? 'border-gray-400' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ColorPicker;
