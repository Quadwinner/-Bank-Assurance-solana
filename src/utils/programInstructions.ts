import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
  Keypair,
} from '@solana/web3.js';
import { Buffer } from 'buffer';

// Instruction types for our program
export enum BankAssuranceInstructions {
  CREATE_PROFILE = 0,
  PURCHASE_POLICY = 1,
  FILE_CLAIM = 2,
  PROCESS_CLAIM = 3,
  MAKE_PAYMENT = 4,
}

// Interface for policy data
export interface PolicyData {
  id: string;
  holder: PublicKey;
  productId: string;
  coverageAmount: number;
  premium: number;
  startDate: number;
  endDate: number;
  active: boolean;
}

// Interface for claim data
export interface ClaimData {
  id: string;
  policyId: string;
  amount: number;
  description: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * Create a transaction instruction to create a user profile
 */
export async function createProfileInstruction(
  programId: PublicKey,
  payer: PublicKey,
  name: string,
  email: string
): Promise<TransactionInstruction> {
  // Create a program derived address (PDA) for the user profile
  const [profilePDA] = await PublicKey.findProgramAddress(
    [Buffer.from('profile'), payer.toBuffer()],
    programId
  );

  // Instruction data: instruction type + profile data
  const data = Buffer.alloc(1 + 64 + 64); // 1 byte for instruction + 64 for name + 64 for email
  data.writeUInt8(BankAssuranceInstructions.CREATE_PROFILE, 0);
  
  // Write name and email to buffer
  const nameBuffer = Buffer.from(name.padEnd(64).slice(0, 64));
  const emailBuffer = Buffer.from(email.padEnd(64).slice(0, 64));
  nameBuffer.copy(data, 1);
  emailBuffer.copy(data, 65);

  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: profilePDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    programId,
    data
  });
}

/**
 * Create a transaction instruction to purchase an insurance policy
 */
export async function purchasePolicyInstruction(
  programId: PublicKey,
  payer: PublicKey,
  productId: string,
  coverageAmount: number,
  premium: number,
  durationInMonths: number
): Promise<TransactionInstruction> {
  // Create a shorter ID as seed (max seed length in Solana is 32 bytes)
  // Using the first 8 characters of a randomly generated key
  const shortId = Keypair.generate().publicKey.toString().substring(0, 8);
  
  // Create a PDA for the policy with shorter seed
  const [policyPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('policy'), Buffer.from(shortId)],
    programId
  );

  // Instruction data
  const data = Buffer.alloc(1 + 32 + 8 + 8 + 4);
  
  // Write instruction type
  data.writeUInt8(BankAssuranceInstructions.PURCHASE_POLICY, 0);
  
  // Write product ID (as bytes)
  Buffer.from(productId.padEnd(32).slice(0, 32)).copy(data, 1);
  
  // Write coverage amount and premium (as 64-bit floats)
  data.writeDoubleLE(coverageAmount, 33);
  data.writeDoubleLE(premium, 41);
  
  // Write duration in months (as 32-bit int)
  data.writeUInt32LE(durationInMonths, 49);

  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: policyPDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    programId,
    data
  });
}

/**
 * Create a transaction instruction to file a claim
 */
export async function fileClaimInstruction(
  programId: PublicKey,
  payer: PublicKey,
  policyId: string,
  amount: number,
  description: string
): Promise<TransactionInstruction> {
  // Create a shorter ID as seed (max seed length in Solana is 32 bytes)
  const shortClaimId = Keypair.generate().publicKey.toString().substring(0, 8);
  
  // Create a PDA for the claim with shorter seed
  const [claimPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('claim'), Buffer.from(shortClaimId)],
    programId
  );

  // Use a shorter policyId if necessary
  const shortPolicyId = policyId.length > 32 ? policyId.substring(0, 32) : policyId;
  
  // Get the policy PDA as well
  const [policyPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('policy'), Buffer.from(shortPolicyId)],
    programId
  );

  // Instruction data
  const data = Buffer.alloc(1 + 8 + 128);
  
  // Write instruction type
  data.writeUInt8(BankAssuranceInstructions.FILE_CLAIM, 0);
  
  // Write claim amount (as 64-bit float)
  data.writeDoubleLE(amount, 1);
  
  // Write description (truncated or padded to 128 bytes)
  Buffer.from(description.padEnd(128).slice(0, 128)).copy(data, 9);

  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: policyPDA, isSigner: false, isWritable: true },
      { pubkey: claimPDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    programId,
    data
  });
}

/**
 * Create a transaction instruction to make a premium payment
 */
export async function makePaymentInstruction(
  programId: PublicKey,
  payer: PublicKey,
  policyId: string,
  amount: number
): Promise<TransactionInstruction> {
  // Use a shorter policyId if necessary
  const shortPolicyId = policyId.length > 32 ? policyId.substring(0, 32) : policyId;
  
  // Get the policy PDA with shorter seed
  const [policyPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('policy'), Buffer.from(shortPolicyId)],
    programId
  );

  // Instruction data
  const data = Buffer.alloc(1 + 8);
  
  // Write instruction type
  data.writeUInt8(BankAssuranceInstructions.MAKE_PAYMENT, 0);
  
  // Write payment amount (as 64-bit float)
  data.writeDoubleLE(amount, 1);

  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: policyPDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    programId,
    data
  });
}

/**
 * Utility function to build and send a transaction
 */
export async function buildAndSendTransaction(
  connection: Connection,
  instructions: TransactionInstruction[],
  signers: Keypair[],
  feePayer: PublicKey
): Promise<string> {
  const transaction = new Transaction();
  
  // Add instructions to the transaction
  instructions.forEach(instruction => transaction.add(instruction));
  
  // Set the fee payer
  transaction.feePayer = feePayer;
  
  // Get the recent blockhash
  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  
  // Sign the transaction
  if (signers.length > 0) {
    transaction.sign(...signers);
  }
  
  // Send the transaction
  const signature = await connection.sendRawTransaction(transaction.serialize());
  await connection.confirmTransaction(signature, 'confirmed');
  
  return signature;
} 