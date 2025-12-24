# Implementation Plan

- [x] 1. Обернуть каждый блок материала в карточку в `LessonMaterialView`

  - Изменить `components/lesson/LessonMaterialView.tsx`: для каждого `material` добавить `YStack`-контейнер карточки с `backgroundColor={colors.cardBackground}`, `padding`, `borderRadius`, `borderColor`.
  - Не менять логику навигации/кнопок, только UI.
  - Запрещено ослаблять линтер: нельзя `as unknown`, нельзя отключать правила.
  - После правок запустить `npm run lint`.
  - _Requirements: R1.AC1, R1.AC2, R1.AC3, R1.AC4_

- [ ] 2. Сделать фон flashcards более отделённым в тёмной теме

  - Изменить `components/lesson/FlashcardView.tsx`: использовать `useTheme()` и вычислить `flashcardBackground` на основе `activeTheme` (тёмная тема — более контрастный токен, например `$gray4`).
  - Применить `flashcardBackground` к обеим сторонам (front/back) карточки.
  - Запрещено ослаблять линтер: нельзя `as unknown`, нельзя отключать правила.
  - После правок запустить `npm run lint`.
  - _Requirements: R2.AC1, R2.AC2, R2.AC3_

- [ ] 3. Отделить фон каждого ответа от фона карточки вопроса

  - Изменить `components/lesson/TestView.tsx`: базовый фон опций (в невыбранном и «не отвечено» состоянии) сделать отличным от `colors.cardBackground`, например использовать `colors.background` как подложку ответа.
  - Сохранить поведение выделения выбранного ответа и состояния correct/incorrect.
  - Запрещено ослаблять линтер: нельзя `as unknown`, нельзя отключать правила.
  - После правок запустить `npm run lint`.
  - _Requirements: R3.AC1, R3.AC2, R3.AC3, R3.AC4_

- [ ] 4. Проверка качества
  - Убедиться, что изменения не затронули другие экраны и не добавили новые UX-сценарии.
  - Прогнать `npm run lint` и устранить найденные ошибки без отключения правил.
  - _Requirements: R1.AC1, R2.AC1, R3.AC1_
