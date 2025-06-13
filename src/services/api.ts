import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const fetchCryptos = () => axios.get(`${API_URL}/cryptos`);
export const fetchCryptoHistory = (id: string) =>
    axios.get(`${API_URL}/cryptos/${id}/history`);
