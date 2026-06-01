export interface Course {
  id: string;
  title: string;
  category: "programming" | "webdev" | "school" | "fundamentals";
  duration: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  syllabus: string[];
  baseFee: number; // in INR or USD, let's use ₹ (INR) or simple numeric
  instructor: string;
  skillsGained: string[];
}

export interface Batch {
  id: string;
  courseId: string;
  courseTitle: string;
  timing: string;
  days: string;
  seatsTotal: number;
  seatsLeft: number;
  trainer: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  categories: string[]; // matches course category/id scoring
}

export interface StudentInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  selectedCourse: string;
  batchPreference: string;
  experience: string;
  message: string;
  status: "pending" | "confirmed";
  submittedAt: string;
}
