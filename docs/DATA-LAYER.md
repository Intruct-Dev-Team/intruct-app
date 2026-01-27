# Data Layer Architecture

## Обзор

В приложении есть единый слой данных в `services/api.ts`. UI-компоненты не должны вызывать `fetch()` напрямую — только `profileApi`, `coursesApi`, `lessonProgressApi` и другие экспортируемые API.

В проекте есть `mockdata/`, но для пользовательских (auth) эндпоинтов мы не используем «тихие» моки: если нет токена или не настроен backend, это считается ошибкой и должно быть видно.

## Структура

```text
├── types/              # TypeScript типы (разбиты по доменам)
│   ├── index.ts        # barrel export: import type { Course } from "@/types"
│   ├── course.ts
│   ├── lesson.ts
│   ├── user.ts
│   ├── settings.ts
│   └── api.ts          # swagger/request/response shapes
├── mockdata/           # Данные для UI/каталога/заглушек
└── services/
    └── api.ts          # Единая точка доступа к данным
```

## Типы (`types/`)

Импорты остаются прежними:

```ts
import type { Course, UserProfile } from "@/types";
```

Но внутри `types/` типы разнесены по смыслу (курс/урок/пользователь/настройки/Swagger).

## API слой (`services/api.ts`)

Ключевые объекты:

- `profileApi.getProfile(token)` — профиль пользователя из backend
- `coursesApi.getMyCourses(token)` — «Мои курсы» (требует токен + `EXPO_PUBLIC_API_BASE_URL`)
- `coursesApi.getCourseById(id, token)` — детальная карточка курса
- `lessonProgressApi.*` — локальный кэш прохождения уроков (AsyncStorage), чтобы прогресс обновлялся мгновенно

Пример использования:

```ts
import { coursesApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const { session } = useAuth();
const token = session?.access_token;

if (token) {
  const courses = await coursesApi.getMyCourses(token);
}
```

## Best Practices

1. Используй `services/api.ts` вместо прямого `fetch()` в UI.
2. Для авторизованных вызовов всегда пробрасывай `session?.access_token`.
3. Ошибки авторизации/не-настроенного backend не маскируй моками — показывай пользователю error/empty state.
4. Типы импортируй как `import type { ... } from "@/types"`.

## Потенциальные улучшения (следующий этап)

- Добавить единый слой кеширования (например, React Query) для курсов/уроков.
- Ввести строгие runtime-схемы (zod) для ответов backend, чтобы ловить несовпадения контракта.
- Явно разделить «catalog API» (может иметь моки) и «my courses API» (только backend).
