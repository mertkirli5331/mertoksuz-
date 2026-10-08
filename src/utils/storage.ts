import { Phase, ProjectSettings, Task, TimeLog, WeekPlan, WeeklyDocument } from '../types/project';
import { DEFAULT_PHASES, DEFAULT_SETTINGS, INITIAL_DOCUMENTS, INITIAL_TASKS, generateInitialWeeks } from './initialData';

const SETTINGS_KEY = 'mert_oksuz_project_settings';
const PHASES_KEY = 'mert_oksuz_project_phases';
const WEEKS_KEY = 'mert_oksuz_project_weeks';
const TASKS_KEY = 'mert_oksuz_project_tasks';
const DOCS_KEY = 'mert_oksuz_project_docs';
const TIME_LOGS_KEY = 'mert_oksuz_project_timelogs';

export function getProjectSettings(): ProjectSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveProjectSettings(settings: ProjectSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getPhases(): Phase[] {
  try {
    const raw = localStorage.getItem(PHASES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading phases', e);
  }
  return DEFAULT_PHASES;
}

export function savePhases(phases: Phase[]): void {
  localStorage.setItem(PHASES_KEY, JSON.stringify(phases));
}

export function getWeeks(): WeekPlan[] {
  try {
    const raw = localStorage.getItem(WEEKS_KEY);
    if (raw) {
      const parsed: WeekPlan[] = JSON.parse(raw);
      return parsed.map((w) => {
        if (w.weekNumber === 3 && !w.driveUrl) {
          return {
            ...w,
            title: '',
            goal: '',
            driveUrl: 'https://drive.google.com/drive/my-drive',
            driveTitle: 'Hafta 3 - Google Drive Çalışma Klasörü',
          };
        }
        if (w.weekNumber <= 30) {
          return { ...w, title: '', goal: '' };
        }
        return w;
      });
    }
  } catch (e) {
    console.error('Error loading weeks', e);
  }
  const settings = getProjectSettings();
  const initial = generateInitialWeeks(settings.startDate);
  saveWeeks(initial);
  return initial;
}

export function saveWeeks(weeks: WeekPlan[]): void {
  localStorage.setItem(WEEKS_KEY, JSON.stringify(weeks));
}

export function getTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading tasks', e);
  }
  saveTasks(INITIAL_TASKS);
  return INITIAL_TASKS;
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function getDocuments(): WeeklyDocument[] {
  try {
    const raw = localStorage.getItem(DOCS_KEY);
    if (raw) {
      const parsed: WeeklyDocument[] = JSON.parse(raw);
      if (!parsed.some((d) => d.weekNumber === 3 && d.type.startsWith('drive'))) {
        const week3Doc: WeeklyDocument = {
          id: 'doc-drive-week-3',
          weekNumber: 3,
          title: 'Hafta 3 - Google Drive Çalışma Klasörü',
          type: 'drive_folder',
          url: 'https://drive.google.com/drive/my-drive',
          content: 'Hafta 3 çalışma ve teslim dosyaları Google Drive bağlantısı.',
          updatedAt: new Date().toISOString(),
          author: 'Mert Öksüz',
          size: 'Bağlantı',
          tags: ['Google Drive', 'Hafta 3', 'Klasör'],
        };
        const updated = [...parsed, week3Doc];
        saveDocuments(updated);
        return updated;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error loading documents', e);
  }
  saveDocuments(INITIAL_DOCUMENTS);
  return INITIAL_DOCUMENTS;
}

export function saveDocuments(docs: WeeklyDocument[]): void {
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
}

export function getTimeLogs(): TimeLog[] {
  try {
    const raw = localStorage.getItem(TIME_LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading time logs', e);
  }
  return [];
}

export function saveTimeLogs(logs: TimeLog[]): void {
  localStorage.setItem(TIME_LOGS_KEY, JSON.stringify(logs));
}

export function exportProjectDataJSON(): string {
  const data = {
    settings: getProjectSettings(),
    phases: getPhases(),
    weeks: getWeeks(),
    tasks: getTasks(),
    documents: getDocuments(),
    timeLogs: getTimeLogs(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importProjectDataJSON(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.settings) saveProjectSettings(data.settings);
    if (data.phases) savePhases(data.phases);
    if (data.weeks) saveWeeks(data.weeks);
    if (data.tasks) saveTasks(data.tasks);
    if (data.documents) saveDocuments(data.documents);
    if (data.timeLogs) saveTimeLogs(data.timeLogs);
    return true;
  } catch (err) {
    console.error('Import error', err);
    return false;
  }
}

export function resetAllDataToDefault(): void {
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(PHASES_KEY);
  localStorage.removeItem(WEEKS_KEY);
  localStorage.removeItem(TASKS_KEY);
  localStorage.removeItem(DOCS_KEY);
  localStorage.removeItem(TIME_LOGS_KEY);
}
