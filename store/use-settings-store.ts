'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Provider types
export type ProviderId = 'google' | 'openrouter'

export interface Provider {
  id: ProviderId
  name: string
  defaultBaseUrl: string
  modelsEndpoint: string
}

// Available providers configuration
export const PROVIDERS: Record<ProviderId, Provider> = {
  google: {
    id: 'google',
    name: 'Google AI',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    modelsEndpoint: '/models',
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    modelsEndpoint: '/models',
  },
}

// Model info type
export interface ModelInfo {
  id: string
  name: string
  description?: string
}

// Locale type
export type Locale = 'zh' | 'en'

interface SettingsState {
  // Active provider
  activeProvider: ProviderId
  
  // Locale setting
  locale: Locale
  
  // API Keys (provider id -> api key)
  apiKeys: Record<string, string>
  
  // Base URLs (provider id -> base url)
  baseUrls: Record<string, string>
  
  // Selected model for each provider
  selectedModels: Record<string, string>
  
  // Cached models for each provider
  cachedModels: Record<string, ModelInfo[]>
  
  // Loading state for model fetching
  isLoadingModels: boolean
  
  // Error message
  error: string | null
  
  // Actions
  setActiveProvider: (provider: ProviderId) => void
  setLocale: (locale: Locale) => void
  setApiKey: (provider: ProviderId, key: string) => void
  setBaseUrl: (provider: ProviderId, url: string) => void
  setSelectedModel: (provider: ProviderId, model: string) => void
  setCachedModels: (provider: ProviderId, models: ModelInfo[]) => void
  setIsLoadingModels: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed getters
  getActiveApiKey: () => string
  getActiveBaseUrl: () => string
  getActiveSelectedModel: () => string
  getActiveModels: () => ModelInfo[]
}

// Get API key from environment variables as fallback
const getEnvApiKey = (provider: ProviderId): string => {
  if (typeof window === 'undefined') return ''
  
  switch (provider) {
    case 'google':
      return process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''
    case 'openrouter':
      return process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''
    default:
      return ''
  }
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      activeProvider: 'google',
      locale: 'zh',
      apiKeys: {},
      baseUrls: {},
      selectedModels: {},
      cachedModels: {},
      isLoadingModels: false,
      error: null,
      
      setActiveProvider: (provider) => set({ activeProvider: provider, error: null }),
      
      setLocale: (locale) => {
        set({ locale })
        // Set cookie for server-side access
        document.cookie = `locale=${locale};path=/;max-age=31536000`
      },
      
      setApiKey: (provider, key) => set((state) => ({
        apiKeys: { ...state.apiKeys, [provider]: key },
        error: null,
      })),
      
      setBaseUrl: (provider, url) => set((state) => ({
        baseUrls: { ...state.baseUrls, [provider]: url },
      })),
      
      setSelectedModel: (provider, model) => set((state) => ({
        selectedModels: { ...state.selectedModels, [provider]: model },
      })),
      
      setCachedModels: (provider, models) => set((state) => ({
        cachedModels: { ...state.cachedModels, [provider]: models },
      })),
      
      setIsLoadingModels: (loading) => set({ isLoadingModels: loading }),
      
      setError: (error) => set({ error }),
      
      // Get API key: prioritize localStorage, fallback to env
      getActiveApiKey: () => {
        const state = get()
        const storedKey = state.apiKeys[state.activeProvider]
        if (storedKey) return storedKey
        return getEnvApiKey(state.activeProvider)
      },
      
      // Get base URL: prioritize localStorage, fallback to default
      getActiveBaseUrl: () => {
        const state = get()
        const storedUrl = state.baseUrls[state.activeProvider]
        if (storedUrl) return storedUrl
        return PROVIDERS[state.activeProvider].defaultBaseUrl
      },
      
      // Get selected model for active provider
      getActiveSelectedModel: () => {
        const state = get()
        return state.selectedModels[state.activeProvider] || ''
      },
      
      // Get cached models for active provider
      getActiveModels: () => {
        const state = get()
        return state.cachedModels[state.activeProvider] || []
      },
    }),
    {
      name: 'next-g-prompt-settings',
      // Only persist these fields
      partialize: (state) => ({
        activeProvider: state.activeProvider,
        locale: state.locale,
        apiKeys: state.apiKeys,
        baseUrls: state.baseUrls,
        selectedModels: state.selectedModels,
        cachedModels: state.cachedModels,
      }),
    }
  )
)

// Fetch models from API
export async function fetchModelsFromApi(
  provider: ProviderId,
  apiKey: string,
  baseUrl: string
): Promise<ModelInfo[]> {
  if (!apiKey) {
    throw new Error('API Key is required')
  }
  
  const providerConfig = PROVIDERS[provider]
  
  if (provider === 'google') {
    // Google API: /models?key=API_KEY
    const response = await fetch(`${baseUrl}${providerConfig.modelsEndpoint}?key=${apiKey}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `Failed to fetch models: ${response.status}`)
    }
    
    const data = await response.json()
    return (data.models || [])
      .filter((m: { name: string }) => m.name.includes('gemini'))
      .map((m: { name: string; displayName?: string; description?: string }) => ({
        id: m.name.replace('models/', ''),
        name: m.displayName || m.name.replace('models/', ''),
        description: m.description,
      }))
  }
  
  if (provider === 'openrouter') {
    // OpenRouter API: /models with Bearer token
    const response = await fetch(`${baseUrl}${providerConfig.modelsEndpoint}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `Failed to fetch models: ${response.status}`)
    }
    
    const data = await response.json()
    return (data.data || []).map((m: { id: string; name?: string; description?: string }) => ({
      id: m.id,
      name: m.name || m.id,
      description: m.description,
    }))
  }
  
  return []
}
