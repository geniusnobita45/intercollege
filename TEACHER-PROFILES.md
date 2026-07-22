# Teacher profile editing guide

Teacher entries live in:

```text
src/data/teachers.ts
```

Each profile supports:

- `slug`: URL-safe profile path
- `name`: verified teacher name
- `role`: designation
- `department`: directory filter category
- `subjects`: subject badges
- `qualification`: verified qualifications
- `experience`: verified experience summary
- `summary`: short introduction
- `philosophy`: teaching approach
- `expertise`: teaching strengths
- `achievements`: verified awards, results or contributions
- `initials`: fallback avatar letters
- `accent`: fallback avatar theme
- `image`: optional local or approved remote photograph
- `verified`: set to `true` after college approval

## Recommended photo setup

Store approved photographs in `public/teachers`, for example:

```text
public/teachers/anita-sharma.jpg
```

Then add:

```ts
image: '/teachers/anita-sharma.jpg'
```

Use portrait images with consistent lighting and framing. Obtain permission from each teacher before publishing photographs or personal profile information.
