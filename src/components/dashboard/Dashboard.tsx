// src/components/dashboard/Dashboard.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OverviewTab } from "./tabs/OverviewTab";
import { VaultsTab } from "./tabs/VaultsTab";
import { AIInsightsTab } from "./tabs/AIInsightsTab";
// import { ProfileTab } from './tabs/ProfileTab'
import { LoadingSpinner } from "./common/LoadingSpinner";
import { useDashboard } from "../../hooks/dashboard/useDashboard";

// Import the LayoutWrapper component
import { LayoutWrapper } from "../layout/LayoutWrapper";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardProps {
  userAddress: string;
  onDisconnect: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userAddress,
  onDisconnect,
}) => {
  const {
    data,
    loading,
    error,
    activeTab,
    setActiveTab,
    isPrivacyMode,
    setIsPrivacyMode,
    refetch,
  } = useDashboard(userAddress);

  if (loading) {
    return (
      <LayoutWrapper currentPage="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <h2 className="text-2xl font-bold text-white mb-2 mt-4">
              Analyzing Your Wallet
            </h2>
            <p className="text-gray-400">
              AI agents are reviewing your transaction history...
            </p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  if (error || !data) {
    return (
      <LayoutWrapper currentPage="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-400 mb-4">
              {error || "Failed to load dashboard data"}
            </p>
            <button
              onClick={refetch}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  const renderActiveTab = () => {
    const tabProps = {
      data,
      isPrivacyMode,
      onRefetch: refetch,
    };

    switch (activeTab) {
      case "overview":
        return <OverviewTab {...tabProps} />;
      case "vaults":
        return <VaultsTab {...tabProps} />;
      case "ai":
        return <AIInsightsTab {...tabProps} />;
      //   case "profile":
      //     return <ProfileTab {...tabProps} />;
      default:
        return <OverviewTab {...tabProps} />;
    }
  };

  return (
    <LayoutWrapper currentPage="dashboard">
      <div className="min-h-screen">
        <DashboardHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isPrivacyMode={isPrivacyMode}
          onPrivacyToggle={setIsPrivacyMode}
          onDisconnect={onDisconnect}
          userAddress={userAddress}
          notifications={3}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </LayoutWrapper>
  );
};
