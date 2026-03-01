"use client";

import { LDContext, LDProvider } from "launchdarkly-react-client-sdk";
import { useCallback, useEffect, useState } from "react";

const USER_KEY = "ld-user-type";

function getStoredUserType(): "default" | "beta" {
  if (typeof window === "undefined") return "default";
  const stored = localStorage.getItem(USER_KEY);
  return stored === "beta" || stored === "default" ? stored : "default";
}

export function LDProviderWrapper({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<"default" | "beta">("default");
  const [context, setContext] = useState<LDContext>({
    key: userType === "default" ? "1" : "0",
    kind: "user",
    type: userType,
  });

  const handleUserChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "default" | "beta";
    setUserType(value);
    setContext({
      key: value === "default" ? "1" : "0",
      kind: "user",
      type: value,
    });
    localStorage.setItem(USER_KEY, value);
  }, []);

  return (
    <LDProvider key={userType} clientSideID="69a22c3c81adb50a28f9417b" context={context}>
      <select
        value={userType}
        onChange={handleUserChange}
        className="fixed right-2 top-2 z-50 rounded border border-border bg-card px-2 py-1 text-xs text-foreground"
        title="Switch user (for experiment)"
      >
        <option value="default">Default user</option>
        <option value="beta">Beta user</option>
      </select>
      {children}
    </LDProvider>
  );
}
