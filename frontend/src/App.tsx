import React, { useState } from 'react';
import './App.css';

import {
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { WagmiConfig } from "wagmi";
import { wagmiClient, chains } from "./hooks/wagmi";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from './pages/home'
import Market from './pages/market'


const queryClient = new QueryClient()

function App() {
  const [theme,] = useState('dark')

  return (
    <WagmiConfig client={wagmiClient}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={chains}
          theme={
            theme === "dark"
              ? rainbowDarkTheme({ accentColor: "#676B74" })
              : rainbowLightTheme({ accentColor: "#E0E2E3", accentColorForeground: "#181A1D" })
          }
        >
          <div className="App">
            <div className='container mx-auto'>
              <BrowserRouter>
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path="market" element={<Market />} />
                </Routes>
              </BrowserRouter>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>

  );
}

export default App;
