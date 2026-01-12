# Intruct - AI-Powered Course Platform 🎓

Мобильное приложение для создания персонализированных курсов при помощи ИИ и выкладывания их в общий каталог.

## ✨ Особенности

- Создание курса из материалов (файлы/ссылки) с помощью ИИ
- Каталог курсов и личная библиотека
- Отслеживание прогресса обучения
- Архитектура: mobile client → Go API → Supabase + n8n (AI workflows)

## 🧭 Что это за проект

Intruct — это Expo/React Native приложение, в котором пользователь может:

- собрать материалы (файлы/ссылки)
- попросить ИИ сгенерировать план и уроки
- сохранить курс у себя и (в перспективе) опубликовать его в общий каталог
- проходить курс и отслеживать прогресс

Этот репозиторий содержит мобильное приложение. Продукт целиком включает также backend (Go-сервис), базу данных Supabase и n8n для интеграций с ИИ.

## 🧩 Как это будет работать

1. Создание курса (Create with AI)

   - пользователь запускает поток создания курса
   - прикрепляет материалы (файлы/ссылки)
   - задаёт название и описание
   - подтверждает данные и запускает генерацию
   - приложение отправляет запрос в Go API
   - Go API сохраняет черновик/задание в Supabase и запускает n8n workflow
   - приложение показывает прогресс и по готовности получает результат (через обновление данных)

   Подробно: [docs/CREATE-COURSE.md](docs/CREATE-COURSE.md)

2. Мои курсы и прогресс

   - пользователь видит список своих курсов
   - прогресс хранится в Supabase и отображается в UI

3. Каталог

   - общий список курсов (публичные курсы)
   - позже: публикация/поиск/открытие курса из каталога

4. Настройки

   - выбор темы (Light/Dark/System)
   - выбор языка (UI готов, i18n — следующий этап)

## 🏗️ Как устроен код

- Роутинг: Expo Router (папка `app/`)
- UI: Tamagui
- Темизация: централизованные токены + хук `useThemeColors` (см. [docs/THEMING.md](docs/THEMING.md))
- Данные: единый слой API в `services/api.ts` с типами в `types/` и mock-данными в `mockdata/`

Полезные документы:

- Статус и структура: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- Установка и запуск: [SETUP.md](SETUP.md)
- Data layer: [docs/DATA-LAYER.md](docs/DATA-LAYER.md)
- Темы: [docs/THEMING.md](docs/THEMING.md)

## 🛠 Технологии

- Мобильное приложение: Expo, React Native, TypeScript, Expo Router, Tamagui, AsyncStorage
- Backend и интеграции: Go API, Supabase, n8n

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
