"use client";

import { useState } from "react";
import { BASE_CONFIG } from "@/lib/constants";
import { useAccount } from "wagmi";
import { BasePayButton } from "@base-account-kit/react";

// Recipient address for the payment (game developer wallet)
const RECIPIENT_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_RECIPIENT || "0x0000000000000000000000000000000000000000";

interface BasePayButtonWrapperProps {
  onPaymentSuccess: () => void;
  disabled?: boolean;
}

export function BasePayButtonWrapper({ onPaymentSuccess, disabled = false }: BasePayButtonWrapperProps) {
  const { isConnected } = useAccount();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    onPaymentSuccess();
  };

  const handlePaymentError = (err: any) => {
    console.error("BasePayButton error:", err);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <BasePayButton
        paymentOptions={{
          amount: BASE_CONFIG.payAmount,
          to: RECIPIENT_ADDRESS,
          testnet: true,
        }}
        colorScheme="dark"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        disabled={disabled || paymentSuccess}
      />
      {!isConnected && (
        <p className="text-xs text-gray-400">Connect wallet to unlock exclusive content</p>
      )}
      {paymentSuccess && (
        <p className="text-xs text-green-400">✓ Payment confirmed! Flat Cap unlocked!</p>
      )}
    </div>
  );
}