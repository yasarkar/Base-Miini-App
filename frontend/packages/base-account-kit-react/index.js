// Mock implementation of @base-account-kit/react
import React, { useState, createContext, useContext, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';

const BaseAccountContext = createContext({ config: {} });

export function useBaseAccount() {
  const { address, isConnected, isConnecting } = useAccount();
  return {
    address: address || null,
    isConnected,
    isConnecting,
  };
}

export function BaseAccountProvider({ children, config }) {
  return React.createElement(
    BaseAccountContext.Provider,
    { value: { config: config || {} } },
    children
  );
}

const USDC_ABI = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
];

export function BasePayButton({ paymentOptions, onSuccess, onError, disabled }) {
  const { isConnected } = useAccount();
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState(null);
  
  const { config } = useContext(BaseAccountContext);
  const paymasterUrl = config?.paymasterUrl || process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://api.developer.coinbase.com/rpc/v1/base-sepolia/mock";

  const { writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash || undefined,
    });

  const handlePay = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    setIsPaying(true);

    try {
      const amount = parseUnits(paymentOptions?.amount || "0.5", 6); // USDC has 6 decimals

      writeContract(
        {
          address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
          abi: USDC_ABI,
          functionName: "transfer",
          args: [paymentOptions?.to, amount],
          capabilities: {
            paymasterService: {
              url: paymasterUrl,
            },
          },
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash);
          },
          onError: (error) => {
            console.error("BasePayButton payment failed:", error);
            setIsPaying(false);
            if (onError) onError(error);
          },
        }
      );
    } catch (error) {
      console.error("BasePayButton error:", error);
      setIsPaying(false);
      if (onError) onError(error);
    }
  };

  // Handle confirmation
  useEffect(() => {
    if (isConfirmed && txHash) {
      setIsPaying(false);
      setTxHash(null);
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isConfirmed, txHash, onSuccess]);

  const isPending = isPaying || isConfirming;

  return React.createElement(
    'button',
    {
      onClick: handlePay,
      disabled: disabled || isPending,
      className: `w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border-none cursor-pointer ${
        disabled 
          ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
          : 'bg-[#0052FF] text-white hover:bg-[#0041CC] active:scale-95'
      }`,
      style: {
        outline: 'none',
        boxShadow: isPending ? 'none' : '0 4px 12px rgba(0, 82, 255, 0.2)'
      }
    },
    isPending ? 'Processing transaction...' : `⚡ Pay ${paymentOptions?.amount || '0.5'} USDC with Base`
  );
}
