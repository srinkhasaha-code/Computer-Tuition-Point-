import { Course, Batch, QuizQuestion } from "./types";

export const COURSES: Course[] = [
  {
    id: "python-logic",
    title: "Python Programming & Logic Building",
    category: "programming",
    duration: "3 Months (48 hours)",
    lessons: 24,
    level: "Beginner",
    description: "Learn coding fundamentals from scratch. Build absolute logic, learn variable operations, loop constructs, lists, functions, and create 5+ fun graphical mini-games with Python.",
    syllabus: [
      "Introduction to Python & VS Code setup",
      "Variables, Data Types & Operators",
      "Conditional Logic (if-elif-else)",
      "Loops (for, while, nested)",
      "Functions & Code Modularity",
      "Data Structures: Lists, Tuples & Dictionaries",
      "File Handling & Error Management",
      "Introduction to Object Oriented Programming (OOP)",
      "Tkinter GUI & Pygame fundamentals"
    ],
    baseFee: 3500,
    instructor: "Er. Alok Sharma (M.Tech CSE, 8+ yrs exp)",
    skillsGained: ["Problem Solving", "File Handling", "Algorithm Design", "GUI Building"]
  },
  {
    id: "fullstack-webdev",
    title: "Full-Stack Web Development Bootcamp",
    category: "webdev",
    duration: "4 Months (64 hours)",
    level: "Intermediate",
    lessons: 32,
    description: "Build interactive, high-speed, modern web applications. Go from raw HTML/CSS tags to advanced React.js architectures with clean responsive designs as a front-end expert.",
    syllabus: [
      "HTML5 Semantics & CSS3 Layouts",
      "CSS Flexbox, Grid & Responsive Design",
      "Tailwind CSS styling framework",
      "JavaScript Basics & DOM Manipulation",
      "Modern ES6+ Syntax & Asynchronous JS",
      "Fetch API, RESTful APIs & JSON Integrations",
      "React.js: Components, State, Props & Hooks",
      "Building a production portfolio app",
      "Deploying to Vercel/Netlify with Git basics"
    ],
    baseFee: 5000,
    instructor: "Samantha Roy (Senior Web Architect, 6+ yrs exp)",
    skillsGained: ["Responsive Layouts", "JavaScript DOM", "React Engine", "Tailwind styling", "Git & Hosting"]
  },
  {
    id: "school-cs",
    title: "CBSE / ICSE School Computer Science (Class 9-12)",
    category: "school",
    duration: "6 Months Academic Batch",
    level: "Beginner",
    lessons: 48,
    description: "Complete school board exam masterclass. Follow NCERT or ICSE guidelines to top your final boards. Features heavy emphasis on theory, output dry-running, and regular school mock tests.",
    syllabus: [
      "Understanding Computer Architecture basics",
      "Number Systems (Binary, Octal, Hex)",
      "Java / Python Syntax as per school board selection",
      "String Tokenizer & Mathematical Algorithms",
      "Array 1D & 2D Processing (Searching, Sorting)",
      "Classes and Objects (Deep theoretical concepts)",
      "Inheritance & Polymorphism",
      "File Streams & DB concepts",
      "Past 10 Years School Board Sample Papers solving"
    ],
    baseFee: 2500,
    instructor: "Mrs. Namita Paul (B.Ed, MCA, School HOD with 12+ yrs exp)",
    skillsGained: ["Exam Board Top Marks", "Dry-Running Code", "Java/Python Theory", "Algorithm Logic"]
  },
  {
    id: "dsa-cpp-java",
    title: "Data Structures & Algorithms (C++ / Java)",
    category: "programming",
    duration: "4 Months (60 hours)",
    level: "Advanced",
    lessons: 30,
    description: "Crack coding rounds and building strong software design logic. Dive deep into time-space complexity analysis, custom data structures, and standard platform algorithmic questions.",
    syllabus: [
      "Asymptotic Analysis (Big O, Omega, Theta notation)",
      "Recursion & Backtracking Masterclass",
      "Arrays, Arrays Manipulation, Matrix Math",
      "Singly, Doubly, & Circular Linked Lists",
      "Stacks & Queues (Implementation & popular questions)",
      "Trees & Binary Search Trees (Traversal, Balancing)",
      "Graphs: BFS, DFS, Dijkstra, MST algorithms",
      "Dynamic Programming (DP) & Greedy Algorithms",
      "Divide & Conquer, Binary Searches, Sorting under the hood"
    ],
    baseFee: 6000,
    instructor: "Er. Alok Sharma (M.Tech CSE)",
    skillsGained: ["Cracking Code Rounds", "Time Complexity Optimization", "Advanced Data Structures", "Logic Building"]
  },
  {
    id: "computer-basics-office",
    title: "Computer Fundamentals & Advanced Excel",
    category: "fundamentals",
    duration: "2 Months (32 hours)",
    lessons: 16,
    level: "Beginner",
    description: "Perfect for working professionals, administrative job seekers, or absolute beginners. Gain confidence in using operating systems, high-productivity MS Office/Google Workspace.",
    syllabus: [
      "Operating Systems Basics: Windows & Linux UI",
      "Keyboard Shortcuts & absolute speed-typing tips",
      "MS Word / Docs: Formatting, resumes, newsletters",
      "Advanced Excel / Sheets: VLOOKUP, HLOOKUP, XLOOKUP",
      "Excel Pivot Tables, dynamic charts, Conditional formatting",
      "IF and Nested logic formulas in Excel",
      "PowerPoint / Slides: Compelling business pitches",
      "Internet Safety, email writing etiquette, cloud backups"
    ],
    baseFee: 1800,
    instructor: "Rohit Verma (Office Productivity Lead, 5+ yrs exp)",
    skillsGained: ["Advanced Excel / VLOOKUP", "Speed Typing", "Admin Job Readiness", "Cloud Management"]
  },
  {
    id: "kids-coding",
    title: "Junior Code Club - Game Design & Logic for Kids",
    category: "school",
    duration: "3 Months (24 hours)",
    lessons: 12,
    level: "Beginner",
    description: "Designed for children aged 8 to 14. Turn screen time into learning time. Children use block-based coding like Scratch and blocky Python to code their own visual stories and arcade games.",
    syllabus: [
      "Introduction to drag-and-drop programming block loops",
      "X and Y coordinates, positioning sprites",
      "Input events: Keys, mouse, and microphone",
      "Sending broadcasts & timing sprite communication",
      "Simple score systems and lives inside games",
      "Creating animation loops",
      "Basic text structures in Python and Scratch",
      "Graduation Capstone: Build and present a custom arcade game"
    ],
    baseFee: 2200,
    instructor: "Mrs. Namita Paul",
    skillsGained: ["Creative Thinking", "Algorithmic Loops", "Physics and Vectors Basics", "Presentation Skills"]
  }
];

export const BATCHES: Batch[] = [
  {
    id: "b1",
    courseId: "python-logic",
    courseTitle: "Python Programming & Logic",
    timing: "04:30 PM - 06:00 PM",
    days: "Mon, Wed, Fri",
    seatsTotal: 15,
    seatsLeft: 3,
    trainer: "Er. Alok Sharma"
  },
  {
    id: "b2",
    courseId: "fullstack-webdev",
    courseTitle: "Full-Stack Web Dev Bootcamp",
    timing: "06:15 PM - 07:45 PM",
    days: "Tue, Thu, Sat",
    seatsTotal: 12,
    seatsLeft: 2,
    trainer: "Samantha Roy"
  },
  {
    id: "b3",
    courseId: "school-cs",
    courseTitle: "School CS Class 11/12",
    timing: "03:00 PM - 04:30 PM",
    days: "Mon, Wed, Fri",
    seatsTotal: 20,
    seatsLeft: 5,
    trainer: "Mrs. Namita Paul"
  },
  {
    id: "b4",
    courseId: "dsa-cpp-java",
    courseTitle: "DSA (C++ / Java) - Advanced",
    timing: "10:00 AM - 12:00 PM",
    days: "Sat, Sun",
    seatsTotal: 15,
    seatsLeft: 4,
    trainer: "Er. Alok Sharma"
  },
  {
    id: "b5",
    courseId: "computer-basics-office",
    courseTitle: "Advanced Excel & Basics",
    timing: "09:00 AM - 10:30 AM",
    days: "Tue, Thu, Sat",
    seatsTotal: 15,
    seatsLeft: 7,
    trainer: "Rohit Verma"
  },
  {
    id: "b6",
    courseId: "kids-coding",
    courseTitle: "Junior Code Club (Kids)",
    timing: "04:00 PM - 05:30 PM",
    days: "Sat, Sun",
    seatsTotal: 8,
    seatsLeft: 1,
    trainer: "Mrs. Namita Paul"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is your main primary goal or focus?",
    options: [
      "To build websites and launch web apps on the internet",
      "To learn deep concepts, build general coding logic, and write software programs",
      "To score 95%+ in my High School Board Examinations / Undergrad CS course",
      "To master everyday office work, spreadsheets, data presentation, or dynamic reports"
    ],
    categories: ["webdev", "programming", "school", "fundamentals"]
  },
  {
    id: 2,
    question: "What is your prior background in coding and computer science?",
    options: [
      "An absolute beginner. I have never seen a line of code or a custom tag",
      "Familiar with fundamental terms (variables, loops) but cannot design full solutions",
      "Studying computer science in school or college, but need robust logical mentorship",
      "Regular computer user. I know desktop apps but want to learn spreadsheet formulas"
    ],
    categories: ["fundamentals", "programming", "school", "webdev"]
  },
  {
    id: 3,
    question: "How much time can you comfortably commit to learning per week?",
    options: [
      "2-4 hours: Need a structured, highly productive, easy-to-digest timeline",
      "4-6 hours: Passionate to code mini projects, exercises, and custom algorithms",
      "6-8 hours: Extreme focus on mock papers, school exams, or interview structures",
      "Flexible: Want modern, practical step-by-step guidance over the weekends"
    ],
    categories: ["fundamentals", "programming", "school", "webdev"]
  },
  {
    id: 4,
    question: "Which of these interactive tools excites you the most?",
    options: [
      "Visually creating responsive grids and beautiful animated interfaces",
      "Running smart scripts to automate mundane files or crawl text",
      "Solving tricky problems, puzzle logic, and acing standardized board papers",
      "Analyzing massive sales data using VLOOKUP, pivot formulas, and professional graphics"
    ],
    categories: ["webdev", "programming", "school", "fundamentals"]
  }
];

export const FAQS = [
  {
    question: "Where is Computer Tuition Point located?",
    answer: "We are located at the Main Crossing Market hub, Sector 4, Suite 102. It's fully accessible with premium high-speed computer systems for all students. We also support standard online sessions on request."
  },
  {
    question: "Do you offer offline/classroom batches?",
    answer: "Yes! Our core focus is hands-on 1-on-1 and small batch classroom coaching. Every student gets their own individual PC terminal during class hours with no system sharing."
  },
  {
    question: "What if I miss a scheduled class?",
    answer: "No worries! We offer makeup classes over Friday/weekend sessions for students who miss classes due to school exams, travel, or medical emergencies."
  },
  {
    question: "Is certification provided after completion?",
    answer: "Absolutely! After finishing the coursework and successfully presenting your final capstone project, every student is awarded a custom signed Course Completion Certificate."
  },
  {
    question: "What is the fee payment structure?",
    answer: "To keep high-quality computer education affordable, we accept easy monthly installment payments or a 10% lump-sum discount for upfront package enrollments."
  }
];
