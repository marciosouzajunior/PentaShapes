import { lessons } from './lesson-content';
import { routeTracks } from './tracks';

// Routing and resume share one catalog; each content type keeps its own player.
export const playableLessons = [
  ...lessons.map(lesson => ({ kind: 'phrase' as const, lesson, ref: lesson.ref, href: lesson.href })),
  ...routeTracks.flatMap(track=>track.lessons.map(lesson => ({ kind: 'song' as const, track, lesson, ref: lesson.ref, href: lesson.href }))),
];
