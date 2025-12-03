# Руководство по темизации

## Как работает система тем

Приложение использует Tamagui для управления темами. Все цвета определены через токены, которые автоматически меняются при переключении темы.

## Использование цветов в компонентах

### Правильно ✅

```tsx
import { useThemeColors } from "@/hooks/use-theme-colors";

function MyComponent() {
  const colors = useThemeColors();

  return (
    <View backgroundColor={colors.background}>
      <Text color={colors.textPrimary}>Hello</Text>
    </View>
  );
}
```

### Неправильно ❌

```tsx
// Не используйте хардкод цветов!
<View backgroundColor="#FFFFFF">
  <Text color="black">Hello</Text>
</View>
```

## Доступные цвета

```typescript
colors.background; // Фон страницы
colors.cardBackground; // Фон карточек
colors.textPrimary; // Основной текст
colors.textSecondary; // Вторичный текст
colors.textTertiary; // Третичный текст
colors.primary; // Основной цвет бренда
colors.primaryText; // Текст на primary фоне

// Цвета статистики
colors.stats.completed.background;
colors.stats.completed.icon;
colors.stats.inProgress.background;
colors.stats.inProgress.icon;
colors.stats.streak.background;
colors.stats.streak.icon;
```

## Добавление новых цветов

1. Откройте `constants/colors.ts`
2. Добавьте цвет в `lightColors` и `darkColors`
3. Используйте токены Tamagui (например, `$blue9`, `$gray12`)

```typescript
export const lightColors = {
  // ... существующие цвета
  newColor: "$blue9",
};

export const darkColors = {
  // ... существующие цвета
  newColor: "$blue8", // Может отличаться для темной темы
};
```

## Переключение темы

Пользователи могут выбрать тему в Settings:

- **Light** - светлая тема
- **Dark** - темная тема
- **System** - следует системной теме устройства

Выбор сохраняется в AsyncStorage и применяется при следующем запуске.

## Токены Tamagui

Tamagui предоставляет готовые токены цветов:

- `$gray1` - `$gray12` (от светлого к темному)
- `$blue1` - `$blue12`
- `$green1` - `$green12`
- `$red1` - `$red12`
- И т.д.

В темной теме эти токены автоматически инвертируются.
