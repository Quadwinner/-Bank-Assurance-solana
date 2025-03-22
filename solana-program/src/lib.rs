// This is a mock Solana program for the Bank-Assurance DApp
// In a real implementation, this would be properly deployed to the Solana blockchain

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};

// Define the program's entrypoint
entrypoint!(process_instruction);  

// Instruction types for our program
enum BankAssuranceInstructions {
    CreateProfile = 0,
    PurchasePolicy = 1,
    FileClaim = 2,
    ProcessClaim = 3,
    MakePayment = 4,
}

// User profile data structure
#[derive(Debug)]
struct UserProfile {
    pub name: String,
    pub email: String,
    pub active: bool,
}

// Policy data structure
#[derive(Debug)]
struct Policy {
    pub id: String,
    pub holder: Pubkey,
    pub product_id: String,
    pub coverage_amount: f64,
    pub premium: f64,
    pub start_date: u64,
    pub end_date: u64,
    pub active: bool,
}

// Claim data structure
#[derive(Debug)]
struct Claim {
    pub id: String,
    pub policy_id: String,
    pub amount: f64,
    pub description: String,
    pub timestamp: u64,
    pub status: ClaimStatus,
}

// Claim status enum
#[derive(Debug, PartialEq)]
enum ClaimStatus {
    Pending,
    Approved,
    Rejected,
}

// Main program logic
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Parse the instruction type from the first byte
    let instruction_type = instruction_data
        .get(0)
        .ok_or(ProgramError::InvalidInstructionData)?;

    match instruction_type {
        0 => process_create_profile(program_id, accounts, &instruction_data[1..]),
        1 => process_purchase_policy(program_id, accounts, &instruction_data[1..]),
        2 => process_file_claim(program_id, accounts, &instruction_data[1..]),
        3 => process_process_claim(program_id, accounts, &instruction_data[1..]),
        4 => process_make_payment(program_id, accounts, &instruction_data[1..]),
        _ => {
            msg!("Unsupported instruction type");
            Err(ProgramError::InvalidInstructionData)
        }
    }
}

// Process create profile instruction
fn process_create_profile(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    // Get required accounts
    let payer_account = next_account_info(accounts_iter)?;
    let profile_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    
    // Verify account permissions
    if !payer_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Parse name and email from instruction data
    // In a real implementation, proper serialization/deserialization would be used
    if data.len() < 128 {
        return Err(ProgramError::InvalidInstructionData);
    }
    
    let name = String::from_utf8_lossy(&data[0..64]).trim_end_matches('\0').to_string();
    let email = String::from_utf8_lossy(&data[64..128]).trim_end_matches('\0').to_string();
    
    // Create profile data
    let profile = UserProfile {
        name,
        email,
        active: true,
    };
    
    msg!("Created profile for {}", profile.name);
    
    // In a real implementation, this data would be serialized and stored in the profile_account
    
    Ok(())
}

// Process purchase policy instruction
fn process_purchase_policy(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    // Get required accounts
    let payer_account = next_account_info(accounts_iter)?;
    let policy_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    
    // Verify account permissions
    if !payer_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Parse policy data from instruction data
    if data.len() < 52 {  // 32 for product_id + 8 for coverage + 8 for premium + 4 for duration
        return Err(ProgramError::InvalidInstructionData);
    }
    
    let product_id = String::from_utf8_lossy(&data[0..32]).trim_end_matches('\0').to_string();
    
    // In a real implementation, proper serialization/deserialization would be used
    // Here we're directly reading bytes for demonstration
    let mut coverage_bytes = [0u8; 8];
    coverage_bytes.copy_from_slice(&data[32..40]);
    let coverage_amount = f64::from_le_bytes(coverage_bytes);
    
    let mut premium_bytes = [0u8; 8];
    premium_bytes.copy_from_slice(&data[40..48]);
    let premium = f64::from_le_bytes(premium_bytes);
    
    let mut duration_bytes = [0u8; 4];
    duration_bytes.copy_from_slice(&data[48..52]);
    let duration_months = u32::from_le_bytes(duration_bytes);
    
    // Current timestamp (in a real implementation, this would be the current Solana slot)
    let now = 0; // Placeholder
    
    // Create policy data
    let policy = Policy {
        id: "policy_id".to_string(), // In a real implementation, this would be derived or generated
        holder: *payer_account.key,
        product_id,
        coverage_amount,
        premium,
        start_date: now,
        end_date: now + (duration_months as u64 * 30 * 24 * 60 * 60), // Approximate months to seconds
        active: true,
    };
    
    msg!("Created policy for product {}", policy.product_id);
    
    // In a real implementation, this data would be serialized and stored in the policy_account
    
    Ok(())
}

// Process file claim instruction
fn process_file_claim(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    // Get required accounts
    let payer_account = next_account_info(accounts_iter)?;
    let policy_account = next_account_info(accounts_iter)?;
    let claim_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    
    // Verify account permissions
    if !payer_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Parse claim data from instruction data
    if data.len() < 137 {  // 8 for amount + 128 for description + 1 for status
        return Err(ProgramError::InvalidInstructionData);
    }
    
    let mut amount_bytes = [0u8; 8];
    amount_bytes.copy_from_slice(&data[0..8]);
    let amount = f64::from_le_bytes(amount_bytes);
    
    let description = String::from_utf8_lossy(&data[8..136]).trim_end_matches('\0').to_string();
    
    // Current timestamp (in a real implementation, this would be the current Solana slot)
    let now = 0; // Placeholder
    
    // Create claim data
    let claim = Claim {
        id: "claim_id".to_string(), // In a real implementation, this would be derived or generated
        policy_id: "policy_id".to_string(), // In a real implementation, this would be derived from the policy account
        amount,
        description,
        timestamp: now,
        status: ClaimStatus::Pending,
    };
    
    msg!("Filed claim for amount {}", claim.amount);
    
    // In a real implementation, this data would be serialized and stored in the claim_account
    
    Ok(())
}

// Process claim processing instruction (approve/reject)
fn process_process_claim(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    // Get required accounts
    let authority_account = next_account_info(accounts_iter)?;
    let claim_account = next_account_info(accounts_iter)?;
    
    // Verify account permissions
    if !authority_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // In a real implementation, verify that authority has permission to process claims
    
    // Parse the approval status
    if data.is_empty() {
        return Err(ProgramError::InvalidInstructionData);
    }
    
    let approved = data[0] > 0;
    
    // Update claim status
    // In a real implementation, this would involve:
    // 1. Deserialize the claim data from the claim_account
    // 2. Update the status
    // 3. Reserialize and save back to the claim_account
    
    msg!("Claim {} {}", 
        "claim_id", // Placeholder
        if approved { "approved" } else { "rejected" }
    );
    
    Ok(())
}

// Process premium payment instruction
fn process_make_payment(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    // Get required accounts
    let payer_account = next_account_info(accounts_iter)?;
    let policy_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    
    // Verify account permissions
    if !payer_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Parse payment amount
    if data.len() < 8 {
        return Err(ProgramError::InvalidInstructionData);
    }
    
    let mut amount_bytes = [0u8; 8];
    amount_bytes.copy_from_slice(&data[0..8]);
    let amount = f64::from_le_bytes(amount_bytes);
    
    // In a real implementation:
    // 1. Deserialize policy data from policy_account
    // 2. Update payment status/history
    // 3. Transfer funds
    // 4. Reserialize and save policy data
    
    msg!("Payment of {} processed for policy", amount);
    
    Ok(())
}

// In a real implementation, tests would be included
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_profile() {
        // Tests would go here
    }
} 