import { Button, ButtonStyle, Icon } from '@beep/ui'
import { useTranslation } from 'react-i18next'

interface PageConfirmEmailProps {
  onSignin: () => void
}

export default function PageConfirmEmail({ onSignin }: PageConfirmEmailProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6 justify-center items-start">
      <h1 className="font-extrabold">
        {t('auth.page-confirm-email.check_email')}
      </h1>
      <div className="flex flex-row gap-2 items-center">
        <h5>{t('auth.page-confirm-email.confirm_account')}</h5>
        <Button style={ButtonStyle.NONE} onClick={onSignin}>
          <Icon name="lucide:arrow-right" />
        </Button>
      </div>
    </div>
  )
}
