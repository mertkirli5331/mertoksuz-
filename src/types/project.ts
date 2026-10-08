export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  weekNumber: number; // 1 to 38
  status: TaskStatus;
  priority: TaskPriority;
  estimatedHours: number;
  loggedHours: number;
  dueDate: string;
  tags: string[];
  createdAt: string;
  completedAt?: string;
}

export type FileType = 'drive_doc' | 'drive_sheet' | 'drive_slide' | 'drive_folder' | 'drive_link' | 'note' | 'markdown' | 'checklist' | 'other';

export interface WeeklyDocument {
  id: string;
  weekNumber: number; // 1 to 38
  title: string;
  type: FileType;
  url?: string; // Google Drive URL or external link
  content?: string; // Rich text / markdown / notes content directly editable in app
  updatedAt: string;
  author: string;
  size?: string;
  tags: string[];
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  startWeek: number;
  endWeek: number;
  color: string;
}

export interface WeekPlan {
  weekNumber: number;
  title: string;
  goal: string;
  phaseId: string;
  startDate: string;
  endDate: string;
  targetHours: number;
  notes: string;
  isMilestone?: boolean;
  milestoneTitle?: string;
  driveUrl?: string; // Direct Google Drive folder/file URL
  driveTitle?: string; // Optional custom label for the Drive link
}

export interface ProjectSettings {
  projectName: string;
  ownerName: string;
  startDate: string; // YYYY-MM-DD
  totalWeeks: number; // 38
  weeklyTargetHours: number;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
}

export interface TimeLog {
  id: string;
  taskId?: string;
  weekNumber: number;
  durationMinutes: number;
  timestamp: string;
  note: string;
}
