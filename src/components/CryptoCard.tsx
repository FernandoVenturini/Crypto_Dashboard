import { Crypto } from "../types/crypto";
import React, { useState } from "react";

interface Props {
    crypto: Crypto;
    onAddAlert: (crypto: { id: string; name: string }, price: number) => void;
}

const CryptoCard = ({ crypto, onAddAlert }: Props) => {
    const [price, setPrice] = useState("");

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
                <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                <h3 className="font-bold">
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                </h3>
            </div>
            <p>Price: ${crypto.current_price.toLocaleString()}</p>
            <p
                className={
                    crypto.price_change_percentage_24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                }
            >
                24h: {crypto.price_change_percentage_24h.toFixed(2)}%
            </p>
            <div className="mt-3 flex gap-2">
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Target price"
                    className="bg-gray-700 px-2 py-1 rounded w-full"
                />
                <button
                    onClick={() =>
                        onAddAlert({ id: crypto.id, name: crypto.name }, parseFloat(price))
                    }
                    className="bg-blue-600 px-3 py-1 rounded whitespace-nowrap"
                >
                    Set Alert
                </button>
            </div>
        </div>
    );
};

export default CryptoCard;