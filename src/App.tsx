import { useState, useEffect } from 'react'
import HomePage from "./components/HomePage"
import ErrorPage from "./components/ErrorPage"
import { Dashboard } from './components/dashboard/Dashboard';

import "@rainbow-me/rainbowkit/styles.css";
import GlobalAOSProvider from "./GlobalAOSProvider/GlobalAOSProvider";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { type Chain } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Konfigurasi Chain Monad Testnet
const monadTestnet: Chain = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MON",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz/"],
    },
    public: {
      http: ["https://testnet-rpc.monad.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "MonadScan",
      url: "https://testnet.monadexplorer.com",
    },
  },
  testnet: true,
};

// eslint-disable-next-line react-refresh/only-export-components
export const config = getDefaultConfig({
  appName: "Fund Ur Memory",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [monadTestnet],
  ssr: true,
});

function App() {
  const queryClient = new QueryClient();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Listen for browser navigation (back/forward buttons)
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Simple routing logic
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/dashboard':
        return <Dashboard userAddress={''} onDisconnect={function (): void {
          throw new Error('Function not implemented.');
        } } />;
      default:
        return <ErrorPage />;
    }
  };

  return (
    <GlobalAOSProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <div className="index_ico page_wrapper">
              {renderPage()}
            </div>
            <Toaster position="top-center" />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </GlobalAOSProvider>
  );
}

export default App;