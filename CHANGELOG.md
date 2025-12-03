# Changelog

All notable changes to the Intruct project will be documented in this file.

## [1.0.0] - 2025-12-03

### 🎉 Initial Release

#### ✨ Features

**Home Screen**

- Welcome header with personalized greeting
- Three statistics cards (Completed, Courses in Progress, Day Streak)
- "Create with AI" card with gradient background
- "My Courses" section with course cards
- Progress bars for courses in progress
- Navigation to course creation flow

**Course Creation Flow**

- Multi-step process (3 steps)
- Step 1: Attach Materials
  - File upload functionality (demo implementation)
  - Add links with URL validation
  - Display and remove attached files/links
- Step 2: Course Details
  - Course title input
  - Course description textarea
  - Proper keyboard handling
- Step 3: Review & Create
  - Summary of all entered data
  - File and link count display
- AI Generation Modal
  - Animated progress bar
  - Step-by-step indicators
  - Processing materials → Creating course plan → Writing lessons
  - Auto-close on completion

**Settings Screen**

- User profile card with avatar and email
- Account Settings section:
  - Personal Information
  - Notifications
  - Privacy & Security
  - Billing
- AI Settings section:
  - AI Model Preference
  - Content Language
- App Settings section:
  - Dark Mode toggle (Switch)
  - Language selector (Modal)
- Support section:
  - Help Center
  - Contact Support
- Footer with version and copyright

**Dark Theme**

- Full light/dark theme support
- System theme detection
- Manual theme selection (Light/Dark/System)
- Theme persistence with AsyncStorage
- All components automatically adapt
- Proper color tokens throughout

**Navigation**

- Four tabs: Home, Courses, Catalog, Settings
- Custom icons for each tab
- Active state indication
- Stack navigation for course creation

#### 🎨 Design System

**Components (25+)**

- `StatsCard` - Statistics display with icons
- `CourseCard` - Course information with progress
- `CreateCourseCard` - AI course creation CTA
- `PageHeader` - Page title and subtitle
- `ScreenContainer` - Consistent page wrapper
- `UserProfileCard` - User profile display
- `SectionHeader` - Section titles
- `SettingsCard` - Settings group container
- `SettingsItem` - Individual setting item
- `SettingsFooter` - App version footer
- `ThemeToggle` - Dark mode switch
- `LanguageModal` - Language selection modal
- `StepIndicator` - Multi-step progress
- `AttachMaterialsStep` - File/link upload
- `CourseDetailsStep` - Course info input
- `ReviewStep` - Final review before creation
- `CreatingCourseModal` - AI generation progress

**Color System**

- Centralized color definitions
- Separate light/dark color schemes
- Tamagui token-based colors
- Automatic theme adaptation

**Typography**

- Consistent font weights (400-700)
- Proper text hierarchy
- Color-coded text importance

#### 🛠 Technical Implementation

**Architecture**

- Component-based structure
- Custom hooks for reusable logic
- Context API for theme management
- TypeScript throughout
- Clean code principles

**State Management**

- React Context for theme
- Local state for forms
- AsyncStorage for persistence

**Navigation**

- Expo Router (file-based)
- Stack navigation
- Tab navigation
- Modal screens

**UI Library**

- Tamagui for all components
- Lucide icons
- React Native Safe Area Context
- Keyboard avoiding behavior

#### 📱 Platform Support

- iOS
- Android
- Web (partial)

#### 🐛 Bug Fixes

- Fixed keyboard covering buttons issue
- Fixed TextArea alignment (top instead of center)
- Fixed safe area insets for bottom buttons
- Fixed duplicate headers in course creation
- Fixed theme colors (white cards on light background)

#### 📚 Documentation

- `README.md` - Project overview
- `SETUP.md` - Setup and installation guide
- `PROJECT_SUMMARY.md` - Complete project summary
- `CHANGELOG.md` - This file
- `docs/THEMING.md` - Theming guide
- `docs/CREATE-COURSE.md` - Course creation documentation

#### 🔧 Configuration

- Tamagui configuration
- Metro bundler setup
- TypeScript configuration
- ESLint setup

---

## Future Roadmap

### Priority 1 (Critical)

- [ ] AI API integration for real course generation
- [ ] Real file upload implementation
- [ ] Course detail pages
- [ ] Lesson system

### Priority 2 (Important)

- [ ] User authentication
- [ ] Backend integration
- [ ] Course persistence
- [ ] Learning progress tracking

### Priority 3 (Nice to have)

- [ ] i18n integration for multi-language
- [ ] Tests and flashcards
- [ ] Social features
- [ ] Push notifications
- [ ] Analytics

---

## Notes

This is the initial release of Intruct, an AI-powered course creation platform. The app is fully functional with a complete UI/UX implementation, ready for backend integration and AI service connection.

**Tech Stack:**

- Expo SDK 54
- React Native 0.81
- Tamagui 1.138
- TypeScript 5.9
- Expo Router 6.0

**Developed:** December 2025
