export type LessonRef =
  | { source: 'system'; trackId: string; lessonId: string }
  | { source: 'user'; ownerId: string; lessonId: string };

export const FOUNDATIONS_L01: LessonRef = {
  source: 'system',
  trackId: 'fundamentals',
  lessonId: 'l01',
};

function segment(value: string): string {
  if (typeof value !== 'string' || !value || value.length > 128) throw new TypeError('Identificador de conteúdo inválido.');
  return encodeURIComponent(value);
}

export function lessonKey(ref: LessonRef): string {
  if (ref.source === 'system') return `system:${segment(ref.trackId)}:${segment(ref.lessonId)}`;
  return `user:${segment(ref.ownerId)}:${segment(ref.lessonId)}`;
}
