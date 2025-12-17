import { create } from 'zustand'

export type ToneType = 'professional' | 'casual' | 'friendly' | 'formal' | 'creative'
export type FormatType = 'markdown' | 'json' | 'plain' | 'structured'
export type RoleType = 'assistant' | 'developer' | 'analyst' | 'writer' | 'expert' | 'custom'

interface PromptSettings {
  tone: ToneType
  format: FormatType
  role: RoleType
  customRole: string
}

interface PromptState {
  // Core content
  title: string
  content: string
  description: string
  variables: Record<string, string>
  
  // Settings
  settings: PromptSettings
  
  // Computed
  isDirty: boolean
  
  // Actions
  setTitle: (title: string) => void
  setContent: (content: string) => void
  setDescription: (description: string) => void
  setVariable: (key: string, value: string) => void
  setSetting: <K extends keyof PromptSettings>(key: K, value: PromptSettings[K]) => void
  reset: () => void
  loadPrompt: (data: Partial<PromptState>) => void
}

const initialSettings: PromptSettings = {
  tone: 'professional',
  format: 'markdown',
  role: 'assistant',
  customRole: '',
}

// Simple heuristic: ~4 chars per token for English
export const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4)
}

export const usePromptStore = create<PromptState>((set) => ({
  title: '',
  content: '',
  description: '',
  variables: {},
  settings: { ...initialSettings },
  isDirty: false,
  
  setTitle: (title) => set({ title, isDirty: true }),
  setContent: (content) => set({ content, isDirty: true }),
  setDescription: (description) => set({ description, isDirty: true }),
  setVariable: (key, value) => set((state) => ({
    variables: { ...state.variables, [key]: value },
    isDirty: true
  })),
  setSetting: (key, value) => set((state) => ({
    settings: { ...state.settings, [key]: value },
    isDirty: true
  })),
  reset: () => set({ 
    title: '', 
    content: '', 
    description: '',
    variables: {}, 
    settings: { ...initialSettings },
    isDirty: false
  }),
  loadPrompt: (data) => set({ ...data, isDirty: false })
}))
