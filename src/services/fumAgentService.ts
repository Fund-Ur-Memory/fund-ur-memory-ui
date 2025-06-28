import type { PriceBasedAnalysis, TimeBasedAnalysis, WalletAnalysisResponse } from "../types/dashboard";

type Analysis = TimeBasedAnalysis | PriceBasedAnalysis;

interface FUMAnalysisResponse {
  success: boolean;
  data?: {
    response: string;
    action: string;
    character: string;
    analysis: Analysis | null;
    amount: number | null;
    tokenSymbol: string | null;
    duration: number | null;
    unit: string | null;
    fearAndGreed: {
      value: number;
      classification: string;
      timestamp: number;
    } | null;
  };
  error?: string;
}

export const isTimeBasedAnalysis = (analysis: Analysis): analysis is TimeBasedAnalysis => {
  return 'score' in analysis && 'recommendation' in analysis;
};

export const isPriceBasedAnalysis = (analysis: Analysis): analysis is PriceBasedAnalysis => {
  return 'upTarget' in analysis && 'downTarget' in analysis;
};

export const fumAgentService = {
  async analyzeCommitment(text: string): Promise<FUMAnalysisResponse> {
    try {
      const response = await fetch('https://fund-ur-memory-agents-production.up.railway.app/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling FUM agent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze commitment'
      };
    }
  },

  async analyzeWallet(walletAddress: string): Promise<WalletAnalysisResponse> {
    try {
      const response = await fetch('https://fund-ur-memory-agents-production.up.railway.app/api/wallet-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: "Analyze my wallet trading history and provide risk assessment",
          walletAddress
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling wallet analysis:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze wallet'
      };
    }
  }
};

export type { FUMAnalysisResponse, TimeBasedAnalysis, PriceBasedAnalysis, Analysis, WalletAnalysisResponse };