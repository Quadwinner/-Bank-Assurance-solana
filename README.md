# Bank-Assurance DApp on Solana

A decentralized application for bank-assurance on the Solana blockchain, facilitating onboarding and premium payments between insurance companies and banks while improving transparency and productivity in the industry.

## Features

- **Decentralized Exchange for Insurance Products**: Insurance companies can list their products with detailed terms and conditions, while banks can search for suitable products for their customers.
- **User Onboarding & Identity Verification**: Secure onboarding with decentralized identity solutions (DIDs) and verifiable credentials for KYC compliance.
- **Smart Contracts for Policy Management**: Automated policy lifecycle management including premium payments, claim processing, renewals, and dispute resolution.
- **Premium Payments via Solana**: Fast, low-cost premium payments using the Solana blockchain.
- **Transparency & Auditability**: Immutable ledger for all transactions, claims, and payouts, allowing real-time tracking of payment flows and policy status.
- **Integration with Banking Systems**: APIs to connect with KYC/AML systems and traditional banking infrastructure.
- **Secure Data Storage**: All policy data, customer information, and claim history are securely stored on the Solana blockchain.

## Tech Stack

- **Frontend**: React.js, Next.js, Material UI
- **Blockchain**: Solana (web3.js, SPL-tokens)
- **Identity**: DIDs and Verifiable Credentials
- **Data Serialization**: Borsh

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/bank-assurance-dapp.git
   cd bank-assurance-dapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## User Roles

### Insurance Companies
- List insurance products on the DEX
- Manage policy issuance and claims processing through smart contracts
- Access real-time data on policy performance and customer behavior

### Banks
- Search for and select suitable insurance products for their customers
- Onboard customers and facilitate policy purchases
- Manage customer policies and process claims

### Customers
- View available insurance products through the bank's platform
- Apply for and purchase insurance policies online
- Make premium payments directly to the insurance company through the DApp
- File and track insurance claims

## Project Structure

- `/src/components` - UI components
- `/src/contracts` - Solana contract interfaces
- `/src/pages` - Next.js pages
- `/src/utils` - Utility functions and services
- `/src/styles` - CSS and styling files

## Development Roadmap

- **Phase 1**: Core platform with DEX, user onboarding, and basic policy management
- **Phase 2**: Claims processing and premium payments
- **Phase 3**: Integration with banking systems and analytics dashboard
- **Phase 4**: Mobile applications and enhanced security features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgements

- Solana Foundation for blockchain infrastructure
- Material UI for the UI components
- Next.js team for the React framework # -Bank-Assurance-solana
