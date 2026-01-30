# Инструкция по настройке и запуску

Этот документ — краткая инструкция по локальному запуску и ориентации в проекте.

## Как запустить приложение

1. Убедитесь, что все зависимости установлены:

```bash
npm install
```

1. Запустите приложение:

```bash
npm start
```

1. Выберите платформу:
   - Нажмите `i` для iOS симулятора
   - Нажмите `a` для Android эмулятора
   - Нажмите `w` для веб-версии
   - Отсканируйте QR-код в Expo Go для тестирования на реальном устройстве

Примечание про iOS: локальная сборка/запуск iOS (симулятор через `run:ios`) требуют установленный Xcode. Если Xcode ставить нельзя, используй EAS Build (cloud) или Android.

## Структура проекта

```text
app/
├── (tabs)/
│   ├── index.tsx      # Главная страница (Home)
│   ├── courses.tsx    # Страница My Courses
│   ├── catalog.tsx    # Страница Catalog
│   ├── settings.tsx   # Страница Settings
│   └── _layout.tsx    # Layout для табов
├── _layout.tsx        # Корневой layout с TamaguiProvider
└── modal.tsx          # Модальное окно

components/
├── stats-card.tsx           # Карточка статистики
├── course-card.tsx          # Карточка курса
├── create-course-card.tsx   # Карточка создания курса
├── page-header.tsx          # Заголовок страницы
└── screen-container.tsx     # Контейнер для страниц

constants/
├── colors.ts          # Цветовая палитра приложения
└── theme.ts           # Тема приложения

tamagui.config.ts      # Конфигурация Tamagui
metro.config.js        # Конфигурация Metro bundler
```

## Архитектура

### Управление темой

- `contexts/theme-context.tsx` - контекст для управления темой
- `hooks/use-theme-colors.ts` - хук для получения цветов текущей темы
- `constants/colors.ts` - определение цветов для светлой и темной темы

### Данные

- Единый слой: `services/api.ts`
- Типы: `types/` (импорт через `@/types`)
- Док: `docs/DATA-LAYER.md`

### Компоненты

Все компоненты используют токены Tamagui и автоматически адаптируются под тему:

- `StatsCard` - карточка статистики
- `CourseCard` - карточка курса
- `CreateCourseCard` - карточка создания курса
- `PageHeader` - заголовок страницы
- `ScreenContainer` - контейнер для страниц
- `SettingsSection` - секция настроек
- `SettingsItem` - элемент настроек
- `ThemeSelector` - переключатель темы
- `LanguageSelector` - выбор языка

## Следующие шаги

1. Привести mockdata к явному режиму dev-only (без тихих подмен в production-флоу)
2. Улучшить error/empty states для экранов, зависящих от backend
3. Довести create-course backend-флоу (upload материалов → генерация → обновление статуса)
4. Добавить полноценную локализацию (i18n) и привести строки к системе переводов

### Билд

`cd android && ./gradlew assembleRelease`
`./gradlew assembleRelease`
`./gradlew bundleRelease`
