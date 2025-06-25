// src/components/dashboard/tabs/VaultsTab.tsx - Final fixed version
import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Shield, DollarSign, Brain } from 'lucide-react'
import { VaultCard } from '../cards/VaultCard'
import { MetricCard } from '../cards/MetricCard'
import { Button } from '../../ui/Button'
import { type DashboardData } from '../../../types/dashboard'

interface VaultsTabProps {
  data: DashboardData
  isPrivacyMode: boolean
  onRefetch: () => void
}

export const VaultsTab: React.FC<VaultsTabProps> = ({
  data,
  isPrivacyMode,
}) => {
  const { vaults } = data

  const totalLockedValue = vaults.reduce((sum, vault) => sum + vault.value, 0)
  const avgAIScore = vaults.length > 0 
    ? Math.round(vaults.reduce((sum, vault) => sum + vault.aiScore, 0) / vaults.length) 
    : 0

  const handleVaultClick = (vaultId: number) => {
    console.log('View vault details:', vaultId)
    // Handle vault detail view
  }

  const handleCreateVault = () => {
    console.log('Create new vault')
    // Handle vault creation
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Commitment Vaults</h2>
        <Button
          icon={<Plus className="w-5 h-5" />}
          onClick={handleCreateVault}
        >
          Create New Vault
        </Button>
      </div>

      {/* Vault Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Vaults"
          value={vaults.length}
          subtitle="All performing well"
          icon={Shield}
          iconColor="text-purple-400"
        />
        
        <MetricCard
          title="Total Locked Value"
          value={totalLockedValue}
          subtitle="Across 3 chains"
          icon={DollarSign}
          iconColor="text-blue-400"
          isPrivate={isPrivacyMode}
        />
        
        <MetricCard
          title="Avg AI Score"
          value={avgAIScore}
          subtitle="High confidence"
          icon={Brain}
          iconColor="text-green-400"
        />
      </div>

      {/* Vault Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {vaults.map((vault, index) => (
          <VaultCard
            key={vault.id}
            vault={vault}
            isPrivate={isPrivacyMode}
            onClick={() => handleVaultClick(vault.id)}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Empty State */}
      {vaults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <h3 className="text-xl font-bold text-white mb-4">No Vaults Yet</h3>
          <p className="text-gray-400 mb-8">Create your first commitment vault to get started</p>
          <Button
            icon={<Plus className="w-5 h-5" />}
            onClick={handleCreateVault}
          >
            Create Your First Vault
          </Button>
        </motion.div>
      )}
    </div>
  )
}