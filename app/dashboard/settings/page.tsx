'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useSettingsStore,
  PROVIDERS,
  fetchModelsFromApi,
  type ProviderId,
  type ModelInfo,
} from '@/store/use-settings-store'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { useTranslations } from 'next-intl'

export default function SettingsPage() {
  const t = useTranslations('settings')
  const {
    activeProvider,
    setActiveProvider,
    setApiKey,
    setBaseUrl,
    setSelectedModel,
    setCachedModels,
    getActiveApiKey,
    getActiveBaseUrl,
    getActiveSelectedModel,
    getActiveModels,
    isLoadingModels,
    setIsLoadingModels,
    error,
    setError,
  } = useSettingsStore()

  const [showApiKey, setShowApiKey] = useState(false)
  const [localApiKey, setLocalApiKey] = useState('')
  const [localBaseUrl, setLocalBaseUrl] = useState('')
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync local state with store after hydration
  useEffect(() => {
    if (mounted) {
      setLocalApiKey(getActiveApiKey())
      setLocalBaseUrl(getActiveBaseUrl())
    }
  }, [mounted, activeProvider, getActiveApiKey, getActiveBaseUrl])

  // Fetch models when API key changes
  const handleFetchModels = useCallback(async () => {
    const apiKey = localApiKey || getActiveApiKey()
    const baseUrl = localBaseUrl || getActiveBaseUrl()
    
    if (!apiKey) {
      setError(t('model.enterApiKeyFirst'))
      return
    }

    setIsLoadingModels(true)
    setError(null)

    try {
      const models = await fetchModelsFromApi(activeProvider, apiKey, baseUrl)
      setCachedModels(activeProvider, models)
      
      // Auto-select first model if none selected
      if (models.length > 0 && !getActiveSelectedModel()) {
        setSelectedModel(activeProvider, models[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models')
    } finally {
      setIsLoadingModels(false)
    }
  }, [
    activeProvider,
    localApiKey,
    localBaseUrl,
    getActiveApiKey,
    getActiveBaseUrl,
    getActiveSelectedModel,
    setCachedModels,
    setSelectedModel,
    setIsLoadingModels,
    setError,
    t,
  ])

  // Save configuration
  const handleSave = () => {
    setApiKey(activeProvider, localApiKey)
    setBaseUrl(activeProvider, localBaseUrl)
    
    // Auto-fetch models after saving
    if (localApiKey) {
      handleFetchModels()
    }
  }

  if (!mounted) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-8" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  const models = getActiveModels()
  const selectedModel = getActiveSelectedModel()

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('language.title')}</CardTitle>
            <CardDescription>
              {t('language.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>{t('language.label')}</Label>
              <LanguageSwitcher className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Provider Selection */}
        <Card>
          <CardHeader>
            <CardTitle>{t('provider.title')}</CardTitle>
            <CardDescription>
              {t('provider.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.values(PROVIDERS).map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setActiveProvider(provider.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    activeProvider === provider.id
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="font-medium">{provider.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    {provider.defaultBaseUrl}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>{t('api.title')}</CardTitle>
            <CardDescription>
              {t('api.description', { provider: PROVIDERS[activeProvider].name })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* API Key */}
            <div className="space-y-2">
              <Label htmlFor="apiKey">{t('api.apiKey')}</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={localApiKey}
                    onChange={(e) => setLocalApiKey(e.target.value)}
                    placeholder={t('api.apiKeyPlaceholder')}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                  type="button"
                >
                  {showApiKey ? '🙈' : '👁️'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('api.apiKeyHint')}
              </p>
            </div>

            {/* Base URL */}
            <div className="space-y-2">
              <Label htmlFor="baseUrl">{t('api.baseUrl')}</Label>
              <Input
                id="baseUrl"
                type="url"
                value={localBaseUrl}
                onChange={(e) => setLocalBaseUrl(e.target.value)}
                placeholder={PROVIDERS[activeProvider].defaultBaseUrl}
              />
              <p className="text-xs text-muted-foreground">
                {t('api.default')}: {PROVIDERS[activeProvider].defaultBaseUrl}
              </p>
            </div>

            {/* Save Button */}
            <Button onClick={handleSave} className="w-full">
              {t('api.saveConfig')}
            </Button>
          </CardContent>
        </Card>

        {/* Model Selection */}
        <Card>
          <CardHeader>
            <CardTitle>{t('model.title')}</CardTitle>
            <CardDescription>
              {t('model.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  value={selectedModel}
                  onValueChange={(value) => setSelectedModel(activeProvider, value)}
                  disabled={models.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      models.length === 0 
                        ? t('model.fetchFirst')
                        : t('model.selectModel')
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model: ModelInfo) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={handleFetchModels}
                disabled={isLoadingModels}
              >
                {isLoadingModels ? t('common.loading') : t('model.refresh')}
              </Button>
            </div>
            
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            
            {models.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {t('model.modelsAvailable', { count: models.length })}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Current Configuration Summary */}
        <Card>
          <CardHeader>
            <CardTitle>{t('currentConfig.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t('currentConfig.provider')}:</dt>
                <dd className="font-medium">{PROVIDERS[activeProvider].name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t('currentConfig.apiKey')}:</dt>
                <dd className="font-medium">
                  {localApiKey ? '••••••••' + localApiKey.slice(-4) : t('currentConfig.notConfigured')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t('currentConfig.model')}:</dt>
                <dd className="font-medium">{selectedModel || t('currentConfig.notSelected')}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
