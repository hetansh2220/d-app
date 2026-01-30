use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

mod constants;
mod errors;
mod state;

use constants::*;
use errors::HopeRiseError;
use state::*;

declare_id!("BAaDjLVffrtNzgKLoUjmM9t1tWBHxMF6UFdnL1NYmQ3J");

#[program]
pub mod hope_rise {
    use super::*;


    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.campaign_counter;
        counter.count = 0;
        counter.authority = ctx.accounts.authority.key();
        counter.bump = ctx.bumps.campaign_counter;
        Ok(())
    }


    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        title: String,
        short_description: String,
        category: Category,
        cover_image_url: String,
        story_url: String,
        funding_goal: u64,
        duration_days: u64,
    ) -> Result<()> {

        require!(title.len() <= MAX_TITLE_LENGTH, HopeRiseError::TitleTooLong);
        require!(
            short_description.len() <= MAX_DESCRIPTION_LENGTH,
            HopeRiseError::DescriptionTooLong
        );
        require!(
            cover_image_url.len() <= MAX_URL_LENGTH,
            HopeRiseError::UrlTooLong
        );
        require!(story_url.len() <= MAX_URL_LENGTH, HopeRiseError::UrlTooLong);
        require!(funding_goal > 0, HopeRiseError::InvalidFundingGoal);
        require!(
            duration_days >= MIN_CAMPAIGN_DURATION_DAYS
                && duration_days <= MAX_CAMPAIGN_DURATION_DAYS,
            HopeRiseError::InvalidDuration
        );

        let clock = Clock::get()?;
        let counter = &mut ctx.accounts.campaign_counter;
        let campaign = &mut ctx.accounts.campaign;


        campaign.campaign_id = counter.count;
        campaign.creator = ctx.accounts.creator.key();
        campaign.title = title;
        campaign.short_description = short_description;
        campaign.category = category;
        campaign.cover_image_url = cover_image_url;
        campaign.story_url = story_url;
        campaign.funding_goal = funding_goal;
        campaign.deadline = clock
            .unix_timestamp
            .checked_add(duration_days as i64 * SECONDS_PER_DAY)
            .ok_or(HopeRiseError::ArithmeticOverflow)?;
        campaign.amount_raised = 0;
        campaign.backer_count = 0;
        campaign.is_active = true;
        campaign.created_at = clock.unix_timestamp;
        campaign.milestone_count = 0;
        campaign.bump = ctx.bumps.campaign;


        counter.count = counter
            .count
            .checked_add(1)
            .ok_or(HopeRiseError::ArithmeticOverflow)?;

        Ok(())
    }


    pub fn fund_campaign(ctx: Context<FundCampaign>, amount: u64) -> Result<()> {
        require!(amount > 0, HopeRiseError::InvalidContributionAmount);

        let campaign = &ctx.accounts.campaign;
        let clock = Clock::get()?;


        require!(campaign.is_active, HopeRiseError::CampaignNotActive);
        require!(
            clock.unix_timestamp < campaign.deadline,
            HopeRiseError::CampaignEnded
        );


        let cpi_accounts = Transfer {
            from: ctx.accounts.contributor_token_account.to_account_info(),
            to: ctx.accounts.campaign_vault.to_account_info(),
            authority: ctx.accounts.contributor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;


        let campaign = &mut ctx.accounts.campaign;
        let contribution = &mut ctx.accounts.contribution;


        if contribution.amount == 0 {
            campaign.backer_count = campaign
                .backer_count
                .checked_add(1)
                .ok_or(HopeRiseError::ArithmeticOverflow)?;


            contribution.campaign = campaign.key();
            contribution.contributor = ctx.accounts.contributor.key();
            contribution.contributed_at = clock.unix_timestamp;
            contribution.refund_claimed = false;
            contribution.bump = ctx.bumps.contribution;
        }


        campaign.amount_raised = campaign
            .amount_raised
            .checked_add(amount)
            .ok_or(HopeRiseError::ArithmeticOverflow)?;

        contribution.amount = contribution
            .amount
            .checked_add(amount)
            .ok_or(HopeRiseError::ArithmeticOverflow)?;

        Ok(())
    }


    pub fn withdraw_funds(ctx: Context<WithdrawFunds>) -> Result<()> {
        let campaign = &ctx.accounts.campaign;


        require!(
            campaign.amount_raised >= campaign.funding_goal,
            HopeRiseError::GoalNotMet
        );


        let vault_balance = ctx.accounts.campaign_vault.amount;
        require!(vault_balance > 0, HopeRiseError::InsufficientFunds);


        let campaign_key = ctx.accounts.campaign.key();
        let bump = ctx.bumps.campaign_vault;
        let seeds = &[
            CAMPAIGN_VAULT_SEED,
            campaign_key.as_ref(),
            &[bump],
        ];
        let signer_seeds = &[&seeds[..]];


        let cpi_accounts = Transfer {
            from: ctx.accounts.campaign_vault.to_account_info(),
            to: ctx.accounts.creator_token_account.to_account_info(),
            authority: ctx.accounts.campaign_vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, vault_balance)?;

        Ok(())
    }


    pub fn add_milestone(
        ctx: Context<AddMilestone>,
        title: String,
        target_amount: u64,
    ) -> Result<()> {
        require!(
            title.len() <= MAX_MILESTONE_TITLE_LENGTH,
            HopeRiseError::MilestoneTitleTooLong
        );

        let campaign = &mut ctx.accounts.campaign;
        let milestone = &mut ctx.accounts.milestone;


        milestone.campaign = campaign.key();
        milestone.milestone_index = campaign.milestone_count;
        milestone.title = title;
        milestone.target_amount = target_amount;
        milestone.is_completed = false;
        milestone.bump = ctx.bumps.milestone;


        campaign.milestone_count = campaign
            .milestone_count
            .checked_add(1)
            .ok_or(HopeRiseError::ArithmeticOverflow)?;

        Ok(())
    }


    pub fn complete_milestone(ctx: Context<CompleteMilestone>) -> Result<()> {
        let campaign = &ctx.accounts.campaign;
        let milestone = &mut ctx.accounts.milestone;


        require!(
            !milestone.is_completed,
            HopeRiseError::MilestoneAlreadyCompleted
        );
        require!(
            campaign.amount_raised >= milestone.target_amount,
            HopeRiseError::MilestoneTargetNotReached
        );

        milestone.is_completed = true;

        Ok(())
    }


    pub fn close_campaign(ctx: Context<CloseCampaign>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;

        require!(campaign.is_active, HopeRiseError::CampaignNotActive);

        campaign.is_active = false;

        Ok(())
    }


    pub fn claim_refund(ctx: Context<ClaimRefund>) -> Result<()> {
        let campaign = &ctx.accounts.campaign;
        let contribution = &ctx.accounts.contribution;


        require!(!campaign.is_active, HopeRiseError::CampaignStillActive);
        require!(
            campaign.amount_raised < campaign.funding_goal,
            HopeRiseError::GoalWasMet
        );
        require!(
            !contribution.refund_claimed,
            HopeRiseError::RefundAlreadyClaimed
        );
        require!(contribution.amount > 0, HopeRiseError::NoContribution);

        let refund_amount = contribution.amount;


        let campaign_key = ctx.accounts.campaign.key();
        let bump = ctx.bumps.campaign_vault;
        let seeds = &[
            CAMPAIGN_VAULT_SEED,
            campaign_key.as_ref(),
            &[bump],
        ];
        let signer_seeds = &[&seeds[..]];


        let cpi_accounts = Transfer {
            from: ctx.accounts.campaign_vault.to_account_info(),
            to: ctx.accounts.contributor_token_account.to_account_info(),
            authority: ctx.accounts.campaign_vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, refund_amount)?;


        let contribution = &mut ctx.accounts.contribution;
        contribution.refund_claimed = true;

        Ok(())
    }
}





#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = CampaignCounter::SIZE,
        seeds = [CAMPAIGN_COUNTER_SEED],
        bump
    )]
    pub campaign_counter: Account<'info, CampaignCounter>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateCampaign<'info> {
    #[account(
        init,
        payer = creator,
        space = Campaign::SIZE,
        seeds = [CAMPAIGN_SEED, creator.key().as_ref(), campaign_counter.count.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        mut,
        seeds = [CAMPAIGN_COUNTER_SEED],
        bump = campaign_counter.bump
    )]
    pub campaign_counter: Account<'info, CampaignCounter>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FundCampaign<'info> {
    #[account(
        mut,
        seeds = [CAMPAIGN_SEED, campaign.creator.as_ref(), campaign.campaign_id.to_le_bytes().as_ref()],
        bump = campaign.bump
    )]
    pub campaign: Account<'info, Campaign>,


    #[account(
        init_if_needed,
        payer = contributor,
        seeds = [CAMPAIGN_VAULT_SEED, campaign.key().as_ref()],
        bump,
        token::mint = usdc_mint,
        token::authority = campaign_vault,
    )]
    pub campaign_vault: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = contributor,
        space = Contribution::SIZE,
        seeds = [CONTRIBUTION_SEED, campaign.key().as_ref(), contributor.key().as_ref()],
        bump
    )]
    pub contribution: Account<'info, Contribution>,

    #[account(mut)]
    pub contributor: Signer<'info>,


    #[account(
        mut,
        constraint = contributor_token_account.mint == usdc_mint.key() @ HopeRiseError::InvalidTokenAccount,
        constraint = contributor_token_account.owner == contributor.key() @ HopeRiseError::InvalidTokenAccount,
    )]
    pub contributor_token_account: Account<'info, TokenAccount>,


    #[account(
        constraint = usdc_mint.key().to_string() == USDC_MINT @ HopeRiseError::InvalidMint
    )]
    pub usdc_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(
        mut,
        seeds = [CAMPAIGN_SEED, campaign.creator.as_ref(), campaign.campaign_id.to_le_bytes().as_ref()],
        bump = campaign.bump,
        has_one = creator @ HopeRiseError::Unauthorized
    )]
    pub campaign: Account<'info, Campaign>,


    #[account(
        mut,
        seeds = [CAMPAIGN_VAULT_SEED, campaign.key().as_ref()],
        bump,
        token::mint = usdc_mint,
        token::authority = campaign_vault,
    )]
    pub campaign_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub creator: Signer<'info>,


    #[account(
        init_if_needed,
        payer = creator,
        associated_token::mint = usdc_mint,
        associated_token::authority = creator,
    )]
    pub creator_token_account: Account<'info, TokenAccount>,


    #[account(
        constraint = usdc_mint.key().to_string() == USDC_MINT @ HopeRiseError::InvalidMint
    )]
    pub usdc_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddMilestone<'info> {
    #[account(
        mut,
        seeds = [CAMPAIGN_SEED, campaign.creator.as_ref(), campaign.campaign_id.to_le_bytes().as_ref()],
        bump = campaign.bump,
        has_one = creator @ HopeRiseError::Unauthorized,
        constraint = campaign.is_active @ HopeRiseError::CampaignNotActive,
        constraint = campaign.milestone_count < MAX_MILESTONES_PER_CAMPAIGN @ HopeRiseError::MaxMilestonesReached
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        init,
        payer = creator,
        space = Milestone::SIZE,
        seeds = [MILESTONE_SEED, campaign.key().as_ref(), &[campaign.milestone_count]],
        bump
    )]
    pub milestone: Account<'info, Milestone>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CompleteMilestone<'info> {
    #[account(
        seeds = [CAMPAIGN_SEED, campaign.creator.as_ref(), campaign.campaign_id.to_le_bytes().as_ref()],
        bump = campaign.bump,
        has_one = creator @ HopeRiseError::Unauthorized
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        mut,
        seeds = [MILESTONE_SEED, campaign.key().as_ref(), &[milestone.milestone_index]],
        bump = milestone.bump,
        constraint = milestone.campaign == campaign.key() @ HopeRiseError::Unauthorized
    )]
    pub milestone: Account<'info, Milestone>,

    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseCampaign<'info> {
    #[account(
        mut,
        seeds = [CAMPAIGN_SEED, campaign.creator.as_ref(), campaign.campaign_id.to_le_bytes().as_ref()],
        bump = campaign.bump,
        has_one = creator @ HopeRiseError::Unauthorized
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(mut)]
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimRefund<'info> {
    #[account(
        mut,
        seeds = [CAMPAIGN_SEED, campaign.creator.as_ref(), campaign.campaign_id.to_le_bytes().as_ref()],
        bump = campaign.bump
    )]
    pub campaign: Account<'info, Campaign>,


    #[account(
        mut,
        seeds = [CAMPAIGN_VAULT_SEED, campaign.key().as_ref()],
        bump,
        token::mint = usdc_mint,
        token::authority = campaign_vault,
    )]
    pub campaign_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [CONTRIBUTION_SEED, campaign.key().as_ref(), contributor.key().as_ref()],
        bump = contribution.bump,
        constraint = contribution.contributor == contributor.key() @ HopeRiseError::Unauthorized
    )]
    pub contribution: Account<'info, Contribution>,

    #[account(mut)]
    pub contributor: Signer<'info>,


    #[account(
        init_if_needed,
        payer = contributor,
        associated_token::mint = usdc_mint,
        associated_token::authority = contributor,
    )]
    pub contributor_token_account: Account<'info, TokenAccount>,


    #[account(
        constraint = usdc_mint.key().to_string() == USDC_MINT @ HopeRiseError::InvalidMint
    )]
    pub usdc_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
