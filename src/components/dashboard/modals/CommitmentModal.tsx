import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import type { VaultFormData } from "../../../types/contracts";
import "../../../styles/create-vault-modal.css";

interface CommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateVault: (vaultData: VaultFormData) => void;
  formData: VaultFormData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aiAnalysis: any;
  isLoading?: boolean;
}

export const CommitmentModal: React.FC<CommitmentModalProps> = ({
  isOpen,
  onClose,
  onCreateVault,
  formData,
  aiAnalysis,
  isLoading = false,
}) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toUpperCase()) {
      case "LOW":
        return "#22c55e";
      case "MODERATE":
        return "#f59e0b";
      case "HIGH":
        return "#ef4444";
      case "EXTREME":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation?.toUpperCase()) {
      case "HIGHLY_RECOMMENDED":
        return "#22c55e";
      case "RECOMMENDED":
        return "#10b981";
      case "NEUTRAL":
        return "#6b7280";
      case "CAUTION":
        return "#f59e0b";
      case "NOT_RECOMMENDED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const generateCommitmentText = () => {
    // Use the converted token amount instead of USD amount
    const tokenAmount = formData._convertedTokenAmount || formData.usdAmount;
    const token = formData.token;
    const usdAmount = parseFloat(formData.usdAmount);

    if (formData.condition === "TIME_BASED") {
      return `I want to lock ${tokenAmount} ${token} (${usdAmount} USD) for ${formData.timeValue} ${formData.timeUnit}`;
    } else if (formData.condition === "PRICE_TARGET") {
      return `I want to lock ${tokenAmount} ${token} (${usdAmount} USD) until either the price goes up to $${formData.priceUp} or price goes down to $${formData.priceDown}`;
    } else if (formData.condition === "COMBO") {
      return `I want to lock ${tokenAmount} ${token} (${usdAmount} USD) for ${formData.timeValue} ${formData.timeUnit} or until the price reaches $${formData.targetPrice}`;
    }
    return "";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="create-vault-modal"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="create-vault-modal-content"
          style={{ maxWidth: "60rem" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <h2 className="modal-title">AI Commitment Analysis</h2>
            <button
              onClick={onClose}
              className="modal-close-button"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}
          >
            {/* Left Side - Commitment Summary */}
            <div style={{ flex: "0 0 40%" }}>
              <div
                style={{
                  background: "rgba(12, 17, 29, 0.6)",
                  border: "1px solid rgba(212, 74, 0, 0.15)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h4
                  style={{
                    color: "#fff",
                    fontSize: "1.1rem",
                    marginBottom: "1rem",
                    fontWeight: "600",
                  }}
                >
                  Your Commitment
                </h4>
                <div
                  style={{
                    background: "rgba(212, 74, 0, 0.1)",
                    border: "1px solid rgba(212, 74, 0, 0.3)",
                    borderRadius: "8px",
                    padding: "1rem",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    color: "#fff",
                  }}
                >
                  {generateCommitmentText()}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(12, 17, 29, 0.6)",
                  border: "1px solid rgba(212, 74, 0, 0.15)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <h4
                  style={{
                    color: "#fff",
                    fontSize: "1.1rem",
                    marginBottom: "1rem",
                    fontWeight: "600",
                  }}
                >
                  Vault Details
                </h4>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Amount:{" "}
                    </span>
                    <span style={{ fontWeight: "600" }}>
                      {formData._convertedTokenAmount || formData.usdAmount} {formData.token} (${formData.usdAmount} USD)
                    </span>
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Condition:{" "}
                    </span>
                    <span style={{ fontWeight: "600" }}>
                      {formData.condition.replace("_", " ")}
                    </span>
                  </div>
                  {formData.condition === "TIME_BASED" && (
                    <div style={{ marginBottom: "0.5rem" }}>
                      <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Duration:{" "}
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {formData.timeValue} {formData.timeUnit}
                      </span>
                    </div>
                  )}
                  {formData.condition === "PRICE_TARGET" && (
                    <>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                          Up Target:{" "}
                        </span>
                        <span style={{ fontWeight: "600", color: "#22c55e" }}>
                          ${formData.targetPrice}
                        </span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                          Down Target:{" "}
                        </span>
                        <span style={{ fontWeight: "600", color: "#ef4444" }}>
                          ${formData.priceDown}
                        </span>
                      </div>
                    </>
                  )}
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Title:{" "}
                    </span>
                    <span style={{ fontWeight: "600" }}>{formData.title}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - AI Analysis */}
            <div
              style={{
                flex: "0 0 55%",
                background:
                  "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(154, 68, 151, 0.05))",
                borderRadius: "16px",
                padding: "1.5rem",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                maxHeight: "600px",
                overflowY: "auto",
              }}
            >
              <div
                className="analysis-header"
                style={{ marginBottom: "1.5rem" }}
              >
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: "#a855f7" }} />
                  AI Analysis
                </h3>
              </div>

              {aiAnalysis ? (
                <div className="analysis-content">
                  {/* Check if it's price-based commitment */}
                  {aiAnalysis.analysis?.upTarget &&
                  aiAnalysis.analysis?.downTarget ? (
                    // Price-Based Analysis Display
                    <>
                      {/* Current Price & Targets */}
                      <div
                        style={{
                          background: "rgba(0, 0, 0, 0.3)",
                          borderRadius: "12px",
                          padding: "1rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: "1rem",
                            textAlign: "center",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "rgba(255, 255, 255, 0.6)",
                                marginBottom: "0.25rem",
                              }}
                            >
                              Current Price
                            </div>
                            <div
                              style={{
                                fontSize: "1.25rem",
                                fontWeight: "600",
                                color: "#fff",
                              }}
                            >
                              ${aiAnalysis.analysis.currentPrice}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "rgba(255, 255, 255, 0.6)",
                                marginBottom: "0.25rem",
                              }}
                            >
                              Up Target
                            </div>
                            <div
                              style={{
                                fontSize: "1.25rem",
                                fontWeight: "600",
                                color: "#22c55e",
                              }}
                            >
                              ${aiAnalysis.analysis.upTarget}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "rgba(255, 255, 255, 0.6)",
                                marginBottom: "0.25rem",
                              }}
                            >
                              Down Target
                            </div>
                            <div
                              style={{
                                fontSize: "1.25rem",
                                fontWeight: "600",
                                color: "#ef4444",
                              }}
                            >
                              ${aiAnalysis.analysis.downTarget}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Target Analysis */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        {/* Up Target Analysis */}
                        <div
                          style={{
                            background: "rgba(34, 197, 94, 0.1)",
                            border: "1px solid rgba(34, 197, 94, 0.3)",
                            borderRadius: "12px",
                            padding: "1rem",
                          }}
                        >
                          <h4
                            style={{
                              color: "#22c55e",
                              fontSize: "0.875rem",
                              marginBottom: "0.75rem",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <TrendingUp className="w-4 h-4" />
                            Up Target Analysis
                          </h4>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: "rgba(255, 255, 255, 0.8)",
                            }}
                          >
                            <div style={{ marginBottom: "0.5rem" }}>
                              <span
                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                              >
                                Probability:{" "}
                              </span>
                              <span style={{ fontWeight: "600" }}>
                                {(
                                  aiAnalysis.analysis.upTargetAnalysis
                                    .probability * 100
                                ).toFixed(0)}
                                %
                              </span>
                            </div>
                            <div style={{ marginBottom: "0.5rem" }}>
                              <span
                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                              >
                                Expected Days:{" "}
                              </span>
                              <span style={{ fontWeight: "600" }}>
                                {
                                  aiAnalysis.analysis.upTargetAnalysis
                                    .expectedDays
                                }
                              </span>
                            </div>
                            <div>
                              <span
                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                              >
                                Return:{" "}
                              </span>
                              <span
                                style={{ fontWeight: "600", color: "#22c55e" }}
                              >
                                +
                                {aiAnalysis.analysis.expectedReturn.upScenario.toFixed(
                                  2
                                )}
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Down Target Analysis */}
                        <div
                          style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "12px",
                            padding: "1rem",
                          }}
                        >
                          <h4
                            style={{
                              color: "#ef4444",
                              fontSize: "0.875rem",
                              marginBottom: "0.75rem",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <TrendingDown className="w-4 h-4" />
                            Down Target Analysis
                          </h4>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: "rgba(255, 255, 255, 0.8)",
                            }}
                          >
                            <div style={{ marginBottom: "0.5rem" }}>
                              <span
                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                              >
                                Probability:{" "}
                              </span>
                              <span style={{ fontWeight: "600" }}>
                                {(
                                  aiAnalysis.analysis.downTargetAnalysis
                                    .probability * 100
                                ).toFixed(0)}
                                %
                              </span>
                            </div>
                            <div style={{ marginBottom: "0.5rem" }}>
                              <span
                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                              >
                                Expected Days:{" "}
                              </span>
                              <span style={{ fontWeight: "600" }}>
                                {
                                  aiAnalysis.analysis.downTargetAnalysis
                                    .expectedDays
                                }
                              </span>
                            </div>
                            <div>
                              <span
                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                              >
                                Loss:{" "}
                              </span>
                              <span
                                style={{ fontWeight: "600", color: "#ef4444" }}
                              >
                                {aiAnalysis.analysis.expectedReturn.downScenario.toFixed(
                                  2
                                )}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Overall Risk & Expected Return */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <div
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "12px",
                            padding: "1rem",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "600",
                              color: getRiskColor(
                                aiAnalysis.analysis.overallRisk
                              ),
                            }}
                          >
                            {aiAnalysis.analysis.overallRisk}
                          </div>
                          <div
                            style={{
                              color: "rgba(255, 255, 255, 0.6)",
                              fontSize: "0.875rem",
                            }}
                          >
                            Risk Level
                          </div>
                        </div>
                        <div
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "12px",
                            padding: "1rem",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "600",
                              color:
                                aiAnalysis.analysis.expectedReturn
                                  .weightedAverage > 0
                                  ? "#22c55e"
                                  : "#ef4444",
                            }}
                          >
                            {aiAnalysis.analysis.expectedReturn
                              .weightedAverage > 0
                              ? "+"
                              : ""}
                            {aiAnalysis.analysis.expectedReturn.weightedAverage.toFixed(
                              2
                            )}
                            %
                          </div>
                          <div
                            style={{
                              color: "rgba(255, 255, 255, 0.6)",
                              fontSize: "0.875rem",
                            }}
                          >
                            Expected Return
                          </div>
                        </div>
                      </div>

                      {/* Insights */}
                      {aiAnalysis.analysis.insights && (
                        <div
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "12px",
                            padding: "1rem",
                            marginBottom: "1.5rem",
                          }}
                        >
                          <h4
                            style={{
                              color: "#fff",
                              fontSize: "0.875rem",
                              marginBottom: "0.75rem",
                              fontWeight: "600",
                            }}
                          >
                            Key Insights
                          </h4>
                          <ul
                            style={{
                              margin: 0,
                              padding: "0 0 0 1.25rem",
                              fontSize: "0.875rem",
                              color: "rgba(255, 255, 255, 0.8)",
                              lineHeight: "1.6",
                            }}
                          >
                            {aiAnalysis.analysis.insights
                              .slice(0, 4)
                              .map((insight: string, idx: number) => (
                                <li
                                  key={idx}
                                  style={{ marginBottom: "0.5rem" }}
                                >
                                  {insight}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendations */}
                      {aiAnalysis.analysis.recommendations && (
                        <div
                          style={{
                            background: "rgba(139, 92, 246, 0.1)",
                            border: "1px solid rgba(139, 92, 246, 0.3)",
                            borderRadius: "12px",
                            padding: "1rem",
                          }}
                        >
                          <h4
                            style={{
                              color: "#a855f7",
                              fontSize: "0.875rem",
                              marginBottom: "0.75rem",
                              fontWeight: "600",
                            }}
                          >
                            Recommendations
                          </h4>
                          <ul
                            style={{
                              margin: 0,
                              padding: "0 0 0 1.25rem",
                              fontSize: "0.875rem",
                              color: "rgba(255, 255, 255, 0.8)",
                              lineHeight: "1.6",
                            }}
                          >
                            {aiAnalysis.analysis.recommendations.map(
                              (rec: string, idx: number) => (
                                <li
                                  key={idx}
                                  style={{ marginBottom: "0.5rem" }}
                                >
                                  {rec}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Score and Risk Level */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <div
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "12px",
                            padding: "1rem",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "2rem",
                              fontWeight: "700",
                              color: "#fff",
                            }}
                          >
                            {aiAnalysis.analysis?.score || 0}/100
                          </div>
                          <div
                            style={{
                              color: "rgba(255, 255, 255, 0.6)",
                              fontSize: "0.875rem",
                            }}
                          >
                            Commitment Score
                          </div>
                        </div>
                        <div
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "12px",
                            padding: "1rem",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "600",
                              color: getRiskColor(
                                aiAnalysis.analysis?.riskLevel
                              ),
                            }}
                          >
                            {aiAnalysis.analysis?.riskLevel || "Unknown"}
                          </div>
                          <div
                            style={{
                              color: "rgba(255, 255, 255, 0.6)",
                              fontSize: "0.875rem",
                            }}
                          >
                            Risk Level
                          </div>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div
                        style={{
                          background: "rgba(0, 0, 0, 0.3)",
                          borderRadius: "12px",
                          padding: "1rem",
                          marginBottom: "1.5rem",
                          borderLeft: `4px solid ${getRecommendationColor(
                            aiAnalysis.analysis?.recommendation
                          )}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: getRecommendationColor(
                              aiAnalysis.analysis?.recommendation
                            ),
                            marginBottom: "0.5rem",
                          }}
                        >
                          Recommendation:{" "}
                          {aiAnalysis.analysis?.recommendation?.replace(
                            /_/g,
                            " "
                          )}
                        </div>
                      </div>

                      {/* Fear & Greed Index */}
                      {aiAnalysis.fearAndGreed && (
                        <div
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "12px",
                            padding: "1rem",
                            marginBottom: "1.5rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                              Fear & Greed Index
                            </span>
                            <span
                              style={{
                                color:
                                  aiAnalysis.fearAndGreed.value > 50
                                    ? "#f59e0b"
                                    : "#3b82f6",
                                fontWeight: "600",
                              }}
                            >
                              {aiAnalysis.fearAndGreed.value} (
                              {aiAnalysis.fearAndGreed.classification})
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Expected Returns */}
                      {aiAnalysis.analysis?.expectedReturn && (
                        <div
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "12px",
                            padding: "1rem",
                            marginBottom: "1.5rem",
                          }}
                        >
                          <h4
                            style={{
                              color: "#fff",
                              fontSize: "0.875rem",
                              marginBottom: "0.75rem",
                              fontWeight: "600",
                            }}
                          >
                            Expected Returns
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  color: "rgba(255, 255, 255, 0.6)",
                                  fontSize: "0.875rem",
                                }}
                              >
                                Expected Return
                              </span>
                              <span
                                style={{
                                  color:
                                    aiAnalysis.analysis.expectedReturn
                                      .expectedReturnPercentage > 0
                                      ? "#22c55e"
                                      : "#ef4444",
                                  fontWeight: "600",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                }}
                              >
                                {aiAnalysis.analysis.expectedReturn
                                  .expectedReturnPercentage > 0 ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                {aiAnalysis.analysis.expectedReturn.expectedReturnPercentage.toFixed(
                                  2
                                )}
                                %
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "0.875rem",
                              }}
                            >
                              <span
                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                              >
                                Best Case
                              </span>
                              <span style={{ color: "#22c55e" }}>
                                $
                                {aiAnalysis.analysis.expectedReturn.bestCaseScenario.toFixed(
                                  2
                                )}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "0.875rem",
                              }}
                            >
                              <span
                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                              >
                                Worst Case
                              </span>
                              <span style={{ color: "#ef4444" }}>
                                $
                                {aiAnalysis.analysis.expectedReturn.worstCaseScenario.toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Factors */}
                      <div
                        style={{
                          background: "rgba(0, 0, 0, 0.3)",
                          borderRadius: "12px",
                          padding: "1rem",
                          marginTop: "1rem",
                        }}
                      >
                        <h4
                          style={{
                            color: "#fff",
                            fontSize: "0.875rem",
                            marginBottom: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          Factors
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            padding: "0 0 0 1.25rem",
                            fontSize: "0.875rem",
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: "1.6",
                          }}
                        >
                          {aiAnalysis.analysis?.factors
                            ?.slice(0, 3)
                            .map((insight: string, idx: number) => (
                              <li key={idx} style={{ marginBottom: "0.5rem" }}>
                                {insight}
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Key Insights */}
                      <div
                        style={{
                          background: "rgba(0, 0, 0, 0.3)",
                          borderRadius: "12px",
                          padding: "1rem",
                          marginTop: "1rem",
                        }}
                      >
                        <h4
                          style={{
                            color: "#fff",
                            fontSize: "0.875rem",
                            marginBottom: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          Key Insights
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            padding: "0 0 0 1.25rem",
                            fontSize: "0.875rem",
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: "1.6",
                          }}
                        >
                          {aiAnalysis.analysis?.behavioralInsights
                            ?.slice(0, 3)
                            .map((insight: string, idx: number) => (
                              <li key={idx} style={{ marginBottom: "0.5rem" }}>
                                {insight}
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Suggested Optimizations */}
                      <div
                        style={{
                          background: "rgba(0, 0, 0, 0.3)",
                          borderRadius: "12px",
                          padding: "1rem",
                          marginTop: "1rem",
                        }}
                      >
                        <h4
                          style={{
                            color: "#fff",
                            fontSize: "0.875rem",
                            marginBottom: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          Suggested Optimizations
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            padding: "0 0 0 1.25rem",
                            fontSize: "0.875rem",
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: "1.6",
                          }}
                        >
                          {aiAnalysis.analysis?.suggestedOptimizations
                            ?.slice(0, 3)
                            .map((insight: string, idx: number) => (
                              <li key={idx} style={{ marginBottom: "0.5rem" }}>
                                {insight}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <AlertCircle
                    className="w-12 h-12"
                    style={{ color: "#ef4444", margin: "0 auto 1rem" }}
                  />
                  <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    No analysis data available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(212, 74, 0, 0.1)",
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "0.75rem 1.5rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              }}
            >
              Back to Edit
            </button>

            <button
              onClick={() => onCreateVault(formData)}
              className="commitment-action-btn"
              disabled={isLoading}
            >
              <span className="btn_wrapper">
                <span className="btn_label">
                  {isLoading ? "Creating Vault..." : "Create Vault"}
                </span>
                <span className="btn_icon_right">
                  {isLoading ? (
                    <div className="loading-spinner" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </span>
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
