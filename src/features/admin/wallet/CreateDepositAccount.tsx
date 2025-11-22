import { useEffect, useState } from 'react'
import AdminFormRow from '../../../components/AdminFormRow'
import Button from '../../../components/Button'
import { useForm } from 'react-hook-form'
import { useGetWalletAccount } from '../../../hooks/useGetWalletAccount'
import { HiPencil } from 'react-icons/hi2'
import { useCreatWalletAccount } from './useCreateWalletAccount'
import { useEditWalletAccount } from './useEditWalletAccount'
import type { WalletForm } from '../../../types/wallet'

function CreateDepositAccount() {
  const [openForm, setOpenForm] = useState(false)

  const { getWalletAccount = [], isGettingAccount } = useGetWalletAccount()
  const { createWallet, iscreatingWallet } = useCreatWalletAccount()
  const { editWallet, isEditingWallet } = useEditWalletAccount()
  // select * returns an array so we get that one row and set default to empty object incase its still undefined || still fetching on render
  const { id: walletId, bank: bankName, accountNumber, accountName } = getWalletAccount[0] || {}
  const { register, formState, reset, handleSubmit } = useForm<WalletForm>({
    defaultValues: {
      bank: bankName || '',
      accountNumber: accountNumber || '',
      accountName: accountName || ''
    }
  })
  const { errors, isDirty } = formState

  const isEditSession = Boolean(walletId)
  const isLoading = isGettingAccount || iscreatingWallet || isEditingWallet

  function onSubmit(data: WalletForm) {
    if (!isDirty) {
      setOpenForm(false)
      return
    }

    if (isEditSession) {
      editWallet({ id: walletId, newWallet: data }, { onSettled: () => setOpenForm(false) })
    } else {
      createWallet({ newWallet: data }, { onSettled: () => setOpenForm(false) })
    }

    console.log(data)
  }

  function handleCancel() {
    reset()
    setOpenForm(false)
  }

  useEffect(() => {
    if (getWalletAccount[0]) {
      reset({
        bank: getWalletAccount[0].bank,
        accountNumber: getWalletAccount[0].accountNumber,
        accountName: getWalletAccount[0].accountName
      })
    }
  }, [getWalletAccount, reset])

  return (
    <div>
      {openForm ? (
        <form
          className="bg-card-bg flex flex-col gap-2 rounded-lg px-6 py-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <AdminFormRow
            classname="flex justify-between items-center"
            label="Bank"
            error={errors?.bank?.message}
          >
            <input
              type="text"
              id="bank"
              className="bg-background border-border/30 border px-2"
              {...register('bank', { required: 'Bank name required' })}
              disabled={isLoading}
            />
          </AdminFormRow>
          <AdminFormRow
            classname="flex justify-between items-center"
            label="Acct. number"
            error={errors?.accountNumber?.message}
          >
            <input
              type="text"
              id="accountNumber"
              className="bg-background border-border/30 border px-2"
              {...register('accountNumber', { required: 'Bank Account required' })}
              disabled={isLoading}
            />
          </AdminFormRow>
          <AdminFormRow
            classname="flex justify-between items-center"
            label="Acct. name"
            error={errors?.accountName?.message}
          >
            <input
              type="text"
              id="accountName"
              className="bg-background border-border/30 border px-2"
              {...register('accountName', { required: 'Bank Account required' })}
              disabled={isLoading}
            />
          </AdminFormRow>

          <div className="flex gap-4 self-end">
            <Button
              size="small"
              variation="secondary"
              type="reset"
              disabled={isLoading}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button size="small" disabled={isLoading}>
              {isEditSession ? 'Edit' : 'Create'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-card-bg space-y-4 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-green-400">Bank Details</h3>
            <button onClick={() => setOpenForm(true)}>
              <HiPencil />
            </button>
          </div>
          <div className="flex justify-between gap-3">
            <InfoRow label="Bank" value={bankName} />
            <InfoRow label="Account N0." value={accountNumber} />
            <InfoRow label="Account Name" value={accountName} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateDepositAccount

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-center text-sm text-gray-300">{label}</span>
      <div className="text-center">
        <span className="font-bold">{value}</span>
      </div>
    </div>
  )
}
