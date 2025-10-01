export interface CanvasEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  course: string;
  description: string;
  location: string;
  isNew?: boolean;
  addedAt?: Date;
}