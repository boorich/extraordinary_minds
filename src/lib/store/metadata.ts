import { create } from 'zustand'
import { ComponentMetadata } from '../network/types'

interface MetadataStore {
  nodeMetadata: Record<string, ComponentMetadata>
  registerMetadata: (id: string, metadata: ComponentMetadata) => void
  getMetadata: (id: string) => ComponentMetadata | undefined
  clear: () => void
}

export const useMetadataStore = create<MetadataStore>((set, get) => ({
  nodeMetadata: {},
  registerMetadata: (id, metadata) => 
    set(state => ({ 
      nodeMetadata: { ...state.nodeMetadata, [id]: metadata }
    })),
  getMetadata: (id) => get().nodeMetadata[id],
  clear: () => set({ nodeMetadata: {} })
}))