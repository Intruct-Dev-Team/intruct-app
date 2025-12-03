# Инструкция по настройке и запуску

## Что уже сделано

✅ Установлен Tamagui и все необходимые зависимости
✅ Создана конфигурация Tamagui (`tamagui.config.ts`)
✅ Настроен TamaguiProvider в корневом layout
✅ Создана главная страница с дизайном из скриншота
✅ Настроены табы навигации (Home, Courses, Catalog, Settings)
✅ Настроен Metro bundler

## Как запустить приложение

1. Убедитесь, что все зависимости установлены:

```bash
npm install
```

2. Запустите приложение:

```bash
npm start
```

3. Выберите платформу:
   - Нажмите `i` для iOS симулятора
   - Нажмите `a` для Android эмулятора
   - Нажмите `w` для веб-версии
   - Отсканируйте QR-код в Expo Go для тестирования на реальном устройстве

## Структура проекта

```
app/
├── (tabs)/
│   ├── index.tsx      # Главная страница (Home)
│   ├── explore.tsx    # Страница Courses
│   ├── catalog.tsx    # Страница Catalog
│   ├── settings.tsx   # Страница Settings
│   └── _layout.tsx    # Layout для табов
├── _layout.tsx        # Корневой layout с TamaguiProvider
└── modal.tsx          # Модальное окно

tamagui.config.ts      # Конфигурация Tamagui
metro.config.js        # Конфигурация Metro bundler
```

## Что реализовано на главной странице

- ✅ Заголовок "Welcome back!"
- ✅ Три карточки статистики (Completed, Courses in Progress, Day Streak)
- ✅ Карточка "Create with AI" с градиентным фоном
- ✅ Секция "My Courses" с двумя примерами курсов
- ✅ Прогресс-бар для курса "Introduction to React"
- ✅ Иконки из @tamagui/lucide-icons

## Следующие шаги

1. Добавить функциональность создания курсов
2. Реализовать страницы Courses, Catalog и Settings
3. Подключить API для работы с ИИ
4. Добавить навигацию между страницами
5. Реализовать детальные страницы курсов
