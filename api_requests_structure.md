# API requests structure

Черновик контракта Mobile Client → Go API.
Все пути ниже указаны относительно базового URL.

Решения, принятые в этом документе:

- JSON keys: snake_case (клиент маппит в camelCase при необходимости)
- Date/time: ISO-8601

## Conventions

- Auth: если указано “token required” то токен нужен для доступа.
  - Header: `Authorization: Bearer <token>`
- Content-Type: по умолчанию `application/json` кроме случаев где явно указано `multipart/form-data`.
- Date/time: строки в формате ISO-8601.
- Errors: для ошибок возвращаем JSON в формате:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

## Types

Ниже перечислены типы, на которые ориентируется клиент (см. `types/index.ts`), но в API они сериализуются в snake_case.

### user_profile

```json
{
  "id": "string",
  "external_uuid": "string",
  "email": "string",
  "name": "string",
  "surname": "string",
  "registration_date": "2022-09-09T10:10:10Z",
  "birthdate": "2002-09-09",
  "avatar": "string",
  "completed_courses": 0,
  "in_progress_courses": 0,
  "streak": 0
}
```

Notes:

- `id`: строковый идентификатор (клиентский `User.id` — string).
- `birthdate`: по умолчанию дата без времени (если нужно время/таймзона — зафиксировать отдельно).
- `avatar`: строка (URL или ключ/filename) — формат нужно закрепить на бекенде.

### course_summary

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "lessons_number": 0,
  "finished_lessons": 0,
  "created_at": "2022-09-09T10:10:10Z",
  "updated_at": "2022-09-09T10:10:10Z",
  "category": "string",
  "author_id": 0,
  "rating": null,
  "students": null,
  "is_public": false
}
```

### course_detail

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "lessons_number": 0,
  "finished_lessons": 0,
  "created_at": "2022-09-09T10:10:10Z",
  "updated_at": "2022-09-09T10:10:10Z",
  "category": "string",
  "author_id": 0,
  "rating": null,
  "ratings_number": null,
  "students": null,
  "is_public": false
}
```

Notes:

- `rating` / `students` могут быть `null` (например для приватных/непубличных курсов).

### lesson_material

```json
{
  "id": "string",
  "title": "string",
  "content": "string"
}
```

Notes:

- `content`: markdown-текст (ориентир: клиентский `LessonMaterial.content`).

### flashcard

```json
{
  "id": "string",
  "front": "string",
  "back": "string"
}
```

### test_question

```json
{
  "id": "string",
  "question": "string",
  "type": "multiple-choice",
  "options": ["string"],
  "correct_answer": "string",
  "explanation": "string"
}
```

Notes:

- `type`: одно из значений клиента: `multiple-choice` | `true-false` | `short-answer`.
- `correct_answer`: строка или число (клиент допускает `string | number`).

### lesson

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "materials": [],
  "flashcards": [],
  "questions": []
}
```

### course_creation_job

```json
{
  "job_id": "string",
  "status": "queued",
  "progress": 0,
  "course_id": null,
  "error": null
}
```

Notes:

- `status`: `queued` | `processing` | `done` | `failed`.
- `progress`: 0..100 (опционально на бекенде, но удобно для клиента).
- `course_id`: появляется при `done`.
- `error`: появляется при `failed`.

## User

### Complete registration

Checks if user has internal user in DB.

- **Path**: `/auth/complete-registration`
- **Method**: `POST`
- **Auth**: token required
- **Request body (JSON)**

```json
{
  "name": "John",
  "surname": "Smith",
  "birthdate": "2002-09-09",
  "avatar": "uuid.png"
}
```

- **Responses**
  - `200 OK`: `user_profile`
  - `401 Unauthorized`
  - `422 Unprocessable Entity`

### Get user profile

Getting user from backend.

- **Path**: `/user/profile`
- **Method**: `GET`
- **Auth**: token required
- **Response body (JSON)**

```json
{
  "id": "string",
  "external_uuid": "uuid",
  "email": "qwerty@example.com",
  "name": "John",
  "surname": "Smith",
  "registration_date": "2022-09-09T10:10:10Z",
  "birthdate": "2002-09-09",
  "avatar": "uuid.png",
  "completed_courses": 1,
  "in_progress_courses": 1,
  "streak": 1
}
```

- **Responses**
  - `200 OK`: `user_profile`
  - `401 Unauthorized`

## Courses

### Get courses

- **Path**: `/courses`
- **Method**: `GET`
- **Auth**: token required
- **Query params**
  - `categories` (повторяемый параметр)
  - `in_mine` (`true` | `false`)
  - `sort` (`popular` | `newest` | `rating` | `students`)
  - `page` (number)
  - `limit` (number)

Example:

```text
/courses?categories=math&categories=history&in_mine=true&sort=popular&page=1&limit=20
```

- **Response body (JSON)**

```json
{
  "courses": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "lessons_number": 0,
      "finished_lessons": 0,
      "created_at": "2022-09-09T10:10:10Z",
      "updated_at": "2022-09-09T10:10:10Z",
      "category": "string",
      "author_id": 0,
      "rating": null,
      "students": null,
      "is_public": false
    }
  ]
}
```

Notes:

- `rating` / `students` могут быть `null` (например, для приватных/непубличных курсов).

- **Responses**
  - `200 OK`: `{ courses: course_summary[] }`
  - `401 Unauthorized`

### Get course

- **Path**: `/courses/{course_id}`
- **Method**: `GET`
- **Auth**: token required

Example:

```text
/courses/123
```

"id": "string",
"title": "string",
"description": "string",
"lessons_number": 0,
"finished_lessons": 0,
"created_at": "2022-09-09T10:10:10Z",
"updated_at": "2022-09-09T10:10:10Z",
"category": "string",
"author_id": 0,
"rating": null,
"ratings_number": null,
"students": null,
"is_public": false
"rating": null,
"ratings_number": null,

- **Responses**
  - `200 OK`: `course_detail`
  - `401 Unauthorized`
  - `404 Not Found`
    "students": null,
    "isPublic": false
    }

````

## Lessons

### Get lesson

- **Path**: `/courses/{course_id}/lessons/{lesson_id}`
- **Method**: `GET`
- **Auth**: token required

Example:

```text
/courses/123/lessons/456
````

- **Response body (JSON)**

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "materials": [],
  "flashcards": [],
  "questions": []
}
```

- **Responses**
  - `200 OK`: `lesson`
  - `401 Unauthorized`
  - `404 Not Found`

### Finish lesson

- **Path**: `/courses/{course_id}/lessons/{lesson_id}/finish`
- **Method**: `POST`
- **Auth**: token required
- **Responses**
  - `204 No Content`
  - `401 Unauthorized`
  - `404 Not Found`

## Course creation

### Create course

- **Path**: `/courses`
- **Method**: `POST`
- **Auth**: token required
- **Request**: `multipart/form-data`

Fields:

```text
title
description
file
language
links
```

Notes:

- `file`: допускается несколько файлов (если планируется множественная загрузка, то закрепить: `file` как повторяемый multipart field).
- `links`: повторяемое поле или JSON-строка — закрепить формат на бекенде.

Асинхронная модель (job) вместо “waiting mechanism TBD”

Create course может быть долгим (генерация контента/обработка файлов). Если держать один HTTP-запрос открытым десятки секунд, будут проблемы с таймаутами/ретраями и UX.

Поэтому предлагаем протокол:

1. Клиент отправляет `POST /courses`.
2. Сервер создаёт job и сразу отвечает.
3. Клиент опрашивает status по `job_id`.
4. Когда `status=done`, клиент переходит к курсу по `course_id`.

- **Responses**
  - `202 Accepted`

```json
{
  "job_id": "string"
}
```

- `401 Unauthorized`
- `422 Unprocessable Entity`

### Get course creation job

- **Path**: `/course-creation-jobs/{job_id}`
- **Method**: `GET`
- **Auth**: token required
- **Response body (JSON)**

```json
{
  "job_id": "string",
  "status": "queued",
  "progress": 0,
  "course_id": null,
  "error": null
}
```

- **Responses**
  - `200 OK`: `course_creation_job`
  - `401 Unauthorized`
  - `404 Not Found`

## Publication & reviews

### Course publication

- **Path**: `/courses/{course_id}/publication`
- **Method**: `PUT`
- **Auth**: token required
- **Request body (JSON)**

```json
{
  "is_public": true
}
```

- **Responses**
  - `200 OK`: `course_detail`
  - `401 Unauthorized`
  - `404 Not Found`

### Leave review

- **Path**: `/courses/{course_id}/reviews`
- **Method**: `POST`
- **Auth**: token required
- **Request body (JSON)**

```json
{
  "review_grade": 1
}
```

- **Responses**
  - `201 Created`
  - `401 Unauthorized`
  - `404 Not Found`
  - `422 Unprocessable Entity`
