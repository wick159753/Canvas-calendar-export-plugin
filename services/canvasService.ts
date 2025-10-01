import { CanvasEvent } from '../types';

export const getCalendarEvents = async (): Promise<CanvasEvent[]> => {
  // In a real application, this would be an API call to Canvas.
  // We are using mock data for demonstration.
  console.log("Fetching mock calendar events...");
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  const today = new Date();
  const getFutureDate = (days: number, hour: number, minute: number, durationMinutes: number = 60) => {
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + days);
    startDate.setHours(hour, minute, 0, 0);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return { start: startDate, end: endDate };
  };

  const mockEvents: CanvasEvent[] = [
    {
      id: '1',
      title: 'Psychology 101 Midterm Exam',
      ...getFutureDate(2, 10, 0, 120),
      course: 'PSYC 101',
      description: 'Midterm exam covering chapters 1-5. Bring a #2 pencil and a calculator.',
      location: 'Main Auditorium, Room 201',
      isNew: false,
    },
    {
      id: '2',
      title: 'Assignment 3: Essay Draft Due',
      ...getFutureDate(4, 23, 59, 1),
      course: 'ENG 250: Advanced Composition',
      description: 'Submit the first draft of your research essay on the assigned topic. 5-7 pages.',
      location: 'Online Submission',
      isNew: false,
    },
    {
      id: '3',
      title: 'Project Presentation',
      ...getFutureDate(7, 14, 0, 90),
      course: 'CS 480: Software Engineering',
      description: 'Group presentation for the final project. Each group has 15 minutes.',
      location: 'Engineering Hall, Room E304',
      isNew: false,
    },
    {
        id: '4',
        title: 'History Lecture: The Roman Empire',
        ...getFutureDate(2, 13, 0, 50),
        course: 'HIST 110: Ancient Civilizations',
        description: 'Lecture focusing on the fall of the Western Roman Empire.',
        location: 'Lecture Hall B',
        isNew: false,
    },
    {
        id: '5',
        title: 'Calculus II Quiz',
        ...getFutureDate(5, 9, 0, 45),
        course: 'MATH 221',
        description: 'Quiz on integration techniques.',
        location: 'Science Building, Room S112',
        isNew: true,
        addedAt: new Date(), // Added just now
    },
    {
      id: '6',
      title: 'Final Project Milestone 2 Due',
      ...getFutureDate(10, 17, 0, 1),
      course: 'CS 480: Software Engineering',
      description: 'Submit the implementation and testing phase documentation.',
      location: 'Online Submission',
      isNew: false,
    },
    {
      id: '7',
      title: 'Pop Quiz 2',
      ...getFutureDate(3, 11, 0, 20),
      course: 'PSYC 101',
      description: 'A surprise pop quiz on last week\'s readings.',
      location: 'Main Auditorium, Room 201',
      isNew: true,
      addedAt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // Added 2 hours ago
    }
  ];
  return mockEvents;
};