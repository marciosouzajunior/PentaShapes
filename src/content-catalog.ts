import { lessons } from './lesson-content';
import { songLessons } from './song-content';

// Routing and resume share one catalog; each content type keeps its own player.
export const playableLessons = [
  ...lessons.map(lesson => ({ kind: 'phrase' as const, lesson, ref: lesson.ref, href: lesson.href })),
  ...songLessons.map(lesson => ({ kind: 'song' as const, lesson, ref: lesson.ref, href: lesson.href })),
];
