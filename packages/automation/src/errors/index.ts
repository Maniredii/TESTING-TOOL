export class AutomationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BrowserLaunchError extends AutomationError {
  constructor(message: string) {
    super(message, 'BROWSER_LAUNCH_ERROR');
  }
}

export class ContextCreationError extends AutomationError {
  constructor(message: string) {
    super(message, 'CONTEXT_CREATION_ERROR');
  }
}

export class PageCreationError extends AutomationError {
  constructor(message: string) {
    super(message, 'PAGE_CREATION_ERROR');
  }
}

export class NavigationError extends AutomationError {
  constructor(message: string) {
    super(message, 'NAVIGATION_ERROR');
  }
}

export class ConfigurationError extends AutomationError {
  constructor(message: string) {
    super(message, 'CONFIGURATION_ERROR');
  }
}

export class SessionError extends AutomationError {
  constructor(message: string) {
    super(message, 'SESSION_ERROR');
  }
}
