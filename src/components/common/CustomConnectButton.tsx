// src/components/common/CustomConnectButton.tsx
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import '../../styles/header-compact.css'

export const CustomConnectButton: React.FC = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="custom-connect-wallet"
                  >
                    <div className="btn_wrapper">
                      <span style={{ fontSize: '14px' }}>🔗</span>
                      <span>Connect Wallet</span>
                    </div>
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="custom-connect-wallet wrong-network"
                  >
                    <div className="btn_wrapper">
                      <span style={{ fontSize: '14px' }}>⚠️</span>
                      <span>Wrong network</span>
                    </div>
                  </button>
                )
              }

              return (
                <div className="wallet-components-group">
                  {/* Chain Selector Button */}
                  <button
                    onClick={openChainModal}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      minWidth: 'auto',
                      height: '32px'
                    }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    <span style={{ whiteSpace: 'nowrap' }}>{chain.name}</span>
                  </button>

                  {/* Balance Badge */}
                  {account.displayBalance && (
                    <div
                      style={{
                        background: 'linear-gradient(90deg, #9a4497, #6f42c1)',
                        border: '1px solid rgba(154, 68, 151, 0.3)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#ffffff',
                        boxShadow: '0 2px 8px rgba(154, 68, 151, 0.2)',
                        backdropFilter: 'blur(10px)',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        minWidth: 'auto'
                      }}
                    >
                      {account.displayBalance}
                    </div>
                  )}

                  {/* Wallet Button - ico_creative_btn style */}
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="ico_creative_btn wallet-connected"
                    style={{
                      whiteSpace: 'nowrap',
                      minWidth: 'auto',
                      height: '32px'
                    }}
                  >
                    <div className="btn_wrapper" style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%'
                    }}>
                      <span style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        letterSpacing: '0.5px'
                      }}>
                        {account.address ?
                          `${account.address.slice(0, 6)}...${account.address.slice(-4)}` :
                          account.displayName
                        }
                      </span>
                    </div>
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
