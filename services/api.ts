// Public API entrypoint (barrel). Keep imports stable: `@/services/api`.

export type { ApiErrorCode } from "./api/core";

export {
  ApiError,
  setNeedsCompleteRegistrationHandler,
  setServerUnavailableHandler,
} from "./api/core";

export { authApi } from "./api/auth";
export { catalogApi } from "./api/catalog";
export { coursesApi } from "./api/courses";
export { lessonProgressApi } from "./api/lessonProgress";
export { lessonsApi } from "./api/lessons";
export { profileApi } from "./api/profile";
export { settingsApi } from "./api/settings";
