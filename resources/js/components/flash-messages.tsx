import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface FlashMessage {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
}

interface AlertProps {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    onClose: () => void;
}

function Alert({ type, message, onClose }: AlertProps) {
    const icons = {
        success: CheckCircle,
        error: XCircle,
        info: CheckCircle,
        warning: XCircle,
    };

    const colors = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    };

    const Icon = icons[type];

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg border p-4 shadow-lg ${colors[type]}`}>
            <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:opacity-70"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

export function FlashMessages() {
    const { props } = usePage();
    const flash = props.flash as FlashMessage;
    const [alerts, setAlerts] = useState<Array<{ id: string; type: keyof FlashMessage; message: string }>>([]);

    useEffect(() => {
        const newAlerts: Array<{ id: string; type: keyof FlashMessage; message: string }> = [];

        if (flash?.success) {
            newAlerts.push({
                id: `success-${Date.now()}`,
                type: 'success',
                message: flash.success,
            });
        }

        if (flash?.error) {
            newAlerts.push({
                id: `error-${Date.now()}`,
                type: 'error',
                message: flash.error,
            });
        }

        if (flash?.info) {
            newAlerts.push({
                id: `info-${Date.now()}`,
                type: 'info',
                message: flash.info,
            });
        }

        if (flash?.warning) {
            newAlerts.push({
                id: `warning-${Date.now()}`,
                type: 'warning',
                message: flash.warning,
            });
        }

        if (newAlerts.length > 0) {
            setAlerts(newAlerts);

            // Auto-hide after 5 seconds
            newAlerts.forEach(alert => {
                setTimeout(() => {
                    setAlerts(prev => prev.filter(a => a.id !== alert.id));
                }, 5000);
            });
        }
    }, [flash]);

    const handleClose = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    return (
        <>
            {alerts.map(alert => (
                <Alert
                    key={alert.id}
                    type={alert.type}
                    message={alert.message}
                    onClose={() => handleClose(alert.id)}
                />
            ))}
        </>
    );
}
