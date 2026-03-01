"use client";

import { LDProvider } from "launchdarkly-react-client-sdk";
import { useCallback, useState } from "react";

const USER_TYPE_KEY = "ld-user-type";
const USER_ID_KEY = "ld-user-id";

function getStoredUserType(): "default" | "beta" {
  if (typeof window === "undefined") return "default";
  const stored = localStorage.getItem(USER_TYPE_KEY);
  return stored === "beta" || stored === "default" ? stored : "default";
}

function getStoredUserId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(USER_ID_KEY) ?? "";
}

export function LDProviderWrapper({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<"default" | "beta">(() => getStoredUserType());
  const [userId, setUserId] = useState(() => getStoredUserId());

  const handleUserChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "default" | "beta";
    setUserType(value);
    localStorage.setItem(USER_TYPE_KEY, value);
  }, []);

  const handleUserIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserId(value);
    localStorage.setItem(USER_ID_KEY, value);
  }, []);

  const contextKey = userId.trim() || (userType === "default" ? "1" : "0");

  return (
    <LDProvider
      key={`${userType}-${contextKey}`}
      clientSideID="69a22c3c81adb50a28f9417b"
      context={{
        key: contextKey,
        kind: "user",
        type: userType,
      }}
    >
      <div className="fixed right-2 top-2 z-50 flex flex-col gap-1 rounded border border-border bg-card p-2">
        <div className="flex items-center gap-2">
          <select
            value={userType}
            onChange={handleUserChange}
            className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
            title="Switch user (for experiment)"
          >
            <option value="default">Default user</option>
            <option value="beta">Beta user</option>
          </select>
          <input
            type="text"
            value={userId}
            onChange={handleUserIdChange}
            placeholder="User ID"
            className="w-20 rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground"
            title="Override user key"
          />
        </div>
      </div>
      {children}
    </LDProvider>
  );
}
