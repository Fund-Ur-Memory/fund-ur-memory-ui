// Simple event emitter for application events
class EventEmitter {
  private events: Record<string, Function[]> = {}

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return
    this.events[event].forEach(callback => callback(...args))
  }
}

export const appEvents = new EventEmitter()

// Event types
export const APP_EVENTS = {
  VAULT_CREATED: 'vault_created',
  VAULT_WITHDRAWN: 'vault_withdrawn',
  DASHBOARD_REFRESH: 'dashboard_refresh'
} as const