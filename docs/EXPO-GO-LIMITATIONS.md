# Expo Go Limitations

## Системный UI (Navigation Bar)

### Проблема

В Expo Go системный UI (navigation bar внизу экрана на Android) контролируется самим приложением Expo Go, а не вашим приложением.

### Что не работает в Expo Go:

- `expo-system-ui` - `setBackgroundColorAsync()` игнорируется
- Цвет navigation bar остается темным независимо от темы приложения

### Решение

#### Для разработки (Expo Go):

- Системный UI будет темным - это нормально
- Все остальные функции работают корректно
- StatusBar адаптируется под тему

#### Для production (Development Build / Production Build):

Системный UI будет работать правильно после создания standalone build:

```bash
# Development build
eas build --profile development --platform android

# Production build
eas build --profile production --platform android
```

### Что уже настроено

В `app.json`:

```json
{
  "userInterfaceStyle": "automatic",
  "android": {
    "edgeToEdgeEnabled": true
  }
}
```

В `app/_layout.tsx`:

```typescript
useEffect(() => {
  if (activeTheme === "dark") {
    SystemUI.setBackgroundColorAsync("#000000").catch(() => {});
  } else {
    SystemUI.setBackgroundColorAsync("#FFFFFF").catch(() => {});
  }
}, [activeTheme]);
```

### Что работает в Expo Go:

✅ StatusBar (верхняя панель)
✅ Темная/светлая тема приложения
✅ Все UI компоненты
✅ Навигация
✅ Все функции приложения

### Что НЕ работает в Expo Go:

❌ Цвет системного navigation bar (нижняя панель Android)

## Другие ограничения Expo Go

### Push Notifications

- Работают только через Expo Push Notification service
- Нативные push notifications требуют development build

### Native Modules

- Некоторые нативные модули недоступны
- Требуется development build для кастомных нативных модулей

### App Icons & Splash Screen

- Используются иконки Expo Go
- Кастомные иконки работают только в standalone build

## Рекомендации

Для полноценного тестирования:

1. Используйте Expo Go для быстрой разработки
2. Создайте development build для тестирования нативных функций
3. Создайте production build для финального тестирования

```bash
# Установка EAS CLI
npm install -g eas-cli

# Логин
eas login

# Создание development build
eas build --profile development --platform android

# Установка на устройство
eas build:run -p android
```
