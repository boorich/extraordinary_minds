export interface Memory {
  content: string;
  timestamp: number;
  type: 'response' | 'evaluation' | 'observation';
  metadata: {
    relevance?: number;
    context?: string;
    round?: number;
  };
}

export class ConversationMemory {
  private memories: Memory[] = [];
  private capacity: number;

  constructor(capacity: number = 10) {
    this.capacity = capacity;
  }

  addMemory(content: string, type: Memory['type'], metadata: Memory['metadata'] = {}) {
    const memory: Memory = {
      content,
      timestamp: Date.now(),
      type,
      metadata
    };

    this.memories.unshift(memory);
    if (this.memories.length > this.capacity) {
      this.memories.pop();
    }
  }

  retrieveRelevant(context: string, limit: number = 3): Memory[] {
    return this.memories
      .filter(memory => {
        // Basic relevance check - can be enhanced with embeddings
        return memory.content.toLowerCase().includes(context.toLowerCase()) ||
               (memory.metadata.context?.toLowerCase().includes(context.toLowerCase()));
      })
      .slice(0, limit);
  }

  getAllMemories(): Memory[] {
    return [...this.memories];
  }

  clear() {
    this.memories = [];
  }
}