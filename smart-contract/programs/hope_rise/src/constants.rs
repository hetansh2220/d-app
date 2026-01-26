/// Maximum length for campaign title
pub const MAX_TITLE_LENGTH: usize = 80;

/// Maximum length for campaign short description
pub const MAX_DESCRIPTION_LENGTH: usize = 200;

/// Maximum length for URL strings (IPFS hashes)
pub const MAX_URL_LENGTH: usize = 200;

/// Maximum length for milestone title
pub const MAX_MILESTONE_TITLE_LENGTH: usize = 100;

/// Maximum number of milestones per campaign
pub const MAX_MILESTONES_PER_CAMPAIGN: u8 = 10;

/// Minimum campaign duration in days
pub const MIN_CAMPAIGN_DURATION_DAYS: u64 = 1;

/// Maximum campaign duration in days
pub const MAX_CAMPAIGN_DURATION_DAYS: u64 = 90;

/// Seconds per day for deadline calculation
pub const SECONDS_PER_DAY: i64 = 86400;

/// PDA seed for campaign counter
pub const CAMPAIGN_COUNTER_SEED: &[u8] = b"campaign_counter";

/// PDA seed for campaign accounts
pub const CAMPAIGN_SEED: &[u8] = b"campaign";

/// PDA seed for milestone accounts
pub const MILESTONE_SEED: &[u8] = b"milestone";

/// PDA seed for contribution accounts
pub const CONTRIBUTION_SEED: &[u8] = b"contribution";

/// PDA seed for campaign vault (token account)
pub const CAMPAIGN_VAULT_SEED: &[u8] = b"campaign_vault";

/// Circle's official USDC mint address on Solana devnet
/// Faucet: https://faucet.circle.com/
pub const USDC_MINT: &str = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";

/// USDC decimals (6 instead of SOL's 9)
pub const USDC_DECIMALS: u8 = 6;
