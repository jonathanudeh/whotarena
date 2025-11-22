export interface WalletAccount {
  id: number
  bank: string
  accountNumber: string
  accountName: string
  created_at: string
}

export type WalletForm = {
  bank: string
  accountNumber: string
  accountName: string
}

export interface UploadDepositParams {
  amount: number
  imgFileProof: File
  info: {
    userId: string
    type: string
    status: string
  }
}

type Transaction = {
  id: number
  type: string
  created_at: string | Date
  amount: number
  status: string
}

export interface TransactionListProps {
  transaction: Transaction
}
