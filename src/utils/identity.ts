import { PublicKey } from '@solana/web3.js';

// DID (Decentralized ID) structure
export interface DID {
  id: string;
  publicKey: string;
  createdAt: number;
  updatedAt: number;
  verifiedCredentials: VerifiableCredential[];
}

// VerifiableCredential structure
export interface VerifiableCredential {
  id: string;
  type: string; // KYC, AML, Income, etc.
  issuer: string;
  holder: string;
  issuanceDate: number;
  expirationDate: number | null;
  data: Record<string, any>;
  signature: string;
}

// User profile structure
export interface UserProfile {
  did: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'customer' | 'bank' | 'insurer' | 'admin';
  avatarUrl?: string;
  createdAt: number;
}

// Identity service
export class IdentityService {
  // Create a new DID for a user
  static createDID(publicKey: PublicKey): DID {
    const timestamp = Date.now();
    return {
      id: `did:sol:${publicKey.toString()}`,
      publicKey: publicKey.toString(),
      createdAt: timestamp,
      updatedAt: timestamp,
      verifiedCredentials: [],
    };
  }

  // Issue a new verifiable credential
  static issueCredential(
    issuerDid: string,
    holderDid: string,
    type: string,
    data: Record<string, any>,
    expirationDate: number | null = null
  ): VerifiableCredential {
    const timestamp = Date.now();
    // In a real implementation, we would cryptographically sign this credential
    // using the issuer's private key
    const mockSignature = `sig-${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      id: `vc:${Math.random().toString(36).substring(2, 15)}`,
      type,
      issuer: issuerDid,
      holder: holderDid,
      issuanceDate: timestamp,
      expirationDate,
      data,
      signature: mockSignature,
    };
  }

  // Verify a credential
  static verifyCredential(credential: VerifiableCredential): boolean {
    // In a real implementation, we would verify the credential's signature
    // using the issuer's public key
    
    // Check if expired
    if (credential.expirationDate && credential.expirationDate < Date.now()) {
      return false;
    }
    
    // For demo purposes, we'll just return true
    return true;
  }

  // Create a profile for a user
  static createUserProfile(
    did: string,
    name: string,
    email: string,
    phoneNumber: string,
    role: 'customer' | 'bank' | 'insurer' | 'admin'
  ): UserProfile {
    return {
      did,
      name,
      email,
      phoneNumber,
      role,
      createdAt: Date.now(),
    };
  }
}

// Mock data for development
export const MockIdentityData = {
  createMockInsurers: (): UserProfile[] => {
    return [
      {
        did: 'did:sol:insurer1',
        name: 'Global Insurance Co.',
        email: 'contact@globalinsurance.com',
        phoneNumber: '+1 (555) 123-4567',
        role: 'insurer',
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      },
      {
        did: 'did:sol:insurer2',
        name: 'SafeGuard Insurance',
        email: 'info@safeguard-insurance.com',
        phoneNumber: '+1 (555) 987-6543',
        role: 'insurer',
        createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
      },
    ];
  },

  createMockBanks: (): UserProfile[] => {
    return [
      {
        did: 'did:sol:bank1',
        name: 'First National Bank',
        email: 'support@fnb.com',
        phoneNumber: '+1 (555) 111-2222',
        role: 'bank',
        createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
      },
      {
        did: 'did:sol:bank2',
        name: 'City Trust Bank',
        email: 'info@citytrustbank.com',
        phoneNumber: '+1 (555) 333-4444',
        role: 'bank',
        createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
      },
    ];
  },

  createMockCustomers: (): UserProfile[] => {
    return [
      {
        did: 'did:sol:customer1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phoneNumber: '+1 (555) 555-5555',
        role: 'customer',
        createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
      },
      {
        did: 'did:sol:customer2',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phoneNumber: '+1 (555) 666-7777',
        role: 'customer',
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
      },
    ];
  },
}; 