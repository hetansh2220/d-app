use anchor_lang::prelude::*;

#[error_code]
pub enum HopeRiseError {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,

    #[msg("Campaign is not active")]
    CampaignNotActive,

    #[msg("Campaign is still active")]
    CampaignStillActive,

    #[msg("Campaign has ended")]
    CampaignEnded,

    #[msg("Campaign has not ended yet")]
    CampaignNotEnded,

    #[msg("Funding goal was already met")]
    GoalWasMet,

    #[msg("Funding goal was not met")]
    GoalNotMet,

    #[msg("Withdrawal is not allowed at this time")]
    WithdrawalNotAllowed,

    #[msg("Refund has already been claimed")]
    RefundAlreadyClaimed,

    #[msg("No contribution found to refund")]
    NoContribution,

    #[msg("Milestone has already been completed")]
    MilestoneAlreadyCompleted,

    #[msg("Milestone target amount has not been reached")]
    MilestoneTargetNotReached,

    #[msg("Maximum number of milestones (10) reached")]
    MaxMilestonesReached,

    #[msg("Title exceeds maximum length of 80 characters")]
    TitleTooLong,

    #[msg("Description exceeds maximum length of 200 characters")]
    DescriptionTooLong,

    #[msg("URL exceeds maximum length of 200 characters")]
    UrlTooLong,

    #[msg("Milestone title exceeds maximum length of 100 characters")]
    MilestoneTitleTooLong,

    #[msg("Funding goal must be greater than zero")]
    InvalidFundingGoal,

    #[msg("Contribution amount must be greater than zero")]
    InvalidContributionAmount,

    #[msg("Campaign duration must be between 1 and 90 days")]
    InvalidDuration,

    #[msg("Arithmetic overflow occurred")]
    ArithmeticOverflow,

    #[msg("Insufficient funds in campaign account")]
    InsufficientFunds,

    #[msg("Invalid token mint address")]
    InvalidMint,

    #[msg("Invalid token account")]
    InvalidTokenAccount,
}
