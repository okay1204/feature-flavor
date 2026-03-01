"use client";

import { LDProvider } from "launchdarkly-react-client-sdk";

export function LDProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LDProvider clientSideID="69a22c3c81adb50a28f9417b">
      {children}
    </LDProvider>
  );
}
