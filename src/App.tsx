import React, { useState, useEffect, useMemo } from "react";
import { 
  Laptop, 
  Code, 
  BookOpen, 
  BarChart, 
  ChevronRight, 
  Clock, 
  Users, 
  Award, 
  BookMarked,
  CheckCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Calculator, 
  Compass, 
  ChevronDown, 
  AlertCircle,
  TrendingUp,
  X,
  Play,
  Check,
  Building,
  GraduationCap,
  LogOut,
  Lock,
  UserCheck
} from "lucide-react";
import { COURSES, BATCHES, QUIZ_QUESTIONS, FAQS } from "./data";
import { Course, Batch, StudentInquiry } from "./types";
import { auth } from "./firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  User 
} from "firebase/auth";

export default function App() {
  // Navigation / Scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Firebase Auth state managers
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string>("");
  const [authSubmitting, setAuthSubmitting] = useState<boolean>(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (!currentUser.emailVerified) {
          setPendingVerificationEmail(currentUser.email || "");
          setUser(null);
          signOut(auth);
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError("Please fill out both email and password fields.");
      return;
    }
    setAuthError("");
    setAuthSuccessMsg("");
    setAuthSubmitting(true);

    if (authMode === "signin") {
      try {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } catch (err: any) {
        setAuthError("Email or password is incorrect");
      } finally {
        setAuthSubmitting(false);
      }
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        try {
          await sendEmailVerification(userCredential.user);
        } catch (verifErr: any) {
          console.error("Verification email send error: ", verifErr);
        }
        await signOut(auth);
        setPendingVerificationEmail(authEmail);
      } catch (err: any) {
        if (err?.code === "auth/email-already-in-use") {
          setAuthError("User already exists. Please sign in");
        } else {
          setAuthError(err?.message || "An error occurred during sign up. Please try again.");
        }
      } finally {
        setAuthSubmitting(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    setAuthSuccessMsg("");
    setAuthSubmitting(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setAuthError(err?.message || "An error occurred during Google sign-in. Please try again.");
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  // State managers
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  
  // Interactive Code Playground state
  const [playgroundLanguage, setPlaygroundLanguage] = useState<"python" | "javascript" | "html">("python");
  const [codeStep, setCodeStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [playgroundOutput, setPlaygroundOutput] = useState<string[]>([]);

  // Skill Advisor Quiz state
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [currentQuizStep, setCurrentQuizStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(null);

  // Dynamic Tuition Estimator state
  const [estimatorCourseId, setEstimatorCourseId] = useState<string>(COURSES[0].id);
  const [estimatorIntensity, setEstimatorIntensity] = useState<"standard" | "intensive" | "weekend">("standard");
  const [estimatorMode, setEstimatorMode] = useState<"center" | "online" | "home">("center");
  const [isStudyMaterialIncluded, setIsStudyMaterialIncluded] = useState<boolean>(true);

  // Inquiry/Admissions Form state
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [experience, setExperience] = useState<string>("beginner");
  const [selectedInquiryCourse, setSelectedInquiryCourse] = useState<string>(COURSES[0].id);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("b1");
  const [message, setMessage] = useState<string>("");
  const [inquiryStatusMsg, setInquiryStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submittedInquiries, setSubmittedInquiries] = useState<StudentInquiry[]>([]);

  // FAQ Accordion State
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Real-time ticking operational status
  const [currentStatus, setCurrentStatus] = useState<string>("🟢 Admissions Open - Morning & Evening Slots Available");

  // Load past inquiries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("computer_tuition_point_inquiries");
    if (stored) {
      try {
        setSubmittedInquiries(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse storage inquiries", err);
      }
    }
  }, []);

  // Update real-time state mock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const hours = new Date().getHours();
      if (hours >= 19 || hours < 8) {
        setCurrentStatus("🟢 Admissions Open - Apply Online for Next Batch Enrollment!");
      } else {
        setCurrentStatus("🟢 Center is OPEN - Walk-in & Lab Practices Active!");
      }
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Play Code execution demonstration
  const handlePlaygroundRun = () => {
    setIsRunning(true);
    setPlaygroundOutput(["Initializing local execution stack...", "Checking compilation rules..."]);
    setCodeStep(0);

    const runInterval = setInterval(() => {
      setCodeStep((prev) => {
        const next = prev + 1;
        if (playgroundLanguage === "python") {
          if (next === 1) {
            setPlaygroundOutput((o) => [...o, "Executing simple iterator:", ">>> [Loop Step 1] i = 0", "🖥️ Output: Tuition Point Student 1 in class"]);
          } else if (next === 2) {
            setPlaygroundOutput((o) => [...o, ">>> [Loop Step 2] i = 1", "🖥️ Output: Tuition Point Student 2 in class"]);
          } else if (next === 3) {
            setPlaygroundOutput((o) => [...o, ">>> [Loop Step 3] i = 2", "🖥️ Output: Tuition Point Student 3 in class"]);
          } else if (next >= 4) {
            setPlaygroundOutput((o) => [...o, "✅ Process finished with Exit Code 0", "🚀 Great job! Welcome to logic building!"]);
            setIsRunning(false);
            clearInterval(runInterval);
          }
        } else if (playgroundLanguage === "javascript") {
          if (next === 1) {
            setPlaygroundOutput((o) => [...o, "Evaluating dynamic conditional block:", ">>> checkGrade(score = 98)", "🎯 Student Score is 90+"]);
          } else if (next === 2) {
            setPlaygroundOutput((o) => [...o, "🏆 Result output: 'Outstanding Board Marks'"]);
          } else if (next >= 3) {
            setPlaygroundOutput((o) => [...o, "✅ Web Console successfully printed grade result.", "🚀 Explore Web-Development below!"]);
            setIsRunning(false);
            clearInterval(runInterval);
          }
        } else {
          // HTML
          if (next === 1) {
            setPlaygroundOutput((o) => [...o, "Compiling CSS Grid container...", "Applied style layouts to dashboard card."]);
          } else if (next === 2) {
            setPlaygroundOutput((o) => [...o, "🖥️ Rendered: <div> Hello Computer Tuition Point </div>"]);
          } else if (next >= 3) {
            setPlaygroundOutput((o) => [...o, "✅ Layout parsed successfully at 100% responsiveness.", "🚀 Learn UI styling in our bootcamp!"]);
            setIsRunning(false);
            clearInterval(runInterval);
          }
        }
        return next;
      });
    }, 900);
  };

  // Skip step or restart sandbox
  useEffect(() => {
    setPlaygroundOutput(["Click the standard 'Run Code Program' button to execute logic."]);
    setCodeStep(0);
    setIsRunning(false);
  }, [playgroundLanguage]);

  // Quiz Matcher Logic
  const handleQuizAnswer = (questionId: number, answerIndex: number) => {
    const nextAnswers = { ...quizAnswers, [questionId]: QUIZ_QUESTIONS[questionId - 1].categories[answerIndex] };
    setQuizAnswers(nextAnswers);

    if (currentQuizStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizStep((v) => v + 1);
    } else {
      // Calculate scores for categories
      const counts: Record<string, number> = { programming: 0, webdev: 0, school: 0, fundamentals: 0 };
      (Object.values(nextAnswers) as string[]).forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });

      // Find the category with maximum score
      let topCategory = "programming";
      let maxCount = -1;
      Object.entries(counts).forEach(([cat, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topCategory = cat;
        }
      });

      // Match course
      const matched = COURSES.find((c) => c.category === topCategory) || COURSES[0];
      setRecommendedCourse(matched);
      setCurrentQuizStep(QUIZ_QUESTIONS.length); // complete step
    }
  };

  const restartQuiz = () => {
    setQuizAnswers({});
    setCurrentQuizStep(0);
    setRecommendedCourse(null);
    setQuizActive(true);
  };

  // Fee calculation values
  const feeCalculation = useMemo(() => {
    const selectedCourse = COURSES.find((c) => c.id === estimatorCourseId) || COURSES[0];
    let multiplierIntensity = 1.0;
    if (estimatorIntensity === "intensive") multiplierIntensity = 1.4; // 1.4x for fast double classes
    if (estimatorIntensity === "weekend") multiplierIntensity = 0.95;  // 5% discount for weekend layout

    let multiplierMode = 1.0;
    if (estimatorMode === "online") multiplierMode = 0.85; // 15% discount for digital live online classes
    if (estimatorMode === "home") multiplierMode = 1.75;  // 75% surcharge for home-tuition personal counselor visits

    const calculatedBase = Math.round(selectedCourse.baseFee * multiplierIntensity * multiplierMode);
    const materialCost = isStudyMaterialIncluded ? 350 : 0;
    const adminFees = 150;
    let scholarDiscount = 0;
    if (estimatorMode === "online" && estimatorIntensity === "standard") {
      scholarDiscount = Math.round(calculatedBase * 0.1); // Extra scholarship
    }

    const totalCost = calculatedBase + materialCost + adminFees - scholarDiscount;

    return {
      base: calculatedBase,
      material: materialCost,
      admin: adminFees,
      discount: scholarDiscount,
      total: totalCost
    };
  }, [estimatorCourseId, estimatorIntensity, estimatorMode, isStudyMaterialIncluded]);

  // Handle Form Submission
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setInquiryStatusMsg({
        type: "error",
        text: "Please enter your Full Name and Active Contact Number."
      });
      return;
    }

    const matchedCourse = COURSES.find((c) => c.id === selectedInquiryCourse)?.title || "General Query";
    const matchedBatch = BATCHES.find((b) => b.id === selectedBatchId);
    const batchTiming = matchedBatch ? `${matchedBatch.days} | ${matchedBatch.timing}` : "Flexible Batch";

    const newInquiry: StudentInquiry = {
      id: "INQ-" + Math.floor(Math.random() * 900000 + 100000),
      fullName,
      email: email || "Not Provided",
      phone,
      selectedCourse: matchedCourse,
      batchPreference: batchTiming,
      experience,
      message: message || "No extra requirements specified.",
      status: "pending",
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
    };

    const updated = [newInquiry, ...submittedInquiries];
    setSubmittedInquiries(updated);
    localStorage.setItem("computer_tuition_point_inquiries", JSON.stringify(updated));

    // Clear Form inputs
    setFullName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setInquiryStatusMsg({
      type: "success",
      text: `Congratulations! Your enrollment query received successfully. Admission Card ID: ${newInquiry.id}. Our academic coordinator will call you in 2 hours.`
    });

    // Auto dismiss state after 15s
    setTimeout(() => {
      setInquiryStatusMsg(null);
    }, 15000);
  };

  // Pre-fill fields from Interactive elements
  const prefillFromCourse = (courseId: string) => {
    setSelectedInquiryCourse(courseId);
    const firstBatch = BATCHES.find((b) => b.courseId === courseId);
    if (firstBatch) {
      setSelectedBatchId(firstBatch.id);
    }
    scrollToSection("apply");
  };

  const prefillFromBatch = (batch: Batch) => {
    setSelectedInquiryCourse(batch.courseId);
    setSelectedBatchId(batch.id);
    scrollToSection("apply");
  };

  // Delete local inquiry
  const handleDeleteInquiry = (id: string) => {
    const filtered = submittedInquiries.filter((q) => q.id !== id);
    setSubmittedInquiries(filtered);
    localStorage.setItem("computer_tuition_point_inquiries", JSON.stringify(filtered));
  };

  // Selected Course Object for Info display
  const activeCourse = COURSES.find((c) => c.id === activeCourseId) || null;

  if (pendingVerificationEmail) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-4 relative overflow-hidden select-none animate-fade-in">
        {/* Ambient neon flares */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-indigo/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand-cyan/10 blur-3xl" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.08),rgba(0,0,0,0))]" />

        <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-brand-indigo/5 space-y-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-gradient-to-br from-brand-indigo to-brand-cyan p-3 rounded-2xl text-slate-950 shadow-lg shadow-brand-indigo/10">
              <Mail className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Verify Your Email</h2>
              <p className="text-xs text-slate-400 mt-1">Computer Tuition Point Student Portal</p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-5 text-sm text-slate-300 leading-relaxed text-center">
            <p className="text-slate-200">
              “We have sent you a verification email to <span className="text-brand-cyan font-mono select-all break-all font-semibold">{pendingVerificationEmail}</span>. Please verify it and log in.”
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setPendingVerificationEmail("");
              setAuthMode("signin");
              setAuthEmail("");
              setAuthPassword("");
              setAuthError("");
              setAuthSuccessMsg("");
            }}
            className="w-full bg-gradient-to-r from-brand-indigo to-brand-cyan hover:from-brand-indigo hover:to-cyan-400 text-slate-950 font-bold text-sm py-2.5 px-4 rounded-xl shadow-md hover:scale-[1.01] transform active:scale-[0.99] transition flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
          >
            <span>Login</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
        {/* Neon backdrop glow */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="relative z-10 flex flex-col items-center gap-5 text-center">
          <div className="bg-gradient-to-br from-brand-indigo to-brand-cyan p-4 rounded-2xl text-slate-950 shadow-xl shadow-brand-indigo/10 animate-bounce">
            <Laptop className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white">Computer Tuition Point</h3>
            <p className="text-xs text-brand-cyan font-mono tracking-widest uppercase animate-pulse">Initializing Portal Session...</p>
          </div>
          <div className="h-1 w-24 bg-slate-900 rounded-full overflow-hidden mt-2 relative">
            <div className="h-full bg-gradient-to-r from-brand-indigo to-brand-cyan animate-[pulse_1.5s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-4 relative overflow-hidden select-none">
        {/* Ambient neon flares */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-indigo/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand-cyan/10 blur-3xl" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.08),rgba(0,0,0,0))]" />

        <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-brand-indigo/5 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-gradient-to-br from-brand-indigo to-brand-cyan p-3 rounded-2xl text-slate-950 shadow-lg shadow-brand-indigo/10">
              <Laptop className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Computer Tuition Point</h2>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === "signin" 
                  ? "Sign in to access your dashboard & school CS files" 
                  : "Register student profile to join standard batches"}
              </p>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authError && (
              <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 text-rose-400 text-xs flex items-center gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="leading-tight">{authError}</span>
              </div>
            )}

            {authSuccessMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 text-emerald-400 text-xs flex items-center gap-2.5 animate-fade-in">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="leading-tight">{authSuccessMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold font-mono tracking-wider uppercase text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-brand-cyan rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold font-mono tracking-wider uppercase text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-brand-cyan rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full bg-gradient-to-r from-brand-indigo to-brand-cyan hover:from-brand-indigo hover:to-cyan-400 text-slate-950 font-bold text-sm py-2.5 px-4 rounded-xl shadow-md hover:scale-[1.01] transform active:scale-[0.99] transition flex items-center justify-center gap-2 overflow-hidden mt-6 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
            >
              {authSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authMode === "signin" ? "Sign In to Portal" : "Create Student Account"}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-1 items-center text-slate-500 text-xs">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold font-mono tracking-widest uppercase text-slate-500">Or</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={authSubmitting}
            className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-100 font-semibold text-sm py-2.5 px-4 rounded-xl shadow-sm hover:scale-[1.01] transform active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
          >
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-red-500 to-yellow-400 font-mono text-base select-none">G</span>
            <span>Continue with Google</span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "signin" ? "signup" : "signin");
                setAuthError("");
                setAuthSuccessMsg("");
              }}
              className="text-xs text-slate-400 hover:text-brand-cyan transition font-medium underline underline-offset-4 cursor-pointer decoration-slate-600 hover:decoration-brand-cyan"
            >
              {authMode === "signin" 
                ? "Don't have an account? Sign up standard student account" 
                : "Already have a student account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-cyan selection:text-slate-950">
      
      {/* Dynamic Announcement Banner */}
      <div className="bg-gradient-to-r from-brand-indigo via-slate-900 to-brand-cyan py-2.5 px-4 text-center text-xs font-semibold select-none border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="bg-rose-500 text-[10px] text-white tracking-widest font-extrabold uppercase px-2 py-0.5 rounded animate-pulse">
            NEW ADMISSIONS
          </span>
          <span className="text-slate-300">
            {currentStatus}
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <button 
            type="button"
            onClick={() => scrollToSection("quiz")} 
            className="underline hover:text-white transition flex items-center gap-1 text-[11px]"
          >
            Take 1-Min Assessment <Sparkles className="w-3.5 h-3.5 inline text-amber-400" />
          </button>
        </div>
      </div>

      {/* Styled Top Contact Row */}
      <div className="bg-slate-900/60 text-slate-400 text-xs py-2 px-6 border-b border-slate-800/80 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 hover:text-slate-200 transition">
              <Phone className="w-3.5 h-3.5 text-brand-cyan" />
              <span>+91 98765 43210</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-200 transition">
              <Mail className="w-3.5 h-3.5 text-brand-cyan" />
              <span>admissions@computertuitionpoint.com</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span>Crossing Chowk, Main Sector-4, Metro Pillar 102</span>
            </span>
          </div>
        </div>
      </div>

      {/* Primary Header Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/90 box-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Brand */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="bg-gradient-to-br from-brand-indigo to-brand-cyan p-2.5 rounded-xl text-slate-950 shadow-lg shadow-brand-indigo/10 flex items-center justify-center">
              <Laptop className="w-6 h-6 text-slate-950 stroke-[2]" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Computer Tuition Point
              </span>
              <p className="text-[10px] text-brand-cyan font-mono tracking-wider uppercase font-medium">
                Practical Computer Academy
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button type="button" onClick={() => scrollToSection("courses")} className="hover:text-brand-cyan transition cursor-pointer">
              Courses
            </button>
            <button type="button" onClick={() => scrollToSection("playground")} className="hover:text-brand-cyan transition cursor-pointer">
              Code Playground
            </button>
            <button type="button" onClick={() => scrollToSection("quiz")} className="hover:text-brand-cyan transition cursor-pointer">
              Assessment Quiz
            </button>
            <button type="button" onClick={() => scrollToSection("estimator")} className="hover:text-brand-cyan transition cursor-pointer">
              Fee Estimator
            </button>
            <button type="button" onClick={() => scrollToSection("batches")} className="hover:text-brand-cyan transition cursor-pointer">
              Batches
            </button>
            <button type="button" onClick={() => scrollToSection("faqs")} className="hover:text-brand-cyan transition cursor-pointer">
              FAQs
            </button>
          </nav>

          {/* Quick Enquire Button */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-mono select-none truncate max-w-[120px]" title={user.email || ""}>
                  {user.email}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={async () => {
                await signOut(auth);
              }}
              title="Logout from classroom session"
              className="bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 hover:text-rose-300 transition px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button 
              type="button"
              onClick={() => scrollToSection("apply")} 
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-100 hover:text-white transition px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-sm hover:shadow-slate-800/50"
            >
              Enquire Now
            </button>
            <button 
              type="button"
              onClick={() => scrollToSection("quiz")} 
              className="hidden sm:block bg-gradient-to-r from-brand-indigo to-brand-cyan hover:from-brand-indigo hover:to-cyan-400 text-slate-950 hover:scale-[1.02] transform transition px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-md shadow-brand-indigo/10 active:scale-[0.98]"
            >
              Start Free Quiz
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="overflow-x-hidden">
        
        {/* HERO SECTION / LANDING DECK */}
        <section id="hero" className="relative pt-12 pb-20 md:py-24 xl:py-32 overflow-hidden border-b border-slate-900">
          {/* Neon backdrop glow grids */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(99,102,241,0.15),rgba(0,0,0,0))]" />
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cyan-400 to-indigo-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Information */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                
                {/* Visual Pill Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                  No. 1 Rated Computer Tuition Point in the Region
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Learn Real Coding Logic <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-brand-cyan via-slate-200 to-brand-indigo bg-clip-text text-transparent">
                    Step By Step
                  </span>
                </h1>

                <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                  Struggling with complex programming syntax, exam dry-runs, or school boards? Get high-impact professional guidance from M.Tech certified computer tutors. Small classroom sizes, 1-on-1 focus, and massive laboratory computer practice.
                </p>

                {/* Hero Action Cards */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => scrollToSection("courses")} 
                    className="w-full sm:w-auto bg-gradient-to-r from-brand-indigo to-brand-cyan hover:from-indigo-500 hover:to-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-lg shadow-brand-indigo/15 hover:shadow-brand-cyan/25 hover:scale-[1.01] transform transition duration-300 text-sm tracking-wide text-center uppercase"
                  >
                    View Class Timings
                  </button>
                  <button 
                    type="button"
                    onClick={() => scrollToSection("playground")} 
                    className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-100 hover:text-white font-semibold px-8 py-4 rounded-xl hover:bg-slate-900/80 transition text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Code className="w-4 h-4 text-brand-cyan" />
                    Try Coding Sandbox
                  </button>
                </div>

                {/* Micro metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-900 text-left">
                  <div>
                    <span className="block text-2xl sm:text-3xl font-extrabold text-white">1500+</span>
                    <span className="text-xs text-slate-400 font-medium">Students Certified</span>
                  </div>
                  <div>
                    <span className="block text-2xl sm:text-3xl font-extrabold text-brand-cyan">100%</span>
                    <span className="text-xs text-slate-400 font-medium">Individual PCs</span>
                  </div>
                  <div>
                    <span className="block text-2xl sm:text-3xl font-extrabold text-white">100%</span>
                    <span className="text-xs text-slate-400 font-medium">Practical Based</span>
                  </div>
                  <div>
                    <span className="block text-2xl sm:text-3xl font-extrabold text-brand-indigo">99/100</span>
                    <span className="text-xs text-slate-400 font-medium">Board Exam Peaks</span>
                  </div>
                </div>

              </div>

              {/* Right Column Interactive Quick Panel */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                <div className="absolute inset-0 bg-brand-cyan opacity-10 rounded-3xl blur-2xl" />
                
                {/* Premium Promo card */}
                <div className="bg-slate-900/90 border border-slate-800/80 p-6 md:p-8 rounded-3xl relative z-10 shadow-2xl backdrop-blur-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-widest text-brand-cyan uppercase font-bold">
                       LATEST UPDATE
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Classroom Seats Booking Open
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Why Choose Our Tuition Point?
                    </h3>
                    <ul className="space-y-3.5 text-xs text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                        <span><strong>No Sharing:</strong> Standard rule of <strong>1 PC Screen per Student</strong>. Learn by actual coding, not copying.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                        <span><strong>Senior Mentors:</strong> Standard curriculum built by Er. Alok Sharma (M.Tech CSE, ex-Industry software engineer) & Mrs. Namita Paul.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                        <span><strong>Regular Evaluation:</strong> Weekly mock coding tests, logic dry runs, plus previous years school board question solving.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                        <span><strong>Homework & Lab:</strong> Standard digital classroom portal to upload homework and receive prompt, detailed code corrections.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Trust indicator */}
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                    <div className="bg-brand-indigo/10 p-2.5 rounded-xl text-brand-indigo flex items-center justify-center">
                      <Award className="w-5 h-5 text-brand-indigo" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        BOARD EXAM SPECIAL ACADEMY 
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Excellent history of students acing ICSE, CBSE, and Varsity computer examinations.
                      </p>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button 
                      type="button"
                      onClick={() => scrollToSection("quiz")} 
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 border border-slate-700/50"
                    >
                      <Compass className="w-4 h-4 text-brand-cyan" />
                      Not sure which course? Find your match
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION: INTERACTIVE CODE PLAYGROUND (Educational Segment) */}
        <section id="playground" className="py-20 bg-slate-950 border-b border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <span className="font-mono text-brand-cyan text-xs tracking-widest font-extrabold uppercase">
                EXPERIENCE CODING NOW
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Learn Computer Logic, Visualized Click-By-Step
              </h2>
              <p className="text-slate-400 text-sm">
                Tuition should not be boring static lectures. We make you feel every line of code inside our interactive laboratory. Click languages below to see custom program flows running step by step.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Controls Column */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                
                {/* Language Selectors */}
                <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-3 py-1 bg-slate-950/20 rounded">
                    Toggle Target Course Preview
                  </span>
                  
                  <button 
                    type="button"
                    onClick={() => setPlaygroundLanguage("python")}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono font-medium transition cursor-pointer ${playgroundLanguage === "python" ? "bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/35" : "text-slate-300 hover:bg-slate-800/50"}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">🐍</span>
                      <span>Python Loop Logic Counter</span>
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button 
                    type="button"
                    onClick={() => setPlaygroundLanguage("javascript")}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono font-medium transition cursor-pointer ${playgroundLanguage === "javascript" ? "bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/35" : "text-slate-300 hover:bg-slate-800/50"}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-yellow-400 text-sm">⚡</span>
                      <span>Web Dev (JavaScript Flow)</span>
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button 
                    type="button"
                    onClick={() => setPlaygroundLanguage("html")}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono font-medium transition cursor-pointer ${playgroundLanguage === "html" ? "bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/35" : "text-slate-300 hover:bg-slate-800/50"}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sky-400 text-sm">🌐</span>
                      <span>HTML Grid Formatting syntax</span>
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Educational Box */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-brand-cyan" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      LABORATORY ADVANTAGE
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our student laboratory is loaded with top compiling tools, Git command dashboards, and customized practice engines. Teachers sit alongside you to verify every error.
                  </p>
                  <ul className="space-y-2 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Learn dry-run code sheets on Whiteboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Hands-on mini-projects every 2 weeks</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Console & Code Editor Column */}
              <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl">
                
                {/* Editor Header */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono tracking-wider ml-4">
                      {playgroundLanguage === "python" ? "logic_builder.py" : playgroundLanguage === "javascript" ? "web_calculator.js" : "layout_index.html"}
                    </span>
                  </div>
                  <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-amber-500 font-mono">
                    Interactive Preview
                  </span>
                </div>

                {/* Editor Body with Code Highlight representation */}
                <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto space-y-1 bg-slate-950/40 text-slate-200">
                  {playgroundLanguage === "python" && (
                    <>
                      <div><span className="text-slate-500"># Computer Tuition Point - Lesson #1 Logic Loop</span></div>
                      <div className={`transition-colors duration-300 ${codeStep === 0 ? "bg-brand-indigo/10 text-white rounded px-1 -mx-1 border-l-2 border-brand-indigo" : ""}`}><span className="text-brand-indigo">def</span> <span className="text-brand-cyan">animate_tuition_classes</span>():</div>
                      <div className={`transition-colors duration-300 ${codeStep >= 1 && codeStep <= 3 ? "bg-brand-indigo/10 text-white rounded px-1 -mx-1 border-l-2 border-brand-indigo" : ""} pl-4`}>students = [<span className="text-emerald-400">"Sneha"</span>, <span className="text-emerald-400">"Rachit"</span>, <span className="text-emerald-400">"Karan"</span>]</div>
                      <div className="pl-4"><span className="text-brand-indigo">for</span> i, student <span className="text-brand-indigo">in</span> <span className="text-brand-cyan">enumerate</span>(students):</div>
                      <div className="pl-8"><span className="text-brand-cyan">print</span>(<span className="text-emerald-400">f"Tuition Point Student &#123;i+1&#125; in class"</span>)</div>
                      <div className={`transition-colors duration-300 ${codeStep >= 4 ? "bg-emerald-500/10 text-emerald-400 rounded px-1 -mx-1 border-l-2 border-emerald-400" : ""} pl-4`}><span className="text-brand-cyan">print</span>(<span className="text-emerald-400">"🚀 Great job! Welcome to logic building!"</span>)</div>
                    </>
                  )}

                  {playgroundLanguage === "javascript" && (
                    <>
                      <div><span className="text-slate-500">// Web Dev Course - Grade calculator script</span></div>
                      <div className={`transition-colors duration-300 ${codeStep === 0 ? "bg-brand-indigo/10 text-white rounded px-1 -mx-1 border-l-2 border-brand-indigo" : ""}`}><span className="text-brand-indigo">function</span> <span className="text-brand-cyan">checkGrade</span>(studentScore) &#123;</div>
                      <div className={`transition-colors duration-300 ${codeStep === 1 ? "bg-brand-indigo/10 text-white rounded px-1 -mx-1 border-l-2 border-brand-indigo" : ""} pl-4`}><span className="text-brand-indigo">if</span> (studentScore &gt;= <span className="text-amber-400">90</span>) &#123;</div>
                      <div className="pl-8"><span className="text-brand-indigo">return</span> <span className="text-emerald-400">"Outstanding Board Marks"</span>;</div>
                      <div className="pl-4">&#125; <span className="text-brand-indigo">else</span> &#123;</div>
                      <div className="pl-8"><span className="text-brand-indigo font-normal">return</span> <span className="text-emerald-400">"Work Hard & Practice Lab"</span>;</div>
                      <div className="pl-4">&#125;</div>
                      <div className={`transition-colors duration-300 ${codeStep >= 2 ? "bg-emerald-500/10 text-emerald-400 rounded px-1 -mx-1 border-l-2 border-emerald-400" : ""}`}>&#125;</div>
                    </>
                  )}

                  {playgroundLanguage === "html" && (
                    <>
                      <div><span className="text-slate-500">&lt;!-- Beginner HTML Class - Layout card structure --&gt;</span></div>
                      <div className={`transition-colors duration-300 ${codeStep === 0 ? "bg-brand-indigo/10 text-white rounded px-1 -mx-1 border-l-2 border-brand-indigo" : ""}`}>&lt;<span className="text-brand-indigo">div</span> <span className="text-teal-400">class</span>=<span className="text-emerald-300">"coaching-card grid grid-cols-1 shadow"</span>&gt;</div>
                      <div className={`transition-colors duration-300 ${codeStep === 1 ? "bg-brand-indigo/10 text-white rounded px-1 -mx-1 border-l-2 border-brand-indigo" : ""} pl-4`}>&lt;<span className="text-brand-indigo">h2</span> <span className="text-teal-400">class</span>=<span className="text-emerald-300">"text-bold text-slate-100"</span>&gt;</div>
                      <div className="pl-8">Welcome Computer Tuition Point</div>
                      <div className="pl-4">&lt;/<span className="text-brand-indigo">h2</span>&gt;</div>
                      <div className={`transition-colors duration-300 ${codeStep >= 2 ? "bg-emerald-500/10 text-emerald-400 rounded px-1 -mx-1 border-l-2 border-emerald-400" : ""}`}>&lt;/<span className="text-brand-indigo">div</span>&gt;</div>
                    </>
                  )}
                </div>

                {/* Console Output Block */}
                <div className="bg-slate-950 p-5 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                       System Terminal Output
                    </span>
                    <button 
                      type="button"
                      disabled={isRunning}
                      onClick={handlePlaygroundRun} 
                      className="bg-brand-cyan hover:bg-cyan-400 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-slate-950 px-4 py-1.5 rounded text-xs font-bold font-mono tracking-wider transition flex items-center gap-1.5 uppercase cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                      Run Code Program
                    </button>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-xs font-mono text-slate-300 min-h-[96px] max-h-[140px] overflow-y-auto space-y-1">
                    {playgroundOutput.map((line, i) => (
                      <div key={i} className={line.startsWith("🖥️") ? "text-brand-cyan font-bold" : line.startsWith("🚀") || line.startsWith("✅") ? "text-emerald-400 font-bold" : "text-slate-400"}>
                        {line}
                      </div>
                    ))}
                    {isRunning && (
                      <div className="text-brand-indigo animate-pulse">▋ Executing program compiler logic...</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* COMPREHENSIVE COURSE CATALOG */}
        <section id="courses" className="py-20 lg:py-28 relative bg-slate-900/30 border-b border-slate-900">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
              <div className="space-y-3">
                <span className="font-mono text-brand-indigo text-xs tracking-widest font-extrabold uppercase">
                  ACADEMIC SYLLABI
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  High-Yield Tuition Courses Offered
                </h2>
                <span className="text-slate-400 text-sm max-w-xl block">
                  Whether you are a class 9 board student or seeking high-demand software engineering logic, select the matching module categorized perfectly for your needs.
                </span>
              </div>

              {/* Category Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {["all", "programming", "webdev", "school", "fundamentals"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveCourseId(null); // Close active course details on change to keep it neat
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition border cursor-pointer ${selectedCategory === cat ? "bg-gradient-to-r from-brand-indigo to-brand-cyan text-slate-950 border-brand-cyan shadow" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"}`}
                  >
                    {cat === "all" ? "All Formats" : cat === "webdev" ? "Web Dev" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Master Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {COURSES.filter((c) => selectedCategory === "all" || c.category === selectedCategory).map((course) => {
                const iconMap: Record<string, any> = {
                  programming: Code,
                  webdev: Laptop,
                  school: BookMarked,
                  fundamentals: BarChart
                };
                const IconComponent = iconMap[course.category] || BookOpen;

                return (
                  <div 
                    key={course.id}
                    className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition duration-300 hover:-translate-y-1 shadow-lg hover:shadow-brand-indigo/5 flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-4">
                      {/* Header row details */}
                      <div className="flex items-center justify-between">
                        <span className="bg-slate-850 text-brand-cyan font-mono text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                          {course.level}
                        </span>
                        <div className="text-slate-500 font-mono text-xs flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      {/* Title & icon */}
                      <div className="flex items-start gap-3.5">
                        <div className="bg-brand-indigo/10 text-brand-indigo p-2.5 rounded-xl flex-shrink-0 mt-0.5">
                          <IconComponent className="w-5 h-5 text-brand-indigo" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-white text-base md:text-lg leading-snug tracking-tight">
                            {course.title}
                          </h3>
                        </div>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-slate-300 font-normal leading-relaxed">
                        {course.description}
                      </p>

                      {/* Course Skills bullets */}
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {course.skillsGained.slice(0, 3).map((v, i) => (
                          <span key={i} className="bg-slate-950 font-mono text-[10px] text-slate-400 px-2 py-0.5 rounded border border-slate-900">
                            ✓ {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Row Action Controls */}
                    <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between gap-2.5">
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">TUITON FEE APPROX</span>
                        <span className="text-base font-extrabold text-white">₹{course.baseFee.toLocaleString()}<span className="text-xs text-slate-400 font-normal"> /mo</span></span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button 
                          type="button"
                          onClick={() => {
                            setActiveCourseId(course.id);
                            // Scroll down tiny bit to notice
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          Syllabus
                        </button>
                        <button 
                          type="button"
                          onClick={() => prefillFromCourse(course.id)} 
                          className="bg-gradient-to-r from-brand-indigo to-brand-cyan hover:from-indigo-500 hover:to-cyan-400 text-slate-950 px-3.5 py-2 rounded-lg text-xs font-bold transition uppercase tracking-wider cursor-pointer"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* EXPANDED COURSE DETAILS MODAL / DRAWER (State dependent) */}
            {activeCourse && (
              <div className="mt-12 bg-slate-900 border border-brand-indigo/35 p-6 sm:p-8 rounded-3xl relative z-20 shadow-2xl animate-fade-in">
                {/* Close handle button */}
                <button 
                  type="button"
                  onClick={() => setActiveCourseId(null)} 
                  className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 p-2 rounded-full transition cursor-pointer"
                  title="Close Syllabus View"
                >
                  <X className="w-4 h-4 cursor-pointer" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Basic specifications */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] tracking-wider font-mono font-bold uppercase text-brand-cyan px-2.5 py-1 bg-brand-cyan/10 rounded border border-brand-cyan/20">
                         Syllabus Overview
                      </span>
                      <h3 className="text-2xl font-extrabold text-white">
                        {activeCourse.title}
                      </h3>
                      <p className="text-xs text-slate-300">
                        Designed & Mentored by {activeCourse.instructor}. Follows interactive lesson grids emphasizing real projects over plain theoretical memorization.
                      </p>
                    </div>

                    {/* Instructor details column card */}
                    <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-800 p-2 rounded-lg text-brand-cyan text-xs font-bold font-mono">
                          M.TECH
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block font-semibold">FACULTY INSTRUCTOR</span>
                          <span className="text-xs font-extrabold text-slate-100">{activeCourse.instructor}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Senior computer supervisor ensuring every student gets immediate whiteboard and PC debugging feedback in every lecture.
                      </p>
                    </div>

                    {/* Fast Course statistics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl text-center">
                        <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Lectures Total</span>
                        <span className="text-base font-extrabold text-white">{activeCourse.lessons} Modules</span>
                      </div>
                      <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl text-center">
                        <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Duration Approx</span>
                        <span className="text-base font-extrabold text-brand-cyan">{activeCourse.duration}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/80 pt-4 flex gap-3">
                      <button 
                        type="button"
                        onClick={() => prefillFromCourse(activeCourse.id)}
                        className="w-full bg-gradient-to-r from-brand-indigo to-brand-cyan text-slate-950 hover:scale-[1.01] transition font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider text-center"
                      >
                         Reserve Tuition Spot Now
                      </button>
                    </div>

                  </div>

                  {/* List of Syllabus topics list */}
                  <div className="lg:col-span-7 space-y-4">
                    <h4 className="text-xs font-mono tracking-widest text-brand-indigo uppercase font-extrabold">
                       Complete Weekly Module Timeline ({activeCourse.syllabus.length} Weeks)
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-2">
                      {activeCourse.syllabus.map((topic, index) => (
                        <div key={index} className="bg-slate-950 border border-slate-900 hover:border-slate-800 p-3.5 rounded-xl flex items-start gap-3 transition">
                          <span className="bg-brand-indigo/10 text-brand-indigo font-mono text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-200">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Capstone badge */}
                    <div className="bg-gradient-to-r from-teal-950/40 via-slate-950 to-brand-cyan/5 border border-teal-900/40 p-4 rounded-xl flex items-center gap-3">
                      <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                          Graduation Capstone Project Required
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          Students build a real GUI calculator, Pygame screen, school board submission list, or web landing page to achieve their signed completion badge.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}

          </div>
        </section>

        {/* INTERACTIVE SKILL ASSESSMENT / COURSE ADVISOR MATCH */}
        <section id="quiz" className="py-20 bg-slate-950 relative border-b border-slate-900">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(99,102,241,0.06),rgba(0,0,0,0))]" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            
            {/* Pre Quiz State */}
            {!quizActive ? (
              <div className="bg-slate-900/90 border border-slate-800/80 p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-xl">
                <div className="w-16 h-16 mx-auto bg-brand-cyan/10 text-brand-cyan p-4 rounded-full flex items-center justify-center">
                  <Compass className="w-8 h-8 text-brand-cyan stroke-[1.8] animate-spin-slow" />
                </div>
                <div className="space-y-3">
                  <span className="font-mono text-brand-cyan text-xs tracking-widest font-extrabold uppercase">
                     COURSE SMART ADVISOR
                  </span>
                  <h2 className="text-3xl font-extrabold text-white">
                    Not Sure Where To Begin?
                  </h2>
                  <p className="text-slate-300 text-sm max-w-xl mx-auto">
                    Answer 4 humble, non-technical questions about your daily hobbies, prior computing experience, and learning goals. Our system will dynamically suggest the optimum Computer Tuition Point course.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={restartQuiz}
                    className="bg-gradient-to-r from-brand-indigo to-brand-cyan hover:from-indigo-500 hover:to-cyan-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl shadow-lg transition uppercase tracking-wider text-xs cursor-pointer"
                  >
                    Launch Interactive Course Quiz
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 font-mono">
                  Takes less than 1 minute • Absolutely Free • Fully Customized
                </p>
              </div>
            ) : (
              /* Active Stepper Quiz Card */
              <div className="bg-slate-900 border border-brand-indigo/30 p-8 rounded-3xl shadow-2xl relative space-y-6">
                
                {/* Header Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="font-bold text-brand-cyan uppercase tracking-wider">
                      Student Skill Assessment
                    </span>
                    <span>
                      Question {currentQuizStep === QUIZ_QUESTIONS.length ? QUIZ_QUESTIONS.length : currentQuizStep + 1} of {QUIZ_QUESTIONS.length}
                    </span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-cyan transition-all duration-300"
                      style={{ width: `${((currentQuizStep) / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question body */}
                {currentQuizStep < QUIZ_QUESTIONS.length ? (
                  <div className="space-y-6">
                    <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                      Q: {QUIZ_QUESTIONS[currentQuizStep].question}
                    </h3>

                    <div className="grid grid-cols-1 gap-3.5">
                      {QUIZ_QUESTIONS[currentQuizStep].options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuizAnswer(QUIZ_QUESTIONS[currentQuizStep].id, idx)}
                          className="w-full text-left bg-slate-950 hover:bg-slate-800/80 border border-slate-850 hover:border-brand-cyan/40 p-4 rounded-xl text-xs sm:text-sm font-medium transition duration-200 text-slate-200 hover:text-white flex items-start gap-3 cursor-pointer"
                        >
                          <span className="bg-slate-900 text-slate-400 w-5 h-5 rounded-full text-center flex items-center justify-center font-mono text-xs flex-shrink-0 mt-0.5 border border-slate-800">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Quiz Completed matched recommendation deck */
                  <div className="text-center space-y-6 animate-fade-in">
                    <div className="w-12 h-12 mx-auto bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    
                    <div className="space-y-2">
                      <span className="font-mono text-emerald-400 text-xs font-bold uppercase tracking-widest block">
                         MATCH COMPLETED SUCCESSFULLY
                      </span>
                      <h3 className="text-2xl font-extrabold text-white">
                        Ideal Tuition Fit: <br className="sm:hidden" />
                        <span className="text-brand-cyan">{recommendedCourse?.title}</span>
                      </h3>
                      <p className="text-slate-300 text-xs max-w-lg mx-auto">
                        Based on your profile, we highly recommend launching your computer education journey with our <strong>{recommendedCourse?.title}</strong> path.
                      </p>
                    </div>

                    {/* Matched Course details card */}
                    {recommendedCourse && (
                      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl max-w-lg mx-auto text-left space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">COURSE DETAILS SUMMARY</span>
                          <span className="text-[11px] text-brand-cyan bg-brand-cyan/5 px-2.5 py-0.5 rounded border border-brand-cyan/10 font-bold uppercase font-mono">{recommendedCourse.level}</span>
                        </div>
                        <h4 className="font-bold text-white text-base">
                          {recommendedCourse.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {recommendedCourse.description}
                        </p>
                        <ul className="text-xs text-slate-300 space-y-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 border-t border-slate-900 pt-3">
                          <li className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full" />
                            <span>Duration: {recommendedCourse.duration}</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full" />
                            <span>Total Modules: {recommendedCourse.lessons}</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full" />
                            <span>Guide: {recommendedCourse.instructor}</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full" />
                            <span>Approx Cost: ₹{recommendedCourse.baseFee}/mo</span>
                          </li>
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (recommendedCourse) {
                            prefillFromCourse(recommendedCourse.id);
                          }
                          setQuizActive(false);
                        }}
                        className="w-full sm:w-auto bg-gradient-to-r from-brand-indigo to-brand-cyan text-slate-950 font-bold px-8 py-3.5 rounded-xl uppercase tracking-wider text-xs cursor-pointer"
                      >
                        Apply for Recommended Seat
                      </button>
                      <button
                        type="button"
                        onClick={restartQuiz}
                        className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 px-8 py-3.5 rounded-xl font-bold transition text-xs uppercase cursor-pointer"
                      >
                        Retake Assessment
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>
        </section>

        {/* FEE ESTIMATOR & PLAN BUILDER */}
        <section id="estimator" className="py-20 bg-slate-900/10 border-b border-brand-indigo/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <span className="font-mono text-brand-cyan text-xs tracking-widest font-extrabold uppercase">
                TUITION QUOTE CALCULATOR
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Customize Your Learning Plan & Estimate Fees
              </h2>
              <p className="text-slate-400 text-sm">
                No hidden costs. Slide intensity structures and select dynamic course layouts to generate your detailed estimated monthly tuition bill instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Configuration Panel */}
              <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
                
                {/* 1. Choose Course Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                    1. Select Target Computer Course
                  </label>
                  <select 
                    value={estimatorCourseId}
                    onChange={(e) => setEstimatorCourseId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-brand-cyan transition cursor-pointer"
                  >
                    {COURSES.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} (Base: ₹{course.baseFee}/mo)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Intensity Selection buttons */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                    2. Select Batch Schedule Intensity & Days
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setEstimatorIntensity("standard")}
                      className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${estimatorIntensity === "standard" ? "bg-brand-indigo/10 border-brand-indigo text-slate-100" : "bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400"}`}
                    >
                      <span className="block text-xs font-bold text-slate-200">Standard</span>
                      <span className="text-[10px] block text-slate-400 mt-1 leading-normal">
                        3 Days/Week • Alt sessions (1.5h/ea)
                      </span>
                      <span className="text-[10px] text-brand-cyan font-semibold block mt-1">Normal Rate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEstimatorIntensity("intensive")}
                      className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${estimatorIntensity === "intensive" ? "bg-brand-indigo/10 border-brand-indigo text-slate-100" : "bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400"}`}
                    >
                      <span className="block text-xs font-bold text-slate-200">Intensive Express</span>
                      <span className="text-[10px] block text-slate-400 mt-1 leading-normal">
                        Daily Classes • Fast graduation model
                      </span>
                      <span className="text-[10px] text-brand-cyan font-semibold block mt-1">+40% Priority Cost</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEstimatorIntensity("weekend")}
                      className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${estimatorIntensity === "weekend" ? "bg-brand-indigo/10 border-brand-indigo text-slate-100" : "bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400"}`}
                    >
                      <span className="block text-xs font-bold text-slate-200">Weekend Only</span>
                      <span className="text-[10px] block text-slate-400 mt-1 leading-normal">
                        Sat & Sun classes • Perfect for workers
                      </span>
                      <span className="text-[10px] text-brand-cyan font-semibold block mt-1">5% Slack Discount</span>
                    </button>

                  </div>
                </div>

                {/* 3. Learning Mode Radio Selection buttons */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                    3. Choose Classroom Learning Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setEstimatorMode("center")}
                      className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${estimatorMode === "center" ? "bg-brand-indigo/10 border-brand-indigo text-slate-100" : "bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400"}`}
                    >
                      <Building className="w-4 h-4 text-brand-cyan mb-2" />
                      <span className="block text-xs font-bold text-slate-200">Main Center Lab</span>
                      <span className="text-[10px] block text-slate-400 mt-1">
                        Use high-end Tuition PCs, 1-on-1 counselor
                      </span>
                      <span className="text-[10px] text-brand-cyan font-semibold block mt-1">Recommended Fit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEstimatorMode("online")}
                      className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${estimatorMode === "online" ? "bg-brand-indigo/10 border-brand-indigo text-slate-100" : "bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400"}`}
                    >
                      <Laptop className="w-4 h-4 text-brand-cyan mb-2" />
                      <span className="block text-xs font-bold text-slate-200">Live Online Digital</span>
                      <span className="text-[10px] block text-slate-400 mt-1">
                        Attend live streams from your laptop at home
                      </span>
                      <span className="text-[10px] text-brand-cyan font-semibold block mt-1">15% Course Off</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEstimatorMode("home")}
                      className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${estimatorMode === "home" ? "bg-brand-indigo/10 border-brand-indigo text-slate-100" : "bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400"}`}
                    >
                      <MapPin className="w-4 h-4 text-rose-500 mb-2 animate-bounce" />
                      <span className="block text-xs font-bold text-slate-200">Individual Home visit</span>
                      <span className="text-[10px] block text-slate-400 mt-1">
                        Mentor visits your home to sit in-person
                      </span>
                      <span className="text-[10px] text-brand-cyan font-semibold block mt-1">Surcharge Applies</span>
                    </button>

                  </div>
                </div>

                {/* 4. Add-ons checkbox toggler */}
                <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <input
                    type="checkbox"
                    id="material_checkbox"
                    checked={isStudyMaterialIncluded}
                    onChange={(e) => setIsStudyMaterialIncluded(e.target.checked)}
                    className="w-4 h-4 text-brand-indigo rounded bg-slate-900 border-slate-800 focus:ring-brand-cyan cursor-pointer"
                  />
                  <div className="cursor-pointer select-none" onClick={() => setIsStudyMaterialIncluded(!isStudyMaterialIncluded)}>
                    <label htmlFor="material_checkbox" className="block text-xs font-bold text-slate-200 cursor-pointer">
                      Include Printed Study Notes, Solved Papers Book and Practice CD (+₹350)
                    </label>
                    <span className="text-[11px] text-slate-400 leading-none">
                      Includes comprehensive sample answer papers tailored as per standard NCERT/ICSE boards guidelines.
                    </span>
                  </div>
                </div>

              </div>

              {/* Fee Receipt Preview Right column */}
              <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Calculator className="w-5 h-5 text-brand-cyan" />
                    <h3 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider">
                      PLAN INVOICE SUMMARY
                    </h3>
                  </div>

                  {/* Course visual details */}
                  <div className="bg-slate-950 p-4 rounded-2xl space-y-1">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono">SELECTED FOCUS</span>
                    <span className="font-bold text-slate-100 text-xs">
                      {COURSES.find(c => c.id === estimatorCourseId)?.title}
                    </span>
                    <span className="text-[10px] bg-indigo-500/10 text-brand-indigo px-1.5 py-0.5 rounded border border-indigo-500/15 font-mono uppercase font-bold block w-fit mt-1">
                      {COURSES.find(c => c.id === estimatorCourseId)?.level} Level
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Proportional Base Tutoring fee</span>
                      <span className="font-mono text-slate-200 font-bold">₹{feeCalculation.base.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-400">
                      <span>Study Notes Pack + Lab CD</span>
                      <span className="font-mono text-slate-200">
                        {feeCalculation.material > 0 ? `₹${feeCalculation.material.toLocaleString()}` : "Excluded"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-400">
                      <span>Classroom System Infrastructure Charge</span>
                      <span className="font-mono text-slate-200">₹{feeCalculation.admin}</span>
                    </div>

                    {feeCalculation.discount > 0 && (
                      <div className="flex justify-between items-center text-emerald-400 bg-emerald-500/15 p-2 rounded">
                        <span>Digital Live Learning Scholarship</span>
                        <span className="font-mono font-bold">-₹{feeCalculation.discount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="border-t border-slate-800 pt-3 flex justify-between items-end">
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Cost per Month</span>
                        <span className="text-xs text-slate-400 block leading-tight">Everything included</span>
                      </div>
                      <span className="text-2xl font-extrabold text-white font-mono bg-gradient-to-r from-brand-cyan to-white bg-clip-text text-transparent">
                        ₹{feeCalculation.total.toLocaleString()}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Estimation call actions */}
                <div className="space-y-3.5 bg-slate-950 p-4 rounded-2xl border border-slate-900">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-brand-cyan" />
                    <span className="text-[11px] text-slate-400">
                      Prices are approximate & pay-as-you-go. No dynamic deposits needed. Upfront multi-month payments receive exclusive 10% reductions.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      prefillFromCourse(estimatorCourseId);
                    }}
                    className="w-full bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                  >
                     Lock Plans & Claim Enrollment Coupon
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* BATCH TIMINGS & LIVE SEAT COUNTER */}
        <section id="batches" className="py-20 bg-slate-950 border-b border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-3">
                <span className="font-mono text-brand-indigo text-xs tracking-widest font-extrabold uppercase">
                   REAL-TIME ENROLLMENT COUNTERS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white animate-fade-in">
                  Live Course Schedule & Active Seat Status
                </h2>
                <p className="text-slate-400 text-sm max-w-xl">
                  To maintain perfect teacher student ratios, our classroom system strictly seals boundaries to a maximum of 15 students per batch. Reserve quickly below to guarantee focus.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                <span className="text-xs font-mono text-slate-300">
                  Batch admissions close in 48 Hours
                </span>
              </div>
            </div>

            {/* Timetable schedule timeline card grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BATCHES.map((batch) => {
                const urgencyLevel = batch.seatsLeft <= 2 ? "high" : batch.seatsLeft <= 4 ? "medium" : "normal";
                return (
                  <div 
                    key={batch.id}
                    className={`bg-slate-900/60 rounded-2xl p-5 border transition duration-300 ${urgencyLevel === "high" ? "border-rose-500/30 hover:border-rose-500/50 hover:bg-slate-900/80" : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"}`}
                  >
                    <div className="space-y-4">
                      {/* Name of Course & icon */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-slate-100 text-base leading-snug">
                            {batch.courseTitle}
                          </h4>
                          <span className="text-[11px] text-slate-400 block mt-0.5">Educator: {batch.trainer}</span>
                        </div>
                        <span className="bg-slate-950 text-slate-400 font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                          ID: {batch.id}
                        </span>
                      </div>

                      {/* Schedule info row */}
                      <div className="bg-slate-950 p-3.5 rounded-xl space-y-2 font-mono text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-brand-cyan" />
                          <span>Days: <strong>{batch.days}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                          <span>Slot: <strong>{batch.timing}</strong></span>
                        </div>
                      </div>

                      {/* Visual gauge seat remaining tracker */}
                      <div className="space-y-1.5 border-t border-slate-800/80 pt-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold">Seat Occupancy</span>
                          <span className={`${urgencyLevel === "high" ? "text-rose-400 font-bold" : urgencyLevel === "medium" ? "text-amber-400" : "text-brand-cyan font-semibold"}`}>
                            {batch.seatsLeft} of {batch.seatsTotal} Seats Left
                          </span>
                        </div>
                        {/* Progress slider bar representation */}
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${urgencyLevel === "high" ? "bg-rose-500 animate-pulse" : urgencyLevel === "medium" ? "bg-amber-400" : "bg-brand-cyan"}`}
                            style={{ width: `${((batch.seatsTotal - batch.seatsLeft) / batch.seatsTotal) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">Individual PC Block assigned</span>
                        <button
                          type="button"
                          onClick={() => prefillFromBatch(batch)}
                          className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition cursor-pointer ${urgencyLevel === "high" ? "bg-rose-500 hover:bg-rose-400 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"}`}
                        >
                          Claim Seat {batch.id}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* THE ENROLLMENT & ADMISSION INQUIRY FORM */}
        <section id="apply" className="py-20 lg:py-28 relative bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column Description */}
              <div className="lg:col-span-4 space-y-6">
                <span className="font-mono text-brand-cyan text-xs tracking-widest font-extrabold uppercase">
                  MEMBER ADMISSION CENTER
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Secure Your Classroom Seat Today
                </h2>
                <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
                  Ready to upgrade your logic skills or top your school computer examinations? Complete our simple inquiry card. No dynamic pre-payments are needed. Our local tuition counselor will call you back to schedule a free 1-hour in-person lab practice slot.
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-indigo/10 text-brand-indigo p-2.5 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-brand-indigo" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-250">Academic Help Helpline</h4>
                      <p className="text-xs text-brand-cyan font-mono font-bold">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-brand-indigo/10 text-brand-indigo p-2.5 rounded-xl">
                      <Clock className="w-5 h-5 text-brand-indigo" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-250">Tuition Lab Timings</h4>
                      <p className="text-xs text-slate-400">Regular Days: 08:30 AM - 08:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Small Interactive map graphic styling representation */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase">
                    <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
                    Tuition Center Campus Location
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Computer Tuition Point, Suite 102 (First Floor), Crossing Chowk Commercial Market, Main Sector-4, Metro Pillar 102. Fully accessible with secured bike parking.
                  </p>
                </div>

              </div>

              {/* Central Admission Form */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative">
                
                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                  <BookOpen className="w-5 h-5 text-brand-cyan" />
                   Rapid Classroom Inquiry Sheet
                </h3>

                {/* Submition Alerts */}
                {inquiryStatusMsg && (
                  <div className={`p-4 rounded-xl flex items-start gap-3 border ${inquiryStatusMsg.type === "success" ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300" : "bg-rose-500/15 border-rose-400/30 text-rose-300"}`}>
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-medium leading-normal">{inquiryStatusMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Full Student Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sneha Roy"
                        className="w-full bg-slate-950 border border-slate-800 placeholder-slate-600 text-slate-200 px-4 py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-cyan transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Parents Contact Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 91234 56789"
                        className="w-full bg-slate-950 border border-slate-800 placeholder-slate-600 text-slate-200 px-4 py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-cyan transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. student@example.com"
                        className="w-full bg-slate-950 border border-slate-800 placeholder-slate-600 text-slate-200 px-4 py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-cyan transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Current Experience/Level
                      </label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-cyan transition cursor-pointer"
                      >
                        <option value="beginner">Beginner (Never coded before)</option>
                        <option value="school_student">School Board CS Student (Class 9-12)</option>
                        <option value="college_student">Undergraduate / College level CS</option>
                        <option value="professional">Working Professional seeking upgrade</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Target Course
                      </label>
                      <select
                        value={selectedInquiryCourse}
                        onChange={(e) => setSelectedInquiryCourse(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-cyan transition cursor-pointer"
                      >
                        {COURSES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Batch Availability Preference
                      </label>
                      <select
                        value={selectedBatchId}
                        onChange={(e) => setSelectedBatchId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-cyan transition cursor-pointer"
                      >
                        {BATCHES.map((b) => (
                          <option key={b.id} value={b.id}>
                            Batch {b.id}: {b.days} ({b.timing})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Your Query / Homework help or school requirements
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. I want to score good marks in my final pre-board exams or need 1-on-1 practical lab timing slot."
                      className="w-full bg-slate-950 border border-slate-800 placeholder-slate-600 text-slate-200 px-4 py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-cyan transition"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-brand-indigo to-brand-cyan hover:from-indigo-500 hover:to-cyan-400 text-slate-950 font-extrabold py-4 rounded-xl shadow-lg transition duration-300 uppercase tracking-wider text-xs md:text-sm cursor-pointer"
                    >
                      Submit In-Person Registration Request
                    </button>
                  </div>
                </form>

                {/* ACTIVE LIST OF REGISTERED APPLICATIONS (Real React State Showcase) */}
                {submittedInquiries.length > 0 && (
                  <div className="border-t border-slate-800 pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider">
                         YOUR ACTIVE ENROLLMENT INQUIRIES ({submittedInquiries.length})
                      </span>
                      <span className="text-[10px] text-slate-500">Stored Locally This Session</span>
                    </div>

                    <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                      {submittedInquiries.map((inq) => (
                        <div key={inq.id} className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 relative hover:border-slate-800 transition">
                          <button 
                            type="button"
                            onClick={() => handleDeleteInquiry(inq.id)} 
                            className="absolute right-3.5 top-3 text-slate-600 hover:text-slate-400 p-1 rounded hover:bg-slate-900 transition"
                            title="Remove Application Memo"
                          >
                            <X className="w-3.5 h-3.5 cursor-pointer" />
                          </button>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-brand-cyan font-bold">
                                {inq.id}
                              </span>
                              <h4 className="text-xs font-bold text-slate-100">
                                {inq.fullName}
                              </h4>
                              <span className="text-[10px] text-slate-500 italic">
                                ({inq.submittedAt})
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300">
                              🔖 {inq.selectedCourse}
                            </p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                              <span>Pref Schedule: {inq.batchPreference}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0 self-start sm:self-center pr-6">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
                              Counselor Assigned
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SLIDER SECTION */}
        <section className="py-20 bg-slate-950 border-y border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="font-mono text-brand-cyan text-xs tracking-widest font-bold uppercase">
                 STUDENT PORTOLIO CORNER
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Our Pro Alums Dominate Academics & Web
              </h2>
              <p className="text-slate-400 text-sm">
                Real feedback from school board exam toppers and working professionals trained from scratch at Computer Tuition Point.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  ★★★★★
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "Mrs Namita helped me dry-run nested Java objects for my school CS paper. I got 98/100 in board exams! Highly recommended for any school standard student struggling with computer theory codes."
                </p>
                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-100">Ritika Sen</span>
                    <span className="text-[10px] text-slate-500 block">Class 12 CBSE Board Score: 98</span>
                  </div>
                  <span className="bg-brand-indigo/10 text-brand-indigo px-2 py-0.5 rounded text-[9px] font-bold font-mono">ICSE Class 12</span>
                </div>
              </div>

              <div className="bg-slate-900/65 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  ★★★★★
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "Er Alok Sharma is a fantastic coding educator. He literally mapped loop variables step-by-step on the glass board until my logic clicked. Now I easily write complex Python scripts with tkinter."
                </p>
                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-100">Aditya Verma</span>
                    <span className="text-[10px] text-slate-500 block">Engineering Freshman</span>
                  </div>
                  <span className="bg-brand-indigo/10 text-brand-indigo px-2 py-0.5 rounded text-[9px] font-bold font-mono">Python Core</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  ★★★★★
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "The Advanced Excel modules helped me secure my office manager role at the tech firm. Knowing nested XLOOKUPs and Dynamic Pivot charts makes me twice as productive. The lab setup is premium."
                </p>
                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-100">Jaspreet Kaur</span>
                    <span className="text-[10px] text-slate-500 block">Office Operations Specialist</span>
                  </div>
                  <span className="bg-brand-indigo/10 text-brand-indigo px-2 py-0.5 rounded text-[9px] font-bold font-mono">Advanced Office</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* FAQs SECTION WITH ACCORDION HANDLERS */}
        <section id="faqs" className="py-20 bg-slate-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <span className="font-mono text-brand-indigo text-xs tracking-widest font-extrabold uppercase">
                 HAVE CONCERNS?
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Frequently Asked Common Questions
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Got questions regarding custom batch timings, fee installments, online makeup options, or computer specifications? Look below.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = expandedFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left px-6 py-4.5 flex items-center justify-between text-slate-100 hover:text-white hover:bg-slate-850/50 transition cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold tracking-tight pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-brand-cyan flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    {/* Collapsible content wrapper */}
                    {isOpen && (
                      <div className="px-6 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-850 pt-3.5 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="bg-brand-indigo/10 p-2 rounded-lg text-brand-indigo">
                <Laptop className="w-5 h-5 text-brand-indigo" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Computer Tuition Point
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              We deliver premium logic-oriented, hands-on classroom computer tuition classes enabling students to top school boards, build advanced programs, and conquer digital design algorithms.
            </p>
            <span className="text-[10px] text-slate-600 block font-mono">
               Registered Computer Training Center • Estd. 2018
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest text-brand-cyan">
              Admission Form Prefills
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button type="button" onClick={() => prefillFromCourse("python-logic")} className="hover:text-white transition">
                  Python Logic & GUI
                </button>
              </li>
              <li>
                <button type="button" onClick={() => prefillFromCourse("fullstack-webdev")} className="hover:text-white transition">
                  Fullstack Web Dev
                </button>
              </li>
              <li>
                <button type="button" onClick={() => prefillFromCourse("school-cs")} className="hover:text-white transition">
                  Class 11/12 school Board CS
                </button>
              </li>
              <li>
                <button type="button" onClick={() => prefillFromCourse("dsa-cpp-java")} className="hover:text-white transition">
                  DSA C++ & Java Code
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest text-brand-cyan">
               Tuition Campus Office
            </h4>
            <p className="text-slate-400 font-normal leading-normal">
              Suite 102, Sector 4 Crossing Chowk Market, (Pillar 102 Metro Station Road), Computer City.
            </p>
            <p className="font-mono text-[11px] text-slate-200">
               Call office: +91 98765 43210
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <span>
            © {new Date().getFullYear()} Computer Tuition Point App. All Rights Reserved. Code and concept tutorials are licensed strictly as per academic board guidelines.
          </span>
          <div className="flex gap-4">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-slate-300">
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
