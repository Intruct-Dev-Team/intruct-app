# Requirements Document

## Introduction

Нужно полностью убрать функциональность «flash cards» из приложения: данные, типы и отображение секции карточек на экране урока. После изменения в проекте не должно остаться публичных типов/полей/мок-данных, связанных с flash cards, и UI урока не должен пытаться их рендерить.

## Requirements

### Requirement 1 – Remove flash cards from mock data

**User Story:** Как разработчик, я хочу удалить flash cards из mockdata, чтобы приложение больше не содержало тестовых данных для этой функциональности.

#### Acceptance Criteria

1. WHEN mock data are loaded THEN the system SHALL NOT include any flash card entities in mockdata.
2. WHEN any screen/service uses mock data THEN the system SHALL continue to work without requiring flash card mock entries.
3. IF any code path still expects flash card mock fields THEN the system SHALL fail type-checking (so the issue is caught during development).

### Requirement 2 – Remove flash cards from TypeScript types

**User Story:** Как разработчик, я хочу удалить TypeScript-типы и поля, связанные с flash cards, чтобы контракт данных не включал больше карточки.

#### Acceptance Criteria

1. WHEN the TypeScript project is type-checked THEN the system SHALL have no exported types/interfaces specifically representing flash cards.
2. WHEN lesson/course data types are used THEN the system SHALL NOT include flash-card-related fields.
3. IF any consumer code still references removed flash card types/fields THEN the system SHALL fail compilation/type-check.

### Requirement 3 – Remove flash cards section from lesson UI

**User Story:** Как пользователь, я хочу чтобы в уроке не показывалась секция flash cards, чтобы интерфейс соответствовал обновлённой структуре контента.

#### Acceptance Criteria

1. WHEN the lesson screen is rendered THEN the system SHALL NOT display any flash cards section.
2. WHEN the lesson screen receives lesson data THEN the system SHALL render normally even if the data previously contained flash-card-related fields.
3. IF the lesson screen previously depended on flash cards for layout THEN the system SHALL still render without empty/placeholder flash-card UI.

### Requirement 4 – Remove flash cards from API layer if present

**User Story:** Как разработчик, я хочу удалить из API-слоя любые методы/контракты, связанные с flash cards (если они существуют), чтобы не осталось неиспользуемого или вводящего в заблуждение кода.

#### Acceptance Criteria

1. IF the API layer contains flash-card-related functions/endpoints THEN the system SHALL remove them.
2. WHEN the app uses the API layer THEN the system SHALL continue to compile and run without flash-card-related API calls.

### Requirement 5 – Keep components optional (no forced deletion)

**User Story:** Как разработчик, я хочу чтобы удаление flash cards не требовало физического удаления UI-компонента, чтобы можно было оставить файл компонента в кодовой базе, но без использования.

#### Acceptance Criteria

1. WHEN the lesson UI is rendered THEN the system SHALL NOT import or render flash-card UI in the lesson screen.
2. IF a flash-card-related UI component remains in the repo THEN the system SHALL not reference it from any active navigation path.

### Requirement 6 – Validation and regressions

**User Story:** Как разработчик, я хочу убедиться что удаление flash cards не ломает сборку и линтинг, чтобы изменения были безопасными.

#### Acceptance Criteria

1. WHEN the linter is run THEN the system SHALL pass linting.
2. WHEN the TypeScript compiler/type-checking runs THEN the system SHALL complete without errors.

## Global Assumptions

- Flash cards — это отдельный тип контента, который сейчас присутствует в mockdata, types и в UI урока.
- Удаление flash cards не требует замены на альтернативный тип контента; их нужно именно убрать.
- В проекте может не быть API-эндпоинтов для flash cards; в таком случае изменения по Requirement 4 становятся no-op.
