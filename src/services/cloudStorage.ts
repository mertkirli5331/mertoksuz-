import { ProjectSettings, Phase, WeekPlan, Task, WeeklyDocument, TimeLog } from '../types/project';

export interface CloudProjectPayload {
  settings: ProjectSettings;
  phases: Phase[];
  weeks: WeekPlan[];
  tasks: Task[];
  documents: WeeklyDocument[];
  timeLogs: TimeLog[];
  savedAt: string;
}

const CLOUD_API_BASE = 'https://api.restful-api.dev/objects';
const CLOUD_STORAGE_KEY = 'mert_cloud_sync_id';

export function getStoredCloudId(): string | null {
  try {
    return localStorage.getItem(CLOUD_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredCloudId(id: string): void {
  try {
    localStorage.setItem(CLOUD_STORAGE_KEY, id);
  } catch (e) {
    console.error('Failed to store cloud ID', e);
  }
}

/**
 * Saves or updates project data on the cloud.
 */
export async function saveProjectToCloud(
  payload: CloudProjectPayload,
  existingCloudId?: string | null
): Promise<{ cloudId: string; shareUrl: string }> {
  const targetId = existingCloudId || getStoredCloudId();

  if (targetId) {
    try {
      // Try to update existing cloud record
      const res = await fetch(`${CLOUD_API_BASE}/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Mert Öksüz Proje - ${payload.settings.projectName}`,
          data: payload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const cloudId = data.id || targetId;
        setStoredCloudId(cloudId);
        const baseUrl = window.location.origin + window.location.pathname;
        return { cloudId, shareUrl: `${baseUrl}#cloud=${cloudId}` };
      }
    } catch (e) {
      console.warn('PUT failed, falling back to new POST', e);
    }
  }

  // Create new cloud record
  const res = await fetch(CLOUD_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `Mert Öksüz Proje - ${payload.settings.projectName}`,
      data: payload,
    }),
  });

  if (!res.ok) {
    throw new Error(`Bulut sunucusu yanıt vermedi (Durum: ${res.status})`);
  }

  const data = await res.json();
  const cloudId = data.id;
  setStoredCloudId(cloudId);

  const baseUrl = window.location.origin + window.location.pathname;
  return { cloudId, shareUrl: `${baseUrl}#cloud=${cloudId}` };
}

/**
 * Loads project data from the cloud using a Cloud ID.
 */
export async function loadProjectFromCloud(cloudId: string): Promise<CloudProjectPayload> {
  const res = await fetch(`${CLOUD_API_BASE}/${cloudId.trim()}`);
  if (!res.ok) {
    throw new Error('Belirtilen Bulut ID ile kayıt bulunamadı.');
  }

  const result = await res.json();
  if (!result || !result.data) {
    throw new Error('Bulut verisi boş veya geçersiz.');
  }

  setStoredCloudId(cloudId);
  return result.data as CloudProjectPayload;
}
