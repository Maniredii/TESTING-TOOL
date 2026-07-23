import { EventEmitter } from 'events';

export class AutomationEventEmitter extends EventEmitter {
  private static instance: AutomationEventEmitter;

  private constructor() {
    super();
    this.setMaxListeners(50);
  }

  public static getInstance(): AutomationEventEmitter {
    if (!AutomationEventEmitter.instance) {
      AutomationEventEmitter.instance = new AutomationEventEmitter();
    }
    return AutomationEventEmitter.instance;
  }
}
