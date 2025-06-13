export interface Crypto {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    image: string;
}

export interface Alert {
    id: string;
    cryptoId: string;
    cryptoName: string;
    targetPrice: number;
    isAbove: boolean;
    isActive: boolean;
}
