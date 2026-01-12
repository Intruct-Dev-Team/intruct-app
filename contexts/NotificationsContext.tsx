import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type NotificationType = "success" | "info" | "error";

export type NotificationAction = {
  label: string;
  onPress: () => void;
};

export type NotifyInput = {
  type: NotificationType;
  title?: string;
  message: string;
  durationMs?: number;
  action?: NotificationAction;
  dismissible?: boolean;
};

export type ActiveNotification = {
  id: string;
  input: NotifyInput;
  createdAt: number;
};

type NotificationsContextValue = {
  active: ActiveNotification | null;
  notify: (input: NotifyInput) => string;
  dismiss: (id?: string) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null
);

function generateNotificationId(): string {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeDurationMs(durationMs: number | undefined): number | null {
  if (durationMs === 0) return null;
  if (
    typeof durationMs === "number" &&
    Number.isFinite(durationMs) &&
    durationMs > 0
  ) {
    return durationMs;
  }
  return 3000;
}

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<ActiveNotification | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const dismiss = useCallback(
    (id?: string) => {
      setActive((prev) => {
        if (!prev) return null;
        if (id && prev.id !== id) return prev;
        return null;
      });
      clearTimer();
    },
    [clearTimer]
  );

  const notify = useCallback(
    (input: NotifyInput) => {
      const id = generateNotificationId();
      const createdAt = Date.now();

      clearTimer();
      setActive({ id, input, createdAt });

      const durationMs = normalizeDurationMs(input.durationMs);
      if (durationMs !== null) {
        timeoutRef.current = setTimeout(() => {
          dismiss(id);
        }, durationMs);
      }

      return id;
    },
    [clearTimer, dismiss]
  );

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const value = useMemo<NotificationsContextValue>(
    () => ({
      active,
      notify,
      dismiss,
    }),
    [active, notify, dismiss]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  }
  return ctx;
}
