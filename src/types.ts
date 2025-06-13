export interface Alert {
    id: string;
    cryptoId: string;
    cryptoName: string;
    targetPrice: number;
    isAbove: boolean;
    isActive: boolean;
}
