import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { WalletAdapter } from './wallet';

export interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  request: (method: string, params: any) => Promise<any>;
}

export class PhantomWalletAdapter implements WalletAdapter {
  private _provider: PhantomProvider | undefined;
  private _connected: boolean = false;
  private _publicKey: PublicKey | null = null;

  constructor() {
    this.checkIfPhantomIsInstalled();
  }

  private checkIfPhantomIsInstalled(): void {
    if (typeof window !== 'undefined') {
      const provider = window.solana as PhantomProvider;
      if (provider?.isPhantom) {
        this._provider = provider;
        
        // Listen for connection events
        provider.on('connect', (publicKey: PublicKey) => {
          this._connected = true;
          this._publicKey = publicKey;
          console.log('Phantom connected:', publicKey.toString());
        });
        
        // Listen for disconnect events
        provider.on('disconnect', () => {
          this._connected = false;
          this._publicKey = null;
          console.log('Phantom disconnected');
        });
        
        // Check if already connected
        if (provider.isConnected && provider.publicKey) {
          this._connected = true;
          this._publicKey = provider.publicKey;
        }
      }
    }
  }

  get publicKey(): PublicKey | null {
    // Re-check the provider's publicKey to ensure it's current
    if (this._provider && this._provider.publicKey) {
      this._publicKey = this._provider.publicKey;
    }
    return this._publicKey;
  }

  get isConnected(): boolean {
    // Re-check the provider's connection status to ensure it's current
    if (this._provider) {
      this._connected = !!this._provider.isConnected;
    }
    return this._connected;
  }

  isPhantomInstalled(): boolean {
    return !!this._provider;
  }

  async connect(): Promise<void> {
    try {
      if (!this._provider) {
        console.warn('Phantom is not installed');
        throw new Error('Phantom is not installed');
      }

      // Check if already connected
      if (this._provider.isConnected && this._provider.publicKey) {
        this._connected = true;
        this._publicKey = this._provider.publicKey;
        return;
      }

      const { publicKey } = await this._provider.connect();
      this._connected = true;
      this._publicKey = publicKey;
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (!this._provider) {
        console.warn('Phantom is not installed');
        return;
      }
      
      if (!this._connected) {
        console.warn('Wallet not connected');
        return;
      }

      await this._provider.disconnect();
      this._connected = false;
      this._publicKey = null;
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error);
      throw error;
    }
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    if (!this._provider) {
      throw new Error('Phantom is not installed');
    }
    
    if (!this._connected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      return await this._provider.signTransaction(transaction);
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    if (!this._provider) {
      throw new Error('Phantom is not installed');
    }
    
    if (!this._connected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      return await this._provider.signAllTransactions(transactions);
    } catch (error) {
      console.error('Error signing all transactions:', error);
      throw error;
    }
  }
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

// Create a singleton instance
export const phantomWallet = new PhantomWalletAdapter(); 