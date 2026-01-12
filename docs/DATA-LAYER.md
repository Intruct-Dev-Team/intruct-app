# Data Layer Architecture

## Обзор

Приложение использует слоистую архитектуру для работы с данными, что позволяет легко переключаться между mock данными и реальным API.

## Структура

```
├── types/              # TypeScript типы
│   └── index.ts
├── mockdata/           # Тестовые данные
│   ├── user.ts
│   ├── courses.ts
│   └── settings.ts
└── services/           # API слой
    └── api.ts
```

## Типы (`types/index.ts`)

Все типы данных определены централизованно:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: number;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}
```

## Mock данные (`mockdata/`)

Тестовые данные для разработки:

- `user.ts` - данные пользователя и статистика
- `courses.ts` - список курсов
- `settings.ts` - настройки и опции

## API слой (`services/api.ts`)

Единая точка доступа к данным:

```typescript
// Получить текущего пользователя
const user = await userApi.getCurrentUser();

// Получить статистику
const stats = await userApi.getUserStats();

// Получить курсы
const courses = await coursesApi.getMyCourses();
```

### Преимущества

1. **Единый интерфейс** - компоненты не знают, откуда приходят данные
2. **Легкая замена** - достаточно изменить реализацию в `api.ts`
3. **Симуляция задержек** - mock API имитирует реальные задержки сети
4. **Типобезопасность** - все данные типизированы

## Использование в компонентах

```typescript
import { userApi } from "@/services/api";
import type { User } from "@/types";
import { useEffect, useState } from "react";
import { Text } from "react-native";

function MyComponent() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const userData = await userApi.getCurrentUser();
      if (cancelled) return;
      setUser(userData);
    };

    loadData().catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return <Text>{user?.name}</Text>;
}
```

## Миграция на реальный API

Когда backend будет готов, нужно изменить только `services/api.ts`:

```typescript
// Было (mock):
export const userApi = {
  async getCurrentUser(): Promise<User> {
    await delay(300);
    return mockUser;
  },
};

// Станет (real API):
export const userApi = {
  async getCurrentUser(): Promise<User> {
    const response = await fetch("https://api.intruct.com/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};
```

Компоненты останутся без изменений!

## Best Practices

1. **Всегда используйте типы** - `import type { User } from '@/types'`
2. **Обрабатывайте ошибки** - добавляйте try/catch
3. **Показывайте loading** - пока данные загружаются
4. **Кэшируйте данные** - используйте React Query или SWR в будущем

## Будущие улучшения

- [ ] Добавить React Query для кэширования
- [ ] Добавить оптимистичные обновления
- [ ] Добавить offline-first подход
- [ ] Добавить автоматическую ретрай логику
