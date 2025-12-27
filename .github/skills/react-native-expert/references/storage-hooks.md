Storage & Hooks

> Reference for: React Native Expert
> Load when: AsyncStorage MMKV persistent state

## AsyncStorage

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

// Basic operations
await AsyncStorage.setItem("user", JSON.stringify(user));
const storedUser = JSON.parse((await AsyncStorage.getItem("user")) ?? "null");
await AsyncStorage.removeItem("user");
await AsyncStorage.clear();

// Multiple items
await AsyncStorage.multiSet([
  ["user", JSON.stringify(user)],
  ["settings", JSON.stringify(settings)],
]);

const values = await AsyncStorage.multiGet(["user", "settings"]);
```

## useStorage Hook

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const valueRef = useRef<T>(initialValue);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Load on mount / key change
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const item = await AsyncStorage.getItem(key);
        if (cancelled) return;

        if (item !== null) {
          const parsed = JSON.parse(item) as T;
          valueRef.current = parsed;
          setValue(parsed);
        } else {
          valueRef.current = initialValue;
          setValue(initialValue);
        }
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialValue, key]);

  // Persist changes
  const setStoredValue = useCallback(
    async (next: T | ((prev: T) => T)) => {
      setError(null);
      try {
        const valueToStore =
          typeof next === "function"
            ? (next as (prev: T) => T)(valueRef.current)
            : next;

        valueRef.current = valueToStore;
        setValue(valueToStore);
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (e) {
        setError(e);
      }
    },
    [key]
  );

  const removeValue = useCallback(async () => {
    setError(null);
    try {
      valueRef.current = initialValue;
      setValue(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (e) {
      setError(e);
    }
  }, [initialValue, key]);

  return { value, setValue: setStoredValue, removeValue, loading, error };
}
```

## MMKV (Faster Alternative)

```typescript
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

// Synchronous operations
storage.set("user.name", "John");
const name = storage.getString("user.name");

storage.set("user.age", 25);
const age = storage.getNumber("user.age");

storage.set("user.premium", true);
const isPremium = storage.getBoolean("user.premium");

storage.delete("user.name");
storage.clearAll();

// JSON data
storage.set("user", JSON.stringify(user));
const parsedUser = JSON.parse(storage.getString("user") || "{}");
```

## useMMKV Hook

```typescript
import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from "react-native-mmkv";

function Settings() {
  const [theme, setTheme] = useMMKVString("theme");
  const [fontSize, setFontSize] = useMMKVNumber("fontSize");
  const [notifications, setNotifications] = useMMKVBoolean("notifications");

  return (
    <>
      <Switch
        value={theme === "dark"}
        onValueChange={(dark) => setTheme(dark ? "dark" : "light")}
      />
      <Slider value={fontSize ?? 14} onValueChange={setFontSize} />
      <Switch value={!!notifications} onValueChange={setNotifications} />
    </>
  );
}
```

## Zustand with MMKV

```typescript
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

interface SettingsStore {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

## Quick Reference

| Storage      | Speed  | Async | Use Case                   |
| ------------ | ------ | ----- | -------------------------- |
| AsyncStorage | Slow   | Yes   | Small data simple apps     |
| MMKV         | Fast   | No    | Large data frequent access |
| SecureStore  | Medium | Yes   | Sensitive data (tokens)    |

| Hook               | Returns                                      |
| ------------------ | -------------------------------------------- | ----------------- |
| `useStorage()`     | { value setValue removeValue loading error } |
| `useMMKVString()`  | [value setValue]                             |
| `useMMKVNumber()`  | [value setValue]                             |
| `useMMKVBoolean()` | [value setValue]                             | # Storage & Hooks |

> Reference for: React Native Expert
> Load when: AsyncStorage, MMKV, persistent state

## AsyncStorage

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

// Basic operations
await AsyncStorage.setItem("user", JSON.stringify(user));
const user = JSON.parse((await AsyncStorage.getItem("user")) || "null");
await AsyncStorage.removeItem("user");
await AsyncStorage.clear();

// Multiple items
await AsyncStorage.multiSet([
  ["user", JSON.stringify(user)],
  ["settings", JSON.stringify(settings)],
]);

const values = await AsyncStorage.multiGet(["user", "settings"]);
```

## useStorage Hook

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";

function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((item) => {
        if (item !== null) {
          setValue(JSON.parse(item));
        }
      })
      .finally(() => setLoading(false));
  }, [key]);

  // Persist changes
  const setStoredValue = useCallback(
    async (newValue: T | ((prev: T) => T)) => {
      const valueToStore =
        newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    },
    [key, value]
  );

  const removeValue = useCallback(async () => {
    setValue(initialValue);
    await AsyncStorage.removeItem(key);
  }, [key, initialValue]);

  return { value, setValue: setStoredValue, removeValue, loading };
}

// Usage
function Settings() {
  const {
    value: theme,
    setValue: setTheme,
    loading,
  } = useStorage("theme", "light");

  if (loading) return <Loading />;

  return (
    <Switch
      value={theme === "dark"}
      onValueChange={(dark) => setTheme(dark ? "dark" : "light")}
    />
  );
}
```

## MMKV (Faster Alternative)

```typescript
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

// Synchronous operations
storage.set("user.name", "John");
const name = storage.getString("user.name");

storage.set("user.age", 25);
const age = storage.getNumber("user.age");

storage.set("user.premium", true);
const isPremium = storage.getBoolean("user.premium");

storage.delete("user.name");
storage.clearAll();

// JSON data
storage.set("user", JSON.stringify(user));
const user = JSON.parse(storage.getString("user") || "{}");
```

## useMMKV Hook

```typescript
import {
  useMMKVString,
  useMMKVNumber,
  useMMKVBoolean,
} from "react-native-mmkv";

function Settings() {
  const [theme, setTheme] = useMMKVString("theme");
  const [fontSize, setFontSize] = useMMKVNumber("fontSize");
  const [notifications, setNotifications] = useMMKVBoolean("notifications");

  return (
    <>
      <Switch
        value={theme === "dark"}
        onValueChange={(dark) => setTheme(dark ? "dark" : "light")}
      />
      <Slider value={fontSize} onValueChange={setFontSize} />
      <Switch value={notifications} onValueChange={setNotifications} />
    </>
  );
}
```

## Zustand with MMKV

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

interface SettingsStore {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

## Quick Reference

| Storage      | Speed  | Async | Use Case                    |
| ------------ | ------ | ----- | --------------------------- |
| AsyncStorage | Slow   | Yes   | Small data, simple apps     |
| MMKV         | Fast   | No    | Large data, frequent access |
| SecureStore  | Medium | Yes   | Sensitive data (tokens)     |

| Hook               | Returns                      |
| ------------------ | ---------------------------- |
| `useStorage()`     | { value, setValue, loading } |
| `useMMKVString()`  | [value, setValue]            |
| `useMMKVNumber()`  | [value, setValue]            |
| `useMMKVBoolean()` | [value, setValue]            |
