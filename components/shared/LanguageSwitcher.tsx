'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSettingsStore, type Locale } from '@/store/use-settings-store'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useSettingsStore()
  const router = useRouter()
  const t = useTranslations('settings.language')

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as Locale)
    // Refresh the page to apply new locale
    router.refresh()
  }

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="zh">{t('zh')}</SelectItem>
        <SelectItem value="en">{t('en')}</SelectItem>
      </SelectContent>
    </Select>
  )
}
