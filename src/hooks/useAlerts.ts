import { useState, useEffect } from "react";
import { Alert } from "../types/crypto";

const useAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>(() => {
        const saved = localStorage.getItem("cryptoAlerts");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cryptoAlerts", JSON.stringify(alerts));
    }, [alerts]);

    const addAlert = (
        crypto: { id: string; name: string },
        targetPrice: number,
        isAbove: boolean
    ) => {
        setAlerts([
            ...alerts,
            {
                id: Date.now().toString(),
                cryptoId: crypto.id,
                cryptoName: crypto.name,
                targetPrice,
                isAbove,
                isActive: true,
            },
        ]);
    };

    const removeAlert = (id: string) => {
        setAlerts(alerts.filter((alert) => alert.id !== id));
    };

    return { alerts, addAlert, removeAlert };
};

export default useAlerts;
