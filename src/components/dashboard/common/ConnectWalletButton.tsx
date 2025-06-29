import React, { useState } from 'react'
import { Wallet, Loader } from 'lucide-react'

interface ConnectWalletButtonProps {
  onConnect: (address: string) => void
  className?: string
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ 
  onConnect, 
  className = '' 
}) => {
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet')
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      
      if (accounts.length > 0) {
        onConnect(accounts[0])
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      alert('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className={`px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 ${className}`}
    >
      {isConnecting ? (
        <>
          <Loader className="w-6 h-6 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="w-6 h-6" />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  )
}