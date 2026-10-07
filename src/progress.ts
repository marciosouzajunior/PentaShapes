import { FOUNDATIONS_L01, lessonKey, type LessonRef } from './content-identity';

const STORAGE_KEY = 'pentashapes.progress.v2';
const LEGACY_KEY = 'pentashapes.progress.v1';

export type LessonStep = 'listen' | 'practice' | 'complete';
export type LessonProgress = { step: LessonStep; contentRevision: number; updatedAt: string };
type ProgressStore = {
  schemaVersion: 2;
  activeLessonKey: string | null;
  entries: Record<string, LessonProgress>;
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isStep = (value: unknown): value is LessonStep => value === 'listen' || value === 'practice' || value === 'complete';

function loadStore(): ProgressStore {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== null) {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.schemaVersion !== 2 || !isRecord(value.entries)) throw new TypeError('Progresso armazenado inválido.');
    if (value.activeLessonKey !== null && typeof value.activeLessonKey !== 'string') throw new TypeError('Retomada armazenada inválida.');
    const entries: Record<string, LessonProgress> = {};
    for (const [key, entry] of Object.entries(value.entries)) {
      if (!isRecord(entry) || !isStep(entry.step) || !Number.isInteger(entry.contentRevision) || Number(entry.contentRevision) < 1 || typeof entry.updatedAt !== 'string') {
        throw new TypeError(`Progresso inválido para ${key}.`);
      }
      entries[key] = entry as LessonProgress;
    }
    return { schemaVersion: 2, activeLessonKey: value.activeLessonKey, entries };
  }

  const legacyRaw = localStorage.getItem(LEGACY_KEY);
  if (legacyRaw !== null) {
    try {
      const legacy: unknown = JSON.parse(legacyRaw);
      if (isRecord(legacy) && legacy.version === 1 && legacy.lessonId === 'L01' && isStep(legacy.step)) {
        const key = lessonKey(FOUNDATIONS_L01);
        return { schemaVersion: 2, activeLessonKey: key, entries: { [key]: { step: legacy.step, contentRevision: 1, updatedAt: new Date().toISOString() } } };
      }
    } catch { /* Keep unreadable legacy data untouched; start a fresh v2 store. */ }
  }
  return { schemaVersion: 2, activeLessonKey: null, entries: {} };
}

export function readProgress(ref: LessonRef = FOUNDATIONS_L01): LessonProgress | null {
  try {
    return loadStore().entries[lessonKey(ref)] ?? null;
  } catch {
    return null;
  }
}

export function saveProgress(ref: LessonRef, step: LessonStep, contentRevision = 1): boolean {
  try {
    if (!isStep(step) || !Number.isInteger(contentRevision) || contentRevision < 1) return false;
    const store = loadStore();
    const key = lessonKey(ref);
    store.entries[key] = { step, contentRevision, updatedAt: new Date().toISOString() };
    store.activeLessonKey = key;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}
