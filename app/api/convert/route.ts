import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(req: NextRequest) {
  try {
    const { solidityCode } = await req.json();

    if (!solidityCode || solidityCode.trim().length === 0) {
      return NextResponse.json(
        { error: 'Solidity code is required' },
        { status: 400 }
      );
    }

    // If OpenAI is not configured, return a mock response
    if (!openai) {
      console.warn('OpenAI API key not configured, returning mock conversion');
      return NextResponse.json({
        rustCode: getMockRustConversion(solidityCode),
        stats: {
          functions: 3,
          structs: 2,
          events: 2,
          complexity: 'Medium',
        },
      });
    }

    // Use OpenAI to convert Solidity to Rust/Anchor
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert blockchain developer specializing in converting Solidity smart contracts to Rust/Anchor programs for Solana. 
          
Convert the following Solidity contract to a complete, production-ready Rust program using the Anchor framework. Follow these guidelines:

1. Use Anchor framework patterns and best practices
2. Implement proper account validation and security checks
3. Convert Solidity modifiers to Anchor constraints
4. Map Solidity events to Anchor events
5. Use Solana's compute-efficient patterns
6. Include proper error handling
7. Add comprehensive comments explaining the conversion

Return ONLY the Rust code without any explanations or markdown formatting.`,
        },
        {
          role: 'user',
          content: solidityCode,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const rustCode = completion.choices[0]?.message?.content || '';

    // Analyze the converted code for stats
    const stats = analyzeCode(solidityCode, rustCode);

    return NextResponse.json({
      rustCode,
      stats,
    });
  } catch (error: any) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to convert contract' },
      { status: 500 }
    );
  }
}

function analyzeCode(solidityCode: string, rustCode: string) {
  // Count functions
  const solidityFunctions = (solidityCode.match(/function\s+\w+/g) || []).length;
  const rustFunctions = (rustCode.match(/pub fn\s+\w+/g) || []).length;
  const functions = Math.max(solidityFunctions, rustFunctions);

  // Count structs/accounts
  const solidityStructs = (solidityCode.match(/struct\s+\w+/g) || []).length;
  const rustStructs = (rustCode.match(/(struct|#\[account\])/g) || []).length;
  const structs = Math.max(solidityStructs, Math.floor(rustStructs / 2));

  // Count events
  const solidityEvents = (solidityCode.match(/event\s+\w+/g) || []).length;
  const rustEvents = (rustCode.match(/#\[event\]/g) || []).length;
  const events = Math.max(solidityEvents, rustEvents);

  // Determine complexity
  let complexity = 'Low';
  if (functions > 10 || structs > 5 || solidityCode.length > 2000) {
    complexity = 'High';
  } else if (functions > 5 || structs > 2 || solidityCode.length > 1000) {
    complexity = 'Medium';
  }

  return {
    functions,
    structs,
    events,
    complexity,
  };
}

function getMockRustConversion(solidityCode: string): string {
  return `use anchor_lang::prelude::*;

declare_id!("YourProgramIDHere11111111111111111111111111");

#[program]
pub mod chainport_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.owner.key();
        vault.bump = ctx.bumps.vault;
        msg!("Vault initialized with owner: {}", vault.owner);
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::InvalidAmount);
        
        let vault = &mut ctx.accounts.vault;
        vault.balance = vault.balance.checked_add(amount)
            .ok_or(VaultError::Overflow)?;
        
        // Transfer SOL from user to vault
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.vault.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.vault.to_account_info(),
            ],
        )?;
        
        emit!(DepositEvent {
            user: ctx.accounts.user.key(),
            amount,
        });
        
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        require!(
            vault.balance >= amount,
            VaultError::InsufficientBalance
        );
        
        vault.balance = vault.balance.checked_sub(amount)
            .ok_or(VaultError::Underflow)?;
        
        // Transfer SOL from vault to user
        **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.user.try_borrow_mut_lamports()? += amount;
        
        emit!(WithdrawalEvent {
            user: ctx.accounts.user.key(),
            amount,
        });
        
        Ok(())
    }

    pub fn get_balance(ctx: Context<GetBalance>) -> Result<u64> {
        Ok(ctx.accounts.vault.balance)
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", owner.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump = vault.bump,
        constraint = vault.owner == user.key() @ VaultError::Unauthorized
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetBalance<'info> {
    #[account(
        seeds = [b"vault", user.key().as_ref()],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,
    pub user: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub owner: Pubkey,
    pub balance: u64,
    pub bump: u8,
}

#[event]
pub struct DepositEvent {
    pub user: Pubkey,
    pub amount: u64,
}

#[event]
pub struct WithdrawalEvent {
    pub user: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum VaultError {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Arithmetic underflow")]
    Underflow,
}`;
}
