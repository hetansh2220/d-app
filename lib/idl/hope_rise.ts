/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/hope_rise.json`.
 */
export type HopeRise = {
  "address": "BAaDjLVffrtNzgKLoUjmM9t1tWBHxMF6UFdnL1NYmQ3J",
  "metadata": {
    "name": "hopeRise",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Solana smart contract for Hope Rise crowdfunding platform"
  },
  "instructions": [
    {
      "name": "addMilestone",
      "docs": [
        "Add a milestone to a campaign"
      ],
      "discriminator": [
        165,
        18,
        177,
        128,
        204,
        172,
        23,
        249
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "milestone",
          "writable": true
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true,
          "relations": [
            "campaign"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "targetAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimRefund",
      "docs": [
        "Claim USDC refund if campaign failed (goal not met)"
      ],
      "discriminator": [
        15,
        16,
        30,
        161,
        255,
        228,
        97,
        60
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "campaignVault",
          "docs": [
            "Campaign's USDC vault (PDA token account)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              }
            ]
          }
        },
        {
          "name": "contribution",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  116,
                  114,
                  105,
                  98,
                  117,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "contributor"
              }
            ]
          }
        },
        {
          "name": "contributor",
          "writable": true,
          "signer": true
        },
        {
          "name": "contributorTokenAccount",
          "docs": [
            "Contributor's USDC token account (ATA)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "contributor"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "usdcMint",
          "docs": [
            "USDC mint"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "closeCampaign",
      "docs": [
        "Close a campaign"
      ],
      "discriminator": [
        65,
        49,
        110,
        7,
        63,
        238,
        206,
        77
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true,
          "relations": [
            "campaign"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "completeMilestone",
      "docs": [
        "Mark a milestone as complete"
      ],
      "discriminator": [
        137,
        164,
        160,
        100,
        33,
        64,
        178,
        10
      ],
      "accounts": [
        {
          "name": "campaign",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "milestone",
          "writable": true
        },
        {
          "name": "creator",
          "signer": true,
          "relations": [
            "campaign"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "createCampaign",
      "docs": [
        "Create a new crowdfunding campaign"
      ],
      "discriminator": [
        111,
        131,
        187,
        98,
        160,
        193,
        114,
        244
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "account",
                "path": "campaign_counter.count",
                "account": "campaignCounter"
              }
            ]
          }
        },
        {
          "name": "campaignCounter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "shortDescription",
          "type": "string"
        },
        {
          "name": "category",
          "type": {
            "defined": {
              "name": "category"
            }
          }
        },
        {
          "name": "coverImageUrl",
          "type": "string"
        },
        {
          "name": "storyUrl",
          "type": "string"
        },
        {
          "name": "fundingGoal",
          "type": "u64"
        },
        {
          "name": "durationDays",
          "type": "u64"
        }
      ]
    },
    {
      "name": "fundCampaign",
      "docs": [
        "Contribute USDC to a campaign"
      ],
      "discriminator": [
        109,
        57,
        56,
        239,
        99,
        111,
        221,
        121
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "campaignVault",
          "docs": [
            "Campaign's USDC vault (PDA token account)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              }
            ]
          }
        },
        {
          "name": "contribution",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  116,
                  114,
                  105,
                  98,
                  117,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "contributor"
              }
            ]
          }
        },
        {
          "name": "contributor",
          "writable": true,
          "signer": true
        },
        {
          "name": "contributorTokenAccount",
          "docs": [
            "Contributor's USDC token account (ATA)"
          ],
          "writable": true
        },
        {
          "name": "usdcMint",
          "docs": [
            "USDC mint"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "docs": [
        "Initialize the global campaign counter (one-time setup)"
      ],
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "campaignCounter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "withdrawFunds",
      "docs": [
        "Withdraw USDC funds (creator only, after goal met)"
      ],
      "discriminator": [
        241,
        36,
        29,
        111,
        208,
        31,
        104,
        217
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "campaignVault",
          "docs": [
            "Campaign's USDC vault (PDA token account)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true,
          "relations": [
            "campaign"
          ]
        },
        {
          "name": "creatorTokenAccount",
          "docs": [
            "Creator's USDC token account (ATA)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "usdcMint",
          "docs": [
            "USDC mint"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    },
    {
      "name": "campaignCounter",
      "discriminator": [
        166,
        204,
        173,
        116,
        178,
        217,
        1,
        210
      ]
    },
    {
      "name": "contribution",
      "discriminator": [
        182,
        187,
        14,
        111,
        72,
        167,
        242,
        212
      ]
    },
    {
      "name": "milestone",
      "discriminator": [
        38,
        210,
        239,
        177,
        85,
        184,
        10,
        44
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "You are not authorized to perform this action"
    },
    {
      "code": 6001,
      "name": "campaignNotActive",
      "msg": "Campaign is not active"
    },
    {
      "code": 6002,
      "name": "campaignStillActive",
      "msg": "Campaign is still active"
    },
    {
      "code": 6003,
      "name": "campaignEnded",
      "msg": "Campaign has ended"
    },
    {
      "code": 6004,
      "name": "campaignNotEnded",
      "msg": "Campaign has not ended yet"
    },
    {
      "code": 6005,
      "name": "goalWasMet",
      "msg": "Funding goal was already met"
    },
    {
      "code": 6006,
      "name": "goalNotMet",
      "msg": "Funding goal was not met"
    },
    {
      "code": 6007,
      "name": "withdrawalNotAllowed",
      "msg": "Withdrawal is not allowed at this time"
    },
    {
      "code": 6008,
      "name": "refundAlreadyClaimed",
      "msg": "Refund has already been claimed"
    },
    {
      "code": 6009,
      "name": "noContribution",
      "msg": "No contribution found to refund"
    },
    {
      "code": 6010,
      "name": "milestoneAlreadyCompleted",
      "msg": "Milestone has already been completed"
    },
    {
      "code": 6011,
      "name": "milestoneTargetNotReached",
      "msg": "Milestone target amount has not been reached"
    },
    {
      "code": 6012,
      "name": "maxMilestonesReached",
      "msg": "Maximum number of milestones (10) reached"
    },
    {
      "code": 6013,
      "name": "titleTooLong",
      "msg": "Title exceeds maximum length of 80 characters"
    },
    {
      "code": 6014,
      "name": "descriptionTooLong",
      "msg": "Description exceeds maximum length of 200 characters"
    },
    {
      "code": 6015,
      "name": "urlTooLong",
      "msg": "URL exceeds maximum length of 200 characters"
    },
    {
      "code": 6016,
      "name": "milestoneTitleTooLong",
      "msg": "Milestone title exceeds maximum length of 100 characters"
    },
    {
      "code": 6017,
      "name": "invalidFundingGoal",
      "msg": "Funding goal must be greater than zero"
    },
    {
      "code": 6018,
      "name": "invalidContributionAmount",
      "msg": "Contribution amount must be greater than zero"
    },
    {
      "code": 6019,
      "name": "invalidDuration",
      "msg": "Campaign duration must be between 1 and 90 days"
    },
    {
      "code": 6020,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow occurred"
    },
    {
      "code": 6021,
      "name": "insufficientFunds",
      "msg": "Insufficient funds in campaign account"
    },
    {
      "code": 6022,
      "name": "invalidMint",
      "msg": "Invalid token mint address"
    },
    {
      "code": 6023,
      "name": "invalidTokenAccount",
      "msg": "Invalid token account"
    }
  ],
  "types": [
    {
      "name": "campaign",
      "docs": [
        "Main campaign account storing all campaign data"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaignId",
            "docs": [
              "Unique campaign identifier"
            ],
            "type": "u64"
          },
          {
            "name": "creator",
            "docs": [
              "Campaign creator's wallet address"
            ],
            "type": "pubkey"
          },
          {
            "name": "title",
            "docs": [
              "Campaign title (max 80 characters)"
            ],
            "type": "string"
          },
          {
            "name": "shortDescription",
            "docs": [
              "Short description (max 200 characters)"
            ],
            "type": "string"
          },
          {
            "name": "category",
            "docs": [
              "Campaign category"
            ],
            "type": {
              "defined": {
                "name": "category"
              }
            }
          },
          {
            "name": "coverImageUrl",
            "docs": [
              "IPFS hash for cover image"
            ],
            "type": "string"
          },
          {
            "name": "storyUrl",
            "docs": [
              "IPFS hash for long story content"
            ],
            "type": "string"
          },
          {
            "name": "fundingGoal",
            "docs": [
              "Target funding goal in lamports"
            ],
            "type": "u64"
          },
          {
            "name": "deadline",
            "docs": [
              "Campaign deadline (Unix timestamp)"
            ],
            "type": "i64"
          },
          {
            "name": "amountRaised",
            "docs": [
              "Total amount raised in lamports"
            ],
            "type": "u64"
          },
          {
            "name": "backerCount",
            "docs": [
              "Number of unique backers"
            ],
            "type": "u64"
          },
          {
            "name": "isActive",
            "docs": [
              "Whether campaign is active"
            ],
            "type": "bool"
          },
          {
            "name": "createdAt",
            "docs": [
              "Creation timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "milestoneCount",
            "docs": [
              "Number of milestones added"
            ],
            "type": "u8"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "campaignCounter",
      "docs": [
        "Global campaign counter for generating unique campaign IDs"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "docs": [
              "Total number of campaigns created"
            ],
            "type": "u64"
          },
          {
            "name": "authority",
            "docs": [
              "Authority that initialized the program"
            ],
            "type": "pubkey"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "category",
      "docs": [
        "Campaign category enum matching frontend categories"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "environment"
          },
          {
            "name": "education"
          },
          {
            "name": "healthcare"
          },
          {
            "name": "technology"
          },
          {
            "name": "community"
          },
          {
            "name": "arts"
          }
        ]
      }
    },
    {
      "name": "contribution",
      "docs": [
        "Contribution account tracking individual backer contributions"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "docs": [
              "Reference to campaign"
            ],
            "type": "pubkey"
          },
          {
            "name": "contributor",
            "docs": [
              "Contributor's wallet address"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Total amount contributed (in lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "contributedAt",
            "docs": [
              "Timestamp of first contribution"
            ],
            "type": "i64"
          },
          {
            "name": "refundClaimed",
            "docs": [
              "Whether refund has been claimed"
            ],
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "milestone",
      "docs": [
        "Milestone account linked to a campaign"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "docs": [
              "Reference to parent campaign"
            ],
            "type": "pubkey"
          },
          {
            "name": "milestoneIndex",
            "docs": [
              "Milestone index (0-based)"
            ],
            "type": "u8"
          },
          {
            "name": "title",
            "docs": [
              "Milestone title (max 100 characters)"
            ],
            "type": "string"
          },
          {
            "name": "targetAmount",
            "docs": [
              "Target amount for this milestone (in lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "isCompleted",
            "docs": [
              "Whether milestone is completed"
            ],
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump"
            ],
            "type": "u8"
          }
        ]
      }
    }
  ]
};
