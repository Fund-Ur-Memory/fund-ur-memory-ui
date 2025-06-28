interface VaultIndexData {
  vault_id: number
  vault_title: string
  commitment_message: string
  owner_address: string
  metadata: string
  tx_hash: string
}

interface IndexerResponse {
  success: boolean
  data?: Record<string, unknown>
  error?: string
}

export const indexerService = {
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
  }
}

export type { VaultIndexData, IndexerResponse } 