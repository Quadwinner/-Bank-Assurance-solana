import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { getSolanaConnection } from './wallet';
import { PhantomWalletAdapter } from './phantomWallet';
import { mockUserProfiles, UserProfile } from './mockData';

// State interface
interface AppState {
  connection: Connection;
  programId: string;
  wallet: PhantomWalletAdapter | null;
  userProfile: UserProfile | null;
  isWalletConnected: boolean;
  isLoading: boolean;
  error: string | null;
  isPhantomInstalled: boolean;
}

// Context interface
interface AppContextProps extends AppState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  setUserProfile: (profile: UserProfile) => void;
  refreshData: () => Promise<void>;
}

// Create context
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Program ID - this would typically be the deployed Solana program
const PROGRAM_ID = 'BankAssuranceProgramId123456789abcdef';

// Provider component
export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    connection: getSolanaConnection('devnet'),
    programId: PROGRAM_ID,
    wallet: null,
    userProfile: null,
    isWalletConnected: false,
    isLoading: true,
    error: null,
    isPhantomInstalled: false,
  });

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  // Initialize app function
  const initializeApp = async () => {
    try {
      // Create Phantom wallet adapter
      const phantomAdapter = new PhantomWalletAdapter();
      const isPhantomInstalled = phantomAdapter.isPhantomInstalled();
      
      // Check if already connected - FIX: using isConnected as a property, not a method
      const isConnected = isPhantomInstalled && phantomAdapter.isConnected;
      let userProfile = null;

      // If already connected, get or create profile
      if (isConnected && phantomAdapter.publicKey) {
        // In a real app, you would fetch the user profile from blockchain
        // For demo, use a mock profile
        userProfile = mockUserProfiles[0];
      }

      // Update state
      setState(prevState => ({
        ...prevState,
        wallet: phantomAdapter,
        isWalletConnected: isConnected,
        isPhantomInstalled,
        userProfile,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error initializing app:', error);
      setState(prevState => ({
        ...prevState,
        error: 'Failed to initialize app: ' + (error instanceof Error ? error.message : String(error)),
        isLoading: false
      }));
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true }));
      
      // First check if wallet is initialized, if not, initialize it
      if (!state.wallet) {
        const phantomAdapter = new PhantomWalletAdapter();
        setState(prevState => ({ 
          ...prevState, 
          wallet: phantomAdapter,
          isPhantomInstalled: phantomAdapter.isPhantomInstalled()
        }));
        
        // Wait a moment to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Now use the adapter directly since state might not be updated yet
        if (phantomAdapter.isPhantomInstalled()) {
          await phantomAdapter.connect();
          
          // For demo purposes, use a mock user profile
          const mockProfile = mockUserProfiles[0];
          
          setState(prevState => ({
            ...prevState,
            wallet: phantomAdapter,
            isWalletConnected: true,
            userProfile: mockProfile,
            isLoading: false
          }));
          return;
        } else {
          throw new Error('Phantom wallet is not installed');
        }
      }
      
      // If wallet is already initialized, just connect
      await state.wallet.connect();
      
      // For demo purposes, use a mock user profile
      const mockProfile = mockUserProfiles[0];
      
      setState(prevState => ({
        ...prevState,
        isWalletConnected: true,
        userProfile: mockProfile,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setState(prevState => ({
        ...prevState,
        error: 'Failed to connect wallet: ' + (error instanceof Error ? error.message : String(error)),
        isLoading: false
      }));
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true }));
      
      if (!state.wallet) {
        throw new Error('Wallet adapter not initialized');
      }
      
      await state.wallet.disconnect();
      
      setState(prevState => ({
        ...prevState,
        isWalletConnected: false,
        userProfile: null,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setState(prevState => ({
        ...prevState,
        error: 'Failed to disconnect wallet',
        isLoading: false
      }));
    }
  };

  // Set user profile function
  const setUserProfile = (profile: UserProfile) => {
    setState(prevState => ({
      ...prevState,
      userProfile: profile
    }));
  };

  // Refresh data function
  const refreshData = async () => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true }));
      
      // In a real app, this would refresh data from the blockchain
      // For now, just re-initialize the app
      await initializeApp();
      
      setState(prevState => ({
        ...prevState,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error refreshing data:', error);
      setState(prevState => ({
        ...prevState,
        error: 'Failed to refresh data',
        isLoading: false
      }));
    }
  };

  // Context value
  const contextValue: AppContextProps = {
    ...state,
    connectWallet,
    disconnectWallet,
    setUserProfile,
    refreshData
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 