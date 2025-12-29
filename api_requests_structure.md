# DATA

## USER

### COMPLETE REGISTRATION

Checks if user has internal user in DB.
/auth/complete-registration

- token required

```json
  {
    token,
    name,
    surname,
    birthdate,
    avatar ()
  }
```

### GET USER

Getting user from backend.
/user/profile

- token required

```json
{
 `json:"id"                   example:"1"`
 `json:"external_uuid"        example:"uuid"`
 `json:"email"                example:"qwerty@example.com"`
 `json:"name"                 example:"John"`
 `json:"surname"              example:"Smith"`
 `json:"registration_date"    example:"2022-09-09T10:10:10+09:00"`
 `json:"birthdate"            example:"2002-09-09T10:10:10+09:00"`
 `json:"avatar"               example:"uuid.png"`
 `json:"completed_courses"    example:"1"`
 `json:"in_progress_courses"  example:"1"`
 `json:"streak"               example:"1"`
}
```

## COURSES

### GET COURSES

- token required

REQUEST
/courses?categories?in_mine

RESPONSE

```json
{
  courses: [
    {
      id: string;
      title: string;
      description: string;
      lessons_number: number;
      progress?: number;
      createdAt: string;
      updatedAt: string;
      category?: string;
      author_id?: number;
      // rating/students are nullable to represent private/unavailable values
      rating?: number | null;
      students?: number | null;
      // Public or private course flag
      isPublic?: boolean;
    }
  ]
}
```

### GET COURSE

- token required

REQUEST
/courses/[id]

RESPONSE

```json
{[
  id: string;
  title: string;
  description: string;
  lessons_number: number;
  progress?: number;
  createdAt: string;
  updatedAt: string;
  category?: string;
  author_id?: number;
  // rating/students are nullable to represent private/unavailable values
  rating?: number | null;
  ratings_number: number | null;
  students?: number | null;
  // Public or private course flag
  isPublic?: boolean;
]}
```

export interface Module {
id: string;
title: string;
lessons: Lesson[];
}

export interface Lesson {
id: string;
title: string;
description
}

### GET LESSON

- token required

REQUEST
/courses/[id]/lessons/[id]

RESPONSE

```json
{
  id: string;
  title: string;
  description: string;
  materials?: LessonMaterial[];
  questions?: TestQuestion[];
}
```

### FINISH LESSON

- token required

REQUEST
/courses/[id]/lessons/[id]/finish

RESPONSE
200

### CREATE COURSE

- token required

REQUEST (form data)

```
title
description
file
language
```

TODO: links

RESPONSE (creates empty course on DB)
201

TODO: create waiting mechanism

### COURSE PUBLICATION

- token required

REQUEST
/courses/[id]/publication

RESPONSE
200

### LEAVE REVIEW

- token required

REQUEST
/courses/[id]/add-review

RESPONSE
200
