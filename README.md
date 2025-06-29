# Cipher - Commitment Protocol Frontend

A sophisticated DeFi commitment contract platform frontend built with React, TypeScript, and modern Web3 technologies. Cipher enables investors to create commitment vaults with time-based and price-based unlock conditions, leveraging Chainlink price feeds, automation, and CCIP for cross-chain functionality.

## Overview

Cipher is a DeFi platform that helps users encode their commitment into secure vaults for specific time periods or price targets, promoting better investment discipline and long-term holding strategies. The platform integrates with Chainlink's ecosystem for reliable price feeds, automated execution, and cross-chain operations.

## Key Features

### Vault Creation & Management
- **Time-based Vaults**: Lock assets for specific durations (minutes, days, months, years)
- **Price-based Vaults**: Set unlock conditions based on token price targets (up/down)
- **Combo Vaults**: Combine time and price conditions with AND/OR logic
- **Custom Messages**: Add personal commitment messages to vaults
- **Auto-withdrawal**: Automatic fund release when conditions are met

### Cross-Chain Support
- **Multi-network**: Support for Avalanche, Ethereum, Base, and Monad
- **CCIP Integration**: Chainlink Cross-Chain Interoperability Protocol
- **Cross-chain Vault Creation**: Create vaults on different networks
- **Unified Interface**: Manage vaults across multiple chains

### Advanced Features
- **Emergency Withdrawals**: Early exit with 10% penalty (3-month claim delay)
- **Real-time Price Feeds**: Chainlink price oracles integration
- **Automated Execution**: Chainlink Automation for condition checking
- **Portfolio Analytics**: Comprehensive vault tracking and analytics
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

### Frontend Framework
- **React 19.1.0** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4.1.10** - Utility-first CSS framework

### Web3 Integration
- **Wagmi 2.15.6** - React hooks for Ethereum
- **Viem 2.31.4** - TypeScript interface for Ethereum
- **RainbowKit 2.2.8** - Wallet connection interface
- **TanStack Query 5.81.2** - Data fetching and caching

### UI/UX Libraries
- **Framer Motion 12.19.1** - Animation library
- **Lucide React 0.522.0** - Icon library
- **React Hot Toast 2.5.2** - Toast notifications
- **AOS 2.3.4** - Animate on scroll
- **Recharts 2.15.4** - Chart components
- **Swiper 11.2.8** - Touch slider

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite Plugin React** - React support for Vite

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- pnpm (preferred package manager)
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cipher-ui

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Optional: Add any environment variables here
VITE_COINGECKO_API_KEY=your_api_key_here
```

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint
```

## Project Structure

```
cipher-ui/
├── public/                 # Static assets
│   ├── images/            # Image assets
│   └── favicon.ico        # Site favicon
├── src/
│   ├── components/        # React components
│   │   ├── common/        # Shared components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── layout/        # Layout components
│   │   └── ui/           # UI components
│   ├── contracts/         # Smart contract interfaces
│   ├── hooks/            # Custom React hooks
│   │   ├── contracts/    # Contract interaction hooks
│   │   └── dashboard/    # Dashboard-specific hooks
│   ├── services/         # API services
│   ├── styles/           # CSS and styling files
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main application component
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## Smart Contract Integration

### Contract Configuration
The frontend integrates with the CipherVault smart contract deployed on Avalanche Fuji testnet:

```typescript
export const CIPHER_VAULT_CONFIG = {
  address: '0x7Aa2608EeA7679FA66196DECd78989Bb13DACD38',
  abi: CipherVaultABI,
  chainId: 43113, // Avalanche Fuji testnet
}
```

### Supported Networks
- **Avalanche Fuji** (Primary testnet)
- **Base Sepolia** (Cross-chain support)
- **Monad Testnet** (Cross-chain support)
- **Ethereum Sepolia** (Planned)

### Supported Tokens
- **AVAX** - Native Avalanche token
- **ETH** - Ethereum (coming soon)
- **MONAD** - Monad token (coming soon)

## Core Features

### Vault Types

#### 1. Time-Based Vaults
Lock your assets for a specific duration with granular time selection:
- **Minutes**: Short-term commitments
- **Days**: Daily discipline
- **Months**: Medium-term goals
- **Years**: Long-term investment strategy

#### 2. Price-Based Vaults
Set unlock conditions based on token price movements:
- **Price Up**: Unlock when token price increases to target
- **Price Down**: Unlock when token price decreases to target
- **Price Range**: Unlock when price hits either up or down target

#### 3. Combo Vaults
Combine time and price conditions:
- **Time AND Price**: Both conditions must be met
- **Time OR Price**: Either condition triggers unlock

### Vault Management

#### Creation Process
1. **Select Vault Type**: Choose time, price, or combo vault
2. **Set Parameters**: Configure unlock conditions
3. **Add Message**: Personal commitment message
4. **Deposit Funds**: Lock your assets
5. **Confirm Transaction**: Sign with your wallet

#### Monitoring & Analytics
- **Real-time Status**: Track vault conditions
- **Price Tracking**: Live price feeds from Chainlink
- **Portfolio Overview**: Comprehensive vault analytics
- **History Tracking**: Complete transaction history

#### Withdrawal Options
- **Automatic Release**: Funds released when conditions are met
- **Emergency Withdrawal**: Early exit with 10% penalty
- **Penalty Claims**: Claim penalty funds after 3-month delay

## Chainlink Integration

### Price Feeds
- **Real-time Data**: Accurate price information
- **Multiple Assets**: Support for various tokens
- **Reliable Sources**: Chainlink's decentralized oracles
- **Fast Updates**: 5-10 second price checking intervals

### Automation
- **Condition Monitoring**: Automated vault condition checking
- **Auto-execution**: Automatic fund release
- **Gas Optimization**: Efficient transaction execution
- **Reliable Uptime**: 24/7 monitoring

### Cross-Chain (CCIP)
- **Multi-network Support**: Create vaults across different chains
- **Secure Messaging**: Reliable cross-chain communication
- **Unified Experience**: Single interface for all networks
- **Fee Estimation**: Transparent cross-chain costs

## User Interface

### Design Philosophy
- **Clean & Modern**: Minimalist design approach
- **User-Centric**: Intuitive user experience
- **Responsive**: Works on all device sizes
- **Accessible**: WCAG compliance considerations

### Key Components

#### Dashboard
- **Portfolio Overview**: Complete vault summary
- **Quick Actions**: Easy access to common functions
- **Analytics Charts**: Visual data representation
- **Recent Activity**: Transaction history

#### Vault Creation Modal
- **Step-by-step Process**: Guided vault creation
- **Real-time Validation**: Input validation and feedback
- **Price Conversion**: USD to token conversion
- **Fee Estimation**: Transaction cost preview

#### Wallet Integration
- **Multiple Wallets**: MetaMask, WalletConnect, and more
- **Network Switching**: Automatic network detection
- **Balance Display**: Real-time balance updates
- **Transaction Status**: Live transaction tracking

## Development

### Code Structure

#### Components Architecture
```
components/
├── common/           # Reusable UI components
├── dashboard/        # Dashboard-specific components
├── layout/          # Layout and navigation
└── ui/              # Base UI components
```

#### Hooks Pattern
```
hooks/
├── contracts/       # Smart contract interactions
├── dashboard/       # Dashboard data management
└── demo/           # Demo and testing hooks
```

#### Services Layer
```
services/
├── api/            # External API integrations
├── coingecko.ts    # Price data service
└── indexerService.ts # Blockchain data indexing
```

### State Management
- **React Query**: Server state management
- **React Context**: Global app state
- **Local Storage**: Persistent user preferences
- **Wagmi**: Web3 state management

### Styling Approach
- **Tailwind CSS**: Utility-first styling
- **CSS Modules**: Component-scoped styles
- **Custom Properties**: Design system variables
- **Responsive Design**: Mobile-first approach

## Testing

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: Contract interaction testing
- **E2E Tests**: Full user flow testing
- **Manual Testing**: Cross-browser compatibility

### Test Commands
```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## Deployment

### Build Process
```bash
# Create production build
pnpm build

# Preview production build locally
pnpm preview
```

### Environment Configuration
```env
# Production environment variables
VITE_CIPHER_CONTRACT_ADDRESS=0x7Aa2608EeA7679FA66196DECd78989Bb13DACD38
VITE_CHAIN_ID=43113
VITE_COINGECKO_API_KEY=your_api_key
```

### Deployment Platforms
- **Vercel** (Recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **IPFS** (Decentralized hosting)

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message standards

### Pull Request Guidelines
- Clear description of changes
- Include relevant tests
- Update documentation if needed
- Follow existing code patterns

## Security Considerations

### Frontend Security
- **Input Validation**: All user inputs validated
- **XSS Prevention**: Proper data sanitization
- **HTTPS Only**: Secure communication
- **Wallet Security**: Secure wallet integration

### Smart Contract Integration
- **Read-only by Default**: Minimize write operations
- **Transaction Validation**: Verify all parameters
- **Error Handling**: Graceful failure management
- **Gas Estimation**: Prevent failed transactions

## Performance Optimization

### Bundle Optimization
- **Code Splitting**: Lazy loading of components
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Compressed images and fonts
- **Caching Strategy**: Efficient browser caching

### Runtime Performance
- **React Optimization**: Memoization and optimization
- **Web3 Efficiency**: Optimized contract calls
- **State Management**: Efficient data flow
- **Loading States**: Smooth user experience

## Troubleshooting

### Common Issues

#### Wallet Connection
- Ensure MetaMask is installed and unlocked
- Check network configuration
- Clear browser cache if needed
- Try different wallet providers

#### Transaction Failures
- Check gas fees and limits
- Verify contract address
- Ensure sufficient balance
- Check network status

#### Price Feed Issues
- Verify Chainlink oracle status
- Check network connectivity
- Refresh price data
- Contact support if persistent

### Support Resources
- **Documentation**: Comprehensive guides
- **Community**: Discord and Telegram
- **GitHub Issues**: Bug reports and features
- **Email Support**: Direct assistance

## Roadmap

### Phase 1 (Current)
- ✅ Basic vault creation
- ✅ Time-based vaults
- ✅ Price-based vaults
- ✅ Avalanche Fuji integration

### Phase 2 (In Progress)
- 🔄 Cross-chain functionality
- 🔄 Additional token support
- 🔄 Enhanced analytics
- 🔄 Mobile optimization

### Phase 3 (Planned)
- 📋 Mainnet deployment
- 📋 Advanced vault types
- 📋 Social features
- 📋 Governance integration

### Phase 4 (Future)
- 📋 AI-powered insights
- 📋 DeFi integrations
- 📋 NFT vault support
- 📋 Multi-signature vaults

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Chainlink** - For reliable oracle and automation services
- **Avalanche** - For fast and low-cost blockchain infrastructure
- **RainbowKit** - For excellent wallet connection UX
- **Viem & Wagmi** - For modern Web3 development tools
- **React & TypeScript** - For robust frontend development

## Contact

- **Website**: [Cipher Platform](https://your-domain.com)
- **GitHub**: [Repository](https://github.com/your-org/cipher-ui)
- **Discord**: [Community](https://discord.gg/your-invite)
- **Twitter**: [@CipherProtocol](https://twitter.com/cipherprotocol)
- **Email**: support@cipherprotocol.com

---

**Built with ❤️ for the DeFi community**
