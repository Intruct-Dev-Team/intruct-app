# Components Organization Guide

The `components/` folder has been reorganized into logical subdirectories to improve maintainability and developer experience.

## Folder Structure

### `/cards`

Card-based components for displaying data in compact, reusable formats.

- `CourseCard` - Course card for enrolled courses
- `CourseCardSkeleton` - Loading skeleton for course card
- `CatalogCourseCard` - Course card in catalog view
- `CatalogCourseCardSkeleton` - Loading skeleton for catalog card
- `StatsCard` - Statistics display card (completed, in-progress, streak)
- `StatsCardSkeleton` - Loading skeleton for stats card
- `CreateCourseCard` - Card to start creating a new course

### `/layout`

Layout and structural components that organize page structure.

- `PageHeader` - Title and subtitle header for pages
- `ScreenContainer` - ScrollView wrapper with consistent padding
- `SectionHeader` - Subsection titles within pages
- `ParallaxScrollView` - ScrollView with parallax animation effect

### `/settings`

Settings and preferences UI components.

- `SettingsCard` - Container for settings sections
- `SettingsItem` - Individual setting row (toggle, link, etc.)
- `SettingsFooter` - App version and info footer

### `/user`

User profile and account related components.

- `UserProfileCard` - User profile display card
- `UserProfileSkeleton` - Loading skeleton for profile card

### `/modals`

Modal and dialog components.

- `LanguageModal` - Language selection modal

### `/common`

Reusable utility and common components.

- `HapticTab` - Tab with haptic feedback
- `HelloWave` - Greeting component with wave animation
- `ExternalLink` - External link handler
- `StepIndicator` - Progress/step indicator
- `ThemeToggle` - Dark/light mode switcher
- `ThemedText` - Text component with theme support
- `ThemedView` - View component with theme support

### `/ui`

Base UI components (unchanged).

- Low-level components from Tamagui and custom UI elements

### `/create-course`

Wizard components for course creation flow (unchanged).

- Multi-step form components for creating courses

## Importing Components

### Method 1: Import from subfolder (Recommended)

```typescript
import { CourseCard, CourseCardSkeleton } from "@/components/cards";
import { PageHeader, ScreenContainer } from "@/components/layout";
import { UserProfileCard } from "@/components/user";
```

### Method 2: Import from root (via barrel export)

```typescript
import { CourseCard, PageHeader, UserProfileCard } from "@/components";
```

### Method 3: Direct file import (Legacy - not recommended)

```typescript
import { CourseCard } from "@/components/cards/course-card";
```

## Benefits

1. **Clearer Organization** - Related components grouped by functionality
2. **Faster Navigation** - Easier to find components in the codebase
3. **Reduced Import Paths** - From 8+ characters to 2-3 in path depth
4. **Scalability** - Easy to add new components to existing folders
5. **Maintainability** - Clear separation of concerns

## Adding New Components

When creating new components:

1. Identify which category it belongs to
2. Place the file in the appropriate subfolder
3. Add export to the subfolder's `index.ts`
4. (Optional) Add export to root `components/index.ts` if widely used

Example:

```typescript
// components/cards/my-new-card.tsx
export function MyNewCard() { ... }

// components/cards/index.ts - add this line
export { MyNewCard } from "./my-new-card";
```

## File Naming

- Component files: `kebab-case.tsx` (e.g., `course-card.tsx`)
- Folders: `kebab-case/` (e.g., `user/`)
- Index files: `index.ts` (barrel exports)

## Migration Notes

All component imports have been updated in:

- `app/(tabs)/index.tsx` (Home)
- `app/(tabs)/courses.tsx` (Courses)
- `app/(tabs)/catalog.tsx` (Catalog)
- `app/(tabs)/settings.tsx` (Settings)
- `app/(tabs)/_layout.tsx` (Tab Navigation)
- `app/create-course.tsx` (Course Creation)

No functional changes - this is purely organizational.
