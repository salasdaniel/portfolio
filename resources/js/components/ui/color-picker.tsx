import { useState } from 'react';
import { Input } from './input';
import { Label } from './label';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    label?: string;
    error?: string;
}

const predefinedColors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#84cc16', // Lime
    '#ec4899', // Pink
    '#6b7280', // Gray
];

export function ColorPicker({ value, onChange, label, error }: ColorPickerProps) {
    const [customColor, setCustomColor] = useState(value);

    const handleColorChange = (color: string) => {
        setCustomColor(color);
        onChange(color);
    };

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            
            {/* Predefined Colors */}
            <div className="grid grid-cols-5 gap-2">
                {predefinedColors.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        className={`w-10 h-10 rounded-md border-2 transition-all hover:scale-110 ${
                            value === color ? 'border-foreground' : 'border-muted'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
            
            {/* Custom Color Input */}
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer"
                />
                <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                />
            </div>
            
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}
