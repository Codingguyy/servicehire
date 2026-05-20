import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  isLoading?: boolean
}

export const ConfirmDialog: React.FC<Props> = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
    <div className="flex items-start gap-3 mb-5">
      <div className="p-2 rounded-full bg-red-100 dark:bg-red-500/10 flex-shrink-0">
        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 pt-1">{message}</p>
    </div>
    <div className="flex justify-end gap-2">
      <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>Cancel</Button>
      <Button variant="danger" size="sm" onClick={onConfirm} isLoading={isLoading}>Delete</Button>
    </div>
  </Modal>
)
