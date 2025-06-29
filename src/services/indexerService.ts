// Legacy vault creation interface
interface VaultIndexData {
  vault_id: number
  vault_title: string
  commitment_message: string
  owner_address: string
  metadata: string
  tx_hash: string
}

// New indexer vault data interface
export interface IndexerVault {
  id: string
  owner: string
  token: string
  amount: string
  unlockTime: string
  targetPrice: string
  priceUp: string
  priceDown: string
  conditionType: number
  status: number
  createdAt: string
  updatedAt: string
  title: string
  message: string
  autoWithdraw: boolean
  creationTxHash: string
  creationBlockNumber: string
  unlockedAt: string | null
  unlockedTxHash: string | null
  withdrawnAt: string | null
  withdrawnTxHash: string | null
  emergencyWithdrawnAt: string | null
  emergencyPenalty: string | null
  emergencyTxHash: string | null
  insight: string | null
}

export interface IndexerPagination {
  limit: number
  offset: number
}

export interface IndexerVaultsResponse {
  vaults: IndexerVault[]
  pagination: IndexerPagination
}

interface IndexerResponse {
  success: boolean
  data?: Record<string, unknown>
  error?: string
}

export interface IndexerApiResponse {
  success: boolean
  data?: IndexerVaultsResponse
  error?: string
}

// Cache for indexer data to prevent excessive API calls
const indexerCache = new Map<string, { data: IndexerVaultsResponse; timestamp: number }>()
const CACHE_DURATION = 30 * 1000 // 30 seconds cache for more frequent updates

/**
 * Map vault status number to human readable status
 */
export const mapVaultStatus = (status: number): 'active' | 'completed' | 'pending' | 'failed' => {
  switch (status) {
    case 0: return 'pending'
    case 1: return 'active'
    case 2: return 'completed' // withdrawn normally
    case 3: return 'failed'    // emergency withdrawn
    default: return 'pending'
  }
}

/**
 * Get token symbol from address (simplified mapping)
 */
export const getTokenSymbol = (tokenAddress: string): string => {
  // Native token (0x0000000000000000000000000000000000000000) is AVAX on Avalanche
  if (tokenAddress === '0x0000000000000000000000000000000000000000') {
    return 'AVAX'
  }
  
  // Add more token mappings as needed
  const knownTokens: Record<string, string> = {
    '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab': 'WETH',
    '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e': 'USDC',
    // Add more token mappings here
  }
  
  return knownTokens[tokenAddress.toLowerCase()] || 'TOKEN'
}

/**
 * Format amount from wei to decimal
 */
export const formatVaultAmount = (amount: string, decimals = 18): number => {
  try {
    const bigIntAmount = BigInt(amount)
    const divisor = BigInt(10 ** decimals)
    return Number(bigIntAmount) / Number(divisor)
  } catch {
    return 0
  }
}

/**
 * Fetch vaults for a specific owner from the new indexer
 */
export const fetchOwnerVaults = async (
  owner: string,
  limit = 50,
  offset = 0
): Promise<IndexerApiResponse> => {
  try {
    // Check cache first
    const cacheKey = `${owner}-${limit}-${offset}`
    const cached = indexerCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('🎯 Using cached indexer data for:', owner)
      return { success: true, data: cached.data }
    }

    console.log('🔍 Fetching vault data from indexer for:', owner)

    const url = `https://cipher-indexer.up.railway.app/vaults?owner=${owner}&limit=${limit}&offset=${offset}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Indexer API error: ${response.status} ${response.statusText}`)
    }

    const data: IndexerVaultsResponse = await response.json()

    // Cache the successful result
    indexerCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })

    console.log('✅ Indexer data fetched successfully:', {
      vaultsCount: data.vaults.length,
      owner: owner
    })

    return { success: true, data }

  } catch (error) {
    console.error('❌ Failed to fetch indexer data:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Convert indexer vault to transaction format for UI compatibility
 */
export const convertVaultToTransaction = (vault: IndexerVault): {
  id: number
  type: 'vault_create' | 'vault_execute' | 'cross_chain_transfer' | 'swap'
  asset: string
  amount: number
  date: string
  status: 'active' | 'completed' | 'pending' | 'failed'
  conditions: string
  transactionHash?: string
} => {
  const amount = formatVaultAmount(vault.amount)
  const asset = getTokenSymbol(vault.token)
  const status = mapVaultStatus(vault.status)
  
  // Determine the most recent date for this vault
  const relevantTimestamp = vault.withdrawnAt || vault.emergencyWithdrawnAt || vault.updatedAt || vault.createdAt
  const date = new Date(parseInt(relevantTimestamp) * 1000).toLocaleDateString()
  
  // Build conditions description
  let conditions = vault.title || 'Vault commitment'
  if (vault.message) {
    conditions += ` - ${vault.message}`
  }
  
  // Add timing info
  const unlockDate = new Date(parseInt(vault.unlockTime) * 1000)
  const now = new Date()
  
  if (status === 'active' && unlockDate > now) {
    const daysLeft = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    conditions += ` (${daysLeft} days remaining)`
  } else if (status === 'completed') {
    conditions += ' (Successfully completed)'
  } else if (status === 'failed') {
    conditions += ' (Emergency withdrawal)'
  }

  return {
    id: parseInt(vault.id),
    type: 'vault_create',
    asset,
    amount,
    date,
    status,
    conditions,
    transactionHash: vault.withdrawnTxHash || vault.emergencyTxHash || vault.creationTxHash
  }
}

/**
 * Get recent vault activity (sorted by most recent)
 */
export const getRecentVaultActivity = async (
  owner: string,
  maxItems = 10
): Promise<IndexerVault[]> => {
  try {
    const response = await fetchOwnerVaults(owner, 50, 0)
    
    if (!response.success || !response.data) {
      return []
    }

    // Sort by most recent activity (updatedAt or createdAt)
    const sortedVaults = response.data.vaults.sort((a, b) => {
      const aTime = Math.max(
        parseInt(a.updatedAt),
        parseInt(a.createdAt),
        parseInt(a.withdrawnAt || '0'),
        parseInt(a.emergencyWithdrawnAt || '0')
      )
      const bTime = Math.max(
        parseInt(b.updatedAt),
        parseInt(b.createdAt),
        parseInt(b.withdrawnAt || '0'),
        parseInt(b.emergencyWithdrawnAt || '0')
      )
      return bTime - aTime
    })

    return sortedVaults.slice(0, maxItems)

  } catch (error) {
    console.error('Failed to get recent vault activity:', error)
    return []
  }
}

export const indexerService = {
  // Legacy vault creation method
  async createVault(vaultData: VaultIndexData): Promise<IndexerResponse> {
    try {
      const response = await fetch('https://fund-ur-memory-services-production.up.railway.app/api/vaults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vaultData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Indexer API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to index vault'
      }
    }
  },

  // New vault fetching methods
  fetchOwnerVaults,
  getRecentVaultActivity,
  convertVaultToTransaction
}

export type { VaultIndexData, IndexerResponse } 