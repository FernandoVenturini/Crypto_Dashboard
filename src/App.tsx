import React, { useState, useEffect } from "react";
import { fetchCryptos } from "./services/api";
import { Crypto } from "./types/crypto";
import CryptoCard from "./components/CryptoCard";
import useAlerts from "./hooks/useAlerts";

// Importações opcionais do Toast (comentadas por padrão)
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// Definindo o tipo Alert localmente (caso não esteja em types/crypto)
type Alert = {
  id: string;
  cryptoId: string;
  cryptoName: string;
  targetPrice: number;
  isAbove: boolean;
  isActive: boolean;
};

function App() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { alerts: userAlerts, addAlert, removeAlert } = useAlerts();

  // Função adaptadora para o CryptoCard
  const handleAddAlert = (
    crypto: { id: string; name: string },
    price: number
  ) => {
    addAlert(crypto, price, true); // true = alerta para preço acima
  };

  // Busca os dados das criptomoedas
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchCryptos();
        setCryptos(response.data);
      } catch (err) {
        setError("Failed to fetch cryptocurrency data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Atualiza os dados a cada 60 segundos
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Verifica alertas periodicamente
  useEffect(() => {
    const checkAlerts = () => {
      userAlerts.forEach((alert: Alert) => {
        if (!alert.isActive) return;

        const crypto = cryptos.find((c) => c.id === alert.cryptoId);
        if (!crypto) return;

        const isTriggered = alert.isAbove
          ? crypto.current_price >= alert.targetPrice
          : crypto.current_price <= alert.targetPrice;

        if (isTriggered) {
          // Usando alert padrão do navegador (substitua por toast se quiser)
          window.alert(
            `🚨 ALERT: ${alert.cryptoName} is now ${
              alert.isAbove ? "above" : "below"
            } $${alert.targetPrice}`
          );
        }
      });
    };

    const alertInterval = setInterval(checkAlerts, 30000); // Verifica a cada 30 segundos
    return () => clearInterval(alertInterval);
  }, [userAlerts, cryptos]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading cryptocurrency data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      {/* <ToastContainer position="top-right" autoClose={5000} /> */}

      <header className="mb-8">
        <h1 className="text-3xl font-bold">Crypto Dashboard</h1>
        <p className="text-gray-400">
          Real-time cryptocurrency prices and alerts
        </p>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Cryptocurrencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cryptos.map((crypto) => (
              <CryptoCard
                key={crypto.id}
                crypto={crypto}
                onAddAlert={handleAddAlert}
              />
            ))}
          </div>
        </section>

        <section className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Alerts</h2>
            <span className="text-sm text-gray-400">
              {userAlerts.filter((a: Alert) => a.isActive).length} active
            </span>
          </div>

          {userAlerts.length === 0 ? (
            <p className="text-gray-400">No alerts set yet</p>
          ) : (
            <ul className="space-y-2">
              {userAlerts.map((alert: Alert) => (
                <li
                  key={alert.id}
                  className={`p-3 rounded-md flex justify-between items-center ${
                    alert.isActive ? "bg-gray-700" : "bg-gray-900 text-gray-500"
                  }`}
                >
                  <div>
                    <span className="font-medium">{alert.cryptoName}</span>
                    <span className="mx-2">-</span>
                    <span>
                      {alert.isAbove ? "Above" : "Below"} $
                      {alert.targetPrice.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Data provided by CoinGecko API</p>
        <p className="mt-1">Prices update every minute</p>
      </footer>
    </div>
  );
}

export default App; 