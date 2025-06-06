import {
  ButtonIcon,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@beep/ui'
import { useTranslation } from 'react-i18next'

interface DeleteRoleDialogProps {
  onDelete?: () => void
}
export function DeleteRoleDialogContent({ onDelete }: DeleteRoleDialogProps) {
  const { t } = useTranslation()
  return (
    <DialogContent className="bg-violet-50" title="Delete Role">
      <DialogTitle hidden>
        {t('role-settings.delete-role-dialog.title')}
      </DialogTitle>
      <DialogHeader>{t('role-settings.delete-role-dialog.title')}</DialogHeader>
      <DialogDescription>
        {t('role-settings.delete-role-dialog.description')}
      </DialogDescription>
      <DialogFooter>
        <DialogClose>
          <ButtonIcon
            title={t('cancel')}
            className="bg-transparent"
            textClassName="hover:underline"
            buttonProps={{ variant: 'ghost' }}
          />
        </DialogClose>
        <DialogClose>
          <ButtonIcon
            className="bg-red-500"
            title={t('remove')}
            buttonProps={{ variant: 'ghost' }}
            onClick={onDelete}
          />
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
