import {
  Connection,
  PublicKey,
  Transaction,
  Keypair,
  sendAndConfirmTransaction,
  TransactionInstruction,
} from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Constants
const PROGRAM_ID = 'BankAssuranceProgramId123456789abcdef'; // Replace with actual deployed program ID

// Instruction types
enum BankAssuranceInstructions {
  CREATE_PROFILE = 0,
  PURCHASE_POLICY = 1,
  FILE_CLAIM = 2,
  PROCESS_CLAIM = 3,
  MAKE_PAYMENT = 4,
}

/**
 * Load a keypair from a file
 */
function loadKeypair(filePath: string): Keypair {
  const keypairData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return Keypair.fromSecretKey(new Uint8Array(keypairData));
}

/**
 * Create a profile instruction
 */
async function createProfileInstruction(
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

  // Create instruction data
  const data = Buffer.alloc(1 + 64 + 64); // 1 byte for instruction type + 64 for name + 64 for email
  data.writeUInt8(BankAssuranceInstructions.CREATE_PROFILE, 0);

  // Write name and email (padded to fixed length)
  const nameBuffer = Buffer.from(name.padEnd(64).slice(0, 64));
  const emailBuffer = Buffer.from(email.padEnd(64).slice(0, 64));
  nameBuffer.copy(data, 1);
  emailBuffer.copy(data, 65);

  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: profilePDA, isSigner: false, isWritable: true },
      { pubkey: PublicKey.default, isSigner: false, isWritable: false }, // System program
    ],
    programId,
    data,
  });
}

/**
 * Purchase a policy instruction
 */
async function purchasePolicyInstruction(
  programId: PublicKey,
  payer: PublicKey,
  productId: string,
  coverageAmount: number,
  premium: number,
  durationInMonths: number
): Promise<TransactionInstruction> {
  // Generate a policy ID
  const policyId = Keypair.generate().publicKey.toString();
  
  // Create a PDA for the policy
  const [policyPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('policy'), Buffer.from(policyId)],
    programId
  );

  // Create instruction data
  const data = Buffer.alloc(1 + 32 + 8 + 8 + 4);
  
  // Write instruction type
  data.writeUInt8(BankAssuranceInstructions.PURCHASE_POLICY, 0);
  
  // Write product ID
  Buffer.from(productId.padEnd(32).slice(0, 32)).copy(data, 1);
  
  // Write coverage amount and premium as 64-bit floats
  data.writeDoubleLE(coverageAmount, 33);
  data.writeDoubleLE(premium, 41);
  
  // Write duration in months
  data.writeUInt32LE(durationInMonths, 49);

  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: policyPDA, isSigner: false, isWritable: true },
      { pubkey: PublicKey.default, isSigner: false, isWritable: false }, // System program
    ],
    programId,
    data,
  });
}

/**
 * File a claim instruction
 */
async function fileClaimInstruction(
  programId: PublicKey,
  payer: PublicKey,
  policyId: string,
  amount: number,
  description: string
): Promise<TransactionInstruction> {
  // Generate a claim ID
  const claimId = Keypair.generate().publicKey.toString();
  
  // Create PDAs for the policy and claim
  const [policyPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('policy'), Buffer.from(policyId)],
    programId
  );
  
  const [claimPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('claim'), Buffer.from(claimId)],
    programId
  );

  // Create instruction data
  const data = Buffer.alloc(1 + 8 + 128);
  
  // Write instruction type
  data.writeUInt8(BankAssuranceInstructions.FILE_CLAIM, 0);
  
  // Write claim amount
  data.writeDoubleLE(amount, 1);
  
  // Write description
  Buffer.from(description.padEnd(128).slice(0, 128)).copy(data, 9);

  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: policyPDA, isSigner: false, isWritable: true },
      { pubkey: claimPDA, isSigner: false, isWritable: true },
      { pubkey: PublicKey.default, isSigner: false, isWritable: false }, // System program
    ],
    programId,
    data,
  });
}

/**
 * Make a payment instruction
 */
async function makePaymentInstruction(
  programId: PublicKey,
  payer: PublicKey,
  policyId: string,
  amount: number
): Promise<TransactionInstruction> {
  // Create a PDA for the policy
  const [policyPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('policy'), Buffer.from(policyId)],
    programId
  );

  // Create instruction data
  const data = Buffer.alloc(1 + 8);
  
  // Write instruction type
  data.writeUInt8(BankAssuranceInstructions.MAKE_PAYMENT, 0);
  
  // Write payment amount
  data.writeDoubleLE(amount, 1);

  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: policyPDA, isSigner: false, isWritable: true },
      { pubkey: PublicKey.default, isSigner: false, isWritable: false }, // System program
    ],
    programId,
    data,
  });
}

/**
 * Main function to run client actions
 */
async function main() {
  // Load environment variables
  const rpcUrl = process.env.RPC_URL || 'https://api.devnet.solana.com';
  const keypairPath = process.env.KEYPAIR_PATH || path.join(os.homedir(), '.config/solana/id.json');
  
  // Connect to cluster
  const connection = new Connection(rpcUrl, 'confirmed');
  
  // Load payer keypair
  const payer = loadKeypair(keypairPath);
  console.log('Using keypair:', payer.publicKey.toString());
  
  // Get program ID
  const programId = new PublicKey(PROGRAM_ID);
  
  // Example: Create a user profile
  const createProfileTx = await createProfileInstruction(
    programId,
    payer.publicKey,
    'John Doe',
    'john.doe@example.com'
  );
  
  // Send and confirm transaction
  try {
    const txSignature = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(createProfileTx),
      [payer]
    );
    console.log('Transaction signature:', txSignature);
    console.log('Profile created successfully!');
  } catch (error) {
    console.error('Error creating profile:', error);
  }
}

// Run the main function
if (require.main === module) {
  main().then(
    () => process.exit(0),
    (err) => {
      console.error(err);
      process.exit(1);
    }
  );
} 