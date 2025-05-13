declare module '@cal/*' {
  interface CalApi {
    (action: string, ...args: any[]): void;
    loaded?: boolean;
    ns: Record<string, any>;
  }

  global {
    interface Window {
      Cal?: CalApi;
    }
  }
} 