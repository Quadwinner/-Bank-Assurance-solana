import { Connection, Keypair, PublicKey } from '@solana/web3.js';

export interface WalletAdapter {
  publicKey: PublicKey | null;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions: (transactions: any[]) => Promise<any[]>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
}

// Mock implementation of the wallet adapter for development
export class DevWalletAdapter implements WalletAdapter {
  private _keypair: Keypair;
  private _connected: boolean = false;

  constructor() {
    // For development, we generate a new keypair
    this._keypair = Keypair.generate();
  }

  get publicKey(): PublicKey | null {
    if (!this._connected) return null;
    return this._keypair.publicKey;
  }

  get isConnected(): boolean {
    return this._connected;
  }

  async signTransaction(transaction: any): Promise<any> {
    if (!this._connected) throw new Error('Wallet not connected');
    
    transaction.partialSign(this._keypair);
    return transaction;
  }

  async signAllTransactions(transactions: any[]): Promise<any[]> {
    if (!this._connected) throw new Error('Wallet not connected');
    
    return transactions.map(tx => {
      tx.partialSign(this._keypair);
      return tx;
    });
  }

  async connect(): Promise<void> {
    this._connected = true;
    console.log('Wallet connected:', this._keypair.publicKey.toString());
  }

  async disconnect(): Promise<void> {
    this._connected = false;
    console.log('Wallet disconnected');
  }

  // Helper to get the keypair (only for development)
  getKeypair(): Keypair {
    return this._keypair;
  }
}

// Function to get a connection to Solana
export function getSolanaConnection(network: 'devnet' | 'testnet' | 'mainnet-beta' = 'devnet'): Connection {
  const endpoint = 
    network === 'devnet' 
      ? 'https://api.devnet.solana.com' 
      : network === 'testnet'
        ? 'https://api.testnet.solana.com'
        : 'https://api.mainnet-beta.solana.com';
  
  return new Connection(endpoint, 'confirmed');
}

// Global wallet instance for the app
export const wallet = new DevWalletAdapter(); 