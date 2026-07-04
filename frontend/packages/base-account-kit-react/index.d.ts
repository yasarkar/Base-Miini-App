import { ReactNode } from 'react';

export interface UseBaseAccountResult {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
}

export declare function useBaseAccount(): UseBaseAccountResult;

export interface BaseAccountProviderProps {
  children: ReactNode;
  config?: any;
}

export declare function BaseAccountProvider(props: BaseAccountProviderProps): JSX.Element;

export interface BasePayButtonProps {
  paymentOptions?: {
    amount: string;
    to: string;
    testnet?: boolean;
    currency?: string;
  };
  colorScheme?: 'light' | 'dark';
  onSuccess?: () => void;
  onError?: (error: any) => void;
  disabled?: boolean;
}

export declare function BasePayButton(props: BasePayButtonProps): JSX.Element;
