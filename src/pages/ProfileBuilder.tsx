import { useState, useEffect } from "react";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Define User interface with all required properties
interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  institution?: string;
  graduationYear?: string;
  gpa?: string;
  gradingSystem?: string;
  educationLevel?: string;
  fieldOfStudy?: string;
  ieltsOverall?: string;
  ieltsListening?: string;
  ieltsReading?: string;
  ieltsWriting?: string;
  ieltsSpeaking?: string;
  toeflTotal?: string;
  greTotal?: string;
  gmatTotal?: string;
  workExperience?: string;
  internships?: string;
  projects?: string;
  certifications?: string;
  targetCountries?: string[];
  preferredPrograms?: string[];
  studyLevel?: string;
  intakePreference?: string;
  profileCompleted?: boolean;
}

interface FormData {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
  };
  academics: {
    educationLevel: string;
    fieldOfStudy: string;
    institution: string;
    graduationYear: string;
    gpa: string;
    gradingSystem: string;
  };
  testScores: {
    ieltsOverall: string;
    ieltsListening: string;
    ieltsReading: string;
    ieltsWriting: string;
    ieltsSpeaking: string;
    toeflTotal: string;
    greTotal: string;
    gmatTotal: string;
  };
  experience: {
    workExperience: string;
    internships: string;
    projects: string;
    certifications: string;
  };
  preferences: {
    targetCountries: string[];
    preferredPrograms: string[];
    studyLevel: string;
    intakePreference: string;
  };
}

interface LocalStorageData {
  formData: FormData;
  currentStep: number;
  completedSteps: number[];
  profileCompleted: boolean;
  lastUpdated: string;
}

export default function ProfileBuilder() {
  const {
    user,
    updateUserProfile,
    selectedCountry,
    setSelectedCountry,
    isCountryToggleDisabled,
  } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [wordCounts, setWordCounts] = useState({
    workExperience: 0,
    internships: 0,
    projects: 0,
    certifications: 0,
  });

  // Initialize formData with empty structure
  const getInitialFormData = (): FormData => ({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      nationality: "",
    },
    academics: {
      educationLevel: "",
      fieldOfStudy: "",
      institution: "",
      graduationYear: "",
      gpa: "",
      gradingSystem: "",
    },
    testScores: {
      ieltsOverall: "",
      ieltsListening: "",
      ieltsReading: "",
      ieltsWriting: "",
      ieltsSpeaking: "",
      toeflTotal: "",
      greTotal: "",
      gmatTotal: "",
    },
    experience: {
      workExperience: "",
      internships: "",
      projects: "",
      certifications: "",
    },
    preferences: {
      targetCountries: [],
      preferredPrograms: [],
      studyLevel: "",
      intakePreference: "",
    },
  });

  const [formData, setFormData] = useState<FormData>(getInitialFormData());

  // localStorage functions
  const saveToLocalStorage = (data: Partial<LocalStorageData>) => {
    try {
      const currentData = getFromLocalStorage();
      const updatedData = {
        ...currentData,
        ...data,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("profileBuilder_data", JSON.stringify(updatedData));
      console.log("ProfileBuilder: Data saved to localStorage");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const getFromLocalStorage = (): LocalStorageData => {
    try {
      const data = localStorage.getItem("profileBuilder_data");
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
    return {
      formData: getInitialFormData(),
      currentStep: 1,
      completedSteps: [],
      profileCompleted: false,
      lastUpdated: new Date().toISOString(),
    };
  };

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem("profileBuilder_data");
      console.log("ProfileBuilder: localStorage cleared");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  // Calculate profile completion percentage
  const calculateProgress = (data: FormData): number => {
    let totalFields = 0;
    let completedFields = 0;

    // Step 1: Personal (required: firstName, lastName, email)
    totalFields += 3;
    if (data.personal.firstName.trim()) completedFields++;
    if (data.personal.lastName.trim()) completedFields++;
    if (data.personal.email.trim()) completedFields++;

    // Step 2: Academics (required: educationLevel, institution, fieldOfStudy)
    totalFields += 3;
    if (data.academics.educationLevel) completedFields++;
    if (data.academics.institution.trim()) completedFields++;
    if (data.academics.fieldOfStudy.trim()) completedFields++;

    // Step 3: Test Scores (all optional, but count if any are provided)
    // No required fields, so no impact on completion

    // Step 4: Experience (all optional)
    // No required fields, so no impact on completion

    // Step 5: Preferences (all optional fields)
    // No required fields, so no impact on completion

    return Math.round((completedFields / totalFields) * 100);
  };

  // Check if profile is 100% complete
  const isProfileComplete = (data: FormData): boolean => {
    return calculateProgress(data) === 100;
  };

  // Get next incomplete step
  const getNextIncompleteStep = (data: FormData): number => {
    // Step 1 validation
    if (
      !data.personal.firstName.trim() ||
      !data.personal.lastName.trim() ||
      !data.personal.email.trim()
    ) {
      return 1;
    }

    // Step 2 validation
    if (
      !data.academics.educationLevel ||
      !data.academics.institution.trim() ||
      !data.academics.fieldOfStudy.trim()
    ) {
      return 2;
    }

    // Step 3 is optional, so skip to step 4
    // Step 4 is optional, so skip to step 5

    // Step 5 validation - now all fields are optional
    // No validation needed since all preference fields are optional

    // If all required steps are complete, show step 6 (completion screen)
    return 6;
  };

  // Count words in text
  const countWords = (text: string): number => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  // Generate graduation years from 1990 to 2025
  const generateGraduationYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1990; year--) {
      years.push(year.toString());
    }
    return years;
  };

  // Generate intake preferences for Germany and UK till 2030
  const generateIntakePreferences = () => {
    const intakes = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year <= 2027; year++) {
      // German intakes: Winter (October) and Summer (April)
      intakes.push(`Winter ${year} (Germany)`);
      intakes.push(`Summer ${year} (Germany)`);

      // UK intakes: September, January
      intakes.push(`September ${year} (UK)`);
      intakes.push(`January ${year + 1} (UK)`);
    }

    intakes.push("Flexible");
    return intakes;
  };

  // Process uploaded CV
  const processCVData = (file: File): Promise<Partial<FormData>> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const extractedData: Partial<FormData> = {
          personal: {},
          academics: {},
          testScores: {},
          experience: {},
          preferences: {},
        };

        // Simple text parsing logic (this is a basic implementation)
        // In a real application, you might want to use a proper NLP library or API
        const lines = text.toLowerCase().split("\n");

        // Helper function to extract field
        const extractField = (keywords: string[], defaultValue = "") => {
          for (const line of lines) {
            for (const keyword of keywords) {
              if (line.includes(keyword.toLowerCase())) {
                return (
                  line.replace(keyword.toLowerCase(), "").trim() || defaultValue
                );
              }
            }
          }
          return defaultValue;
        };

        // Extract personal information
        extractedData.personal!.firstName =
          extractField(["first name:", "name:"]).split(" ")[0] || "";
        extractedData.personal!.lastName =
          extractField(["last name:", "name:"]).split(" ").slice(1).join(" ") ||
          "";
        extractedData.personal!.email = extractField(["email:", "e-mail:"]);
        extractedData.personal!.phone = extractField([
          "phone:",
          "mobile:",
          "contact:",
        ]);
        extractedData.personal!.dateOfBirth = extractField([
          "date of birth:",
          "dob:",
          "born:",
        ]);
        extractedData.personal!.nationality = extractField([
          "nationality:",
          "citizenship:",
        ]);

        // Extract academic information
        extractedData.academics!.educationLevel = extractField([
          "education:",
          "degree:",
          "qualification:",
        ]);
        extractedData.academics!.institution = extractField([
          "university:",
          "institution:",
          "college:",
        ]);
        extractedData.academics!.fieldOfStudy = extractField([
          "field of study:",
          "major:",
          "program:",
        ]);
        extractedData.academics!.graduationYear = extractField([
          "graduation year:",
          "year of graduation:",
          "graduated:",
        ]);
        extractedData.academics!.gpa = extractField([
          "gpa:",
          "grade point average:",
          "grades:",
        ]);
        extractedData.academics!.gradingSystem = extractField([
          "grading system:",
          "scale:",
        ]);

        // Extract test scores
        extractedData.testScores!.ieltsOverall = extractField([
          "ielts overall:",
          "ielts:",
        ]);
        extractedData.testScores!.toeflTotal = extractField([
          "toefl:",
          "toefl total:",
        ]);
        extractedData.testScores!.greTotal = extractField([
          "gre:",
          "gre total:",
        ]);
        extractedData.testScores!.gmatTotal = extractField([
          "gmat:",
          "gmat total:",
        ]);

        // Extract experience
        extractedData.experience!.workExperience = extractField([
          "work experience:",
          "professional experience:",
        ]);
        extractedData.experience!.internships = extractField([
          "internships:",
          "internship:",
        ]);
        extractedData.experience!.projects = extractField([
          "projects:",
          "project:",
        ]);
        extractedData.experience!.certifications = extractField([
          "certifications:",
          "certificate:",
          "courses:",
        ]);

        // Extract preferences (less likely to be in CV, but included for completeness)
        extractedData.preferences!.studyLevel = extractField([
          "intended study level:",
          "program level:",
        ]);
        extractedData.preferences!.targetCountries = extractField([
          "target country:",
          "study destination:",
        ])
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c);
        extractedData.preferences!.preferredPrograms = extractField([
          "preferred programs:",
          "intended programs:",
        ])
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p);

        resolve(extractedData);
      };
      reader.readAsText(file);
    });
  };

  // Handle CV upload
  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type === "text/plain")
    ) {
      try {
        const extractedData = await processCVData(file);
        setFormData((prev) => ({
          personal: {
            ...prev.personal,
            ...extractedData.personal,
            firstName:
              extractedData.personal?.firstName || prev.personal.firstName,
            lastName:
              extractedData.personal?.lastName || prev.personal.lastName,
            email: extractedData.personal?.email || prev.personal.email,
            phone: extractedData.personal?.phone || prev.personal.phone,
            dateOfBirth:
              extractedData.personal?.dateOfBirth || prev.personal.dateOfBirth,
            nationality:
              extractedData.personal?.nationality || prev.personal.nationality,
          },
          academics: {
            ...prev.academics,
            ...extractedData.academics,
            educationLevel:
              extractedData.academics?.educationLevel ||
              prev.academics.educationLevel,
            fieldOfStudy:
              extractedData.academics?.fieldOfStudy ||
              prev.academics.fieldOfStudy,
            institution:
              extractedData.academics?.institution ||
              prev.academics.institution,
            graduationYear:
              extractedData.academics?.graduationYear ||
              prev.academics.graduationYear,
            gpa: extractedData.academics?.gpa || prev.academics.gpa,
            gradingSystem:
              extractedData.academics?.gradingSystem ||
              prev.academics.gradingSystem,
          },
          testScores: {
            ...prev.testScores,
            ...extractedData.testScores,
            ieltsOverall:
              extractedData.testScores?.ieltsOverall ||
              prev.testScores.ieltsOverall,
            ieltsListening:
              extractedData.testScores?.ieltsListening ||
              prev.testScores.ieltsListening,
            ieltsReading:
              extractedData.testScores?.ieltsReading ||
              prev.testScores.ieltsReading,
            ieltsWriting:
              extractedData.testScores?.ieltsWriting ||
              prev.testScores.ieltsWriting,
            ieltsSpeaking:
              extractedData.testScores?.ieltsSpeaking ||
              prev.testScores.ieltsSpeaking,
            toeflTotal:
              extractedData.testScores?.toeflTotal ||
              prev.testScores.toeflTotal,
            greTotal:
              extractedData.testScores?.greTotal || prev.testScores.greTotal,
            gmatTotal:
              extractedData.testScores?.gmatTotal || prev.testScores.gmatTotal,
          },
          experience: {
            ...prev.experience,
            ...extractedData.experience,
            workExperience:
              extractedData.experience?.workExperience ||
              prev.experience.workExperience,
            internships:
              extractedData.experience?.internships ||
              prev.experience.internships,
            projects:
              extractedData.experience?.projects || prev.experience.projects,
            certifications:
              extractedData.experience?.certifications ||
              prev.experience.certifications,
          },
          preferences: {
            ...prev.preferences,
            ...extractedData.preferences,
            targetCountries:
              extractedData.preferences?.targetCountries ||
              prev.preferences.targetCountries,
            preferredPrograms:
              extractedData.preferences?.preferredPrograms ||
              prev.preferences.preferredPrograms,
            studyLevel:
              extractedData.preferences?.studyLevel ||
              prev.preferences.studyLevel,
            intakePreference:
              extractedData.preferences?.intakePreference ||
              prev.preferences.intakePreference,
          },
        }));

        // Update word counts for experience fields
        setWordCounts({
          workExperience: countWords(
            extractedData.experience?.workExperience ||
              formData.experience.workExperience
          ),
          internships: countWords(
            extractedData.experience?.internships ||
              formData.experience.internships
          ),
          projects: countWords(
            extractedData.experience?.projects || formData.experience.projects
          ),
          certifications: countWords(
            extractedData.experience?.certifications ||
              formData.experience.certifications
          ),
        });

        console.log("ProfileBuilder: CV data processed and form updated");
      } catch (error) {
        console.error("Error processing CV:", error);
        setErrors((prev) => ({
          ...prev,
          cvUpload: "Failed to process CV. Please try again.",
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        cvUpload: "Please upload a valid PDF or text file.",
      }));
    }
  };

  // Initialize component with localStorage data
  useEffect(() => {
    console.log("ProfileBuilder: Initializing component");

    if (user) {
      const savedData = getFromLocalStorage();

      // Merge user data with saved localStorage data
      const mergedFormData: FormData = {
        personal: {
          firstName:
            savedData.formData.personal.firstName ||
            (user as User).firstName ||
            "",
          lastName:
            savedData.formData.personal.lastName ||
            (user as User).lastName ||
            "",
          email:
            savedData.formData.personal.email || (user as User).email || "",
          phone:
            savedData.formData.personal.phone || (user as User).phone || "",
          dateOfBirth:
            savedData.formData.personal.dateOfBirth ||
            (user as User).dateOfBirth ||
            "",
          nationality:
            savedData.formData.personal.nationality ||
            (user as User).nationality ||
            "",
        },
        academics: {
          educationLevel:
            savedData.formData.academics.educationLevel ||
            (user as User).educationLevel ||
            "",
          fieldOfStudy:
            savedData.formData.academics.fieldOfStudy ||
            (user as User).fieldOfStudy ||
            "",
          institution:
            savedData.formData.academics.institution ||
            (user as User).institution ||
            "",
          graduationYear:
            savedData.formData.academics.graduationYear ||
            (user as User).graduationYear ||
            "",
          gpa: savedData.formData.academics.gpa || (user as User).gpa || "",
          gradingSystem:
            savedData.formData.academics.gradingSystem ||
            (user as User).gradingSystem ||
            "",
        },
        testScores: {
          ieltsOverall:
            savedData.formData.testScores.ieltsOverall ||
            (user as User).ieltsOverall ||
            "",
          ieltsListening:
            savedData.formData.testScores.ieltsListening ||
            (user as User).ieltsListening ||
            "",
          ieltsReading:
            savedData.formData.testScores.ieltsReading ||
            (user as User).ieltsReading ||
            "",
          ieltsWriting:
            savedData.formData.testScores.ieltsWriting ||
            (user as User).ieltsWriting ||
            "",
          ieltsSpeaking:
            savedData.formData.testScores.ieltsSpeaking ||
            (user as User).ieltsSpeaking ||
            "",
          toeflTotal:
            savedData.formData.testScores.toeflTotal ||
            (user as User).toeflTotal ||
            "",
          greTotal:
            savedData.formData.testScores.greTotal ||
            (user as User).greTotal ||
            "",
          gmatTotal:
            savedData.formData.testScores.gmatTotal ||
            (user as User).gmatTotal ||
            "",
        },
        experience: {
          workExperience:
            savedData.formData.experience.workExperience ||
            (user as User).workExperience ||
            "",
          internships:
            savedData.formData.experience.internships ||
            (user as User).internships ||
            "",
          projects:
            savedData.formData.experience.projects ||
            (user as User).projects ||
            "",
          certifications:
            savedData.formData.experience.certifications ||
            (user as User).certifications ||
            "",
        },
        preferences: {
          targetCountries:
            savedData.formData.preferences.targetCountries ||
            (user as User).targetCountries ||
            [],
          preferredPrograms:
            savedData.formData.preferences.preferredPrograms ||
            (user as User).preferredPrograms ||
            [],
          studyLevel:
            savedData.formData.preferences.studyLevel ||
            (user as User).studyLevel ||
            "",
          intakePreference:
            savedData.formData.preferences.intakePreference ||
            (user as User).intakePreference ||
            "",
        },
      };

      setFormData(mergedFormData);

      // Update word counts
      setWordCounts({
        workExperience: countWords(mergedFormData.experience.workExperience),
        internships: countWords(mergedFormData.experience.internships),
        projects: countWords(mergedFormData.experience.projects),
        certifications: countWords(mergedFormData.experience.certifications),
      });

      // Set current step based on profile completion
      if (isProfileComplete(mergedFormData)) {
        setCurrentStep(6); // Show completion screen
        setCompletedSteps([1, 2, 3, 4, 5]);
      } else {
        const nextIncompleteStep = getNextIncompleteStep(mergedFormData);
        setCurrentStep(savedData.currentStep || nextIncompleteStep);
        setCompletedSteps(savedData.completedSteps || []);
      }

      console.log("ProfileBuilder: Form data initialized:", mergedFormData);
      console.log("ProfileBuilder: Current step set to:", currentStep);
    }
  }, [user]);

  // Auto-save to localStorage when formData changes
  useEffect(() => {
    if (user && formData) {
      saveToLocalStorage({
        formData,
        currentStep,
        completedSteps,
        profileCompleted: isProfileComplete(formData),
      });
    }
  }, [formData, currentStep, completedSteps, user]);

  const steps = [
    { id: 1, title: "Personal Info" },
    { id: 2, title: "Academic Background" },
    { id: 3, title: "Test Scores" },
    { id: 4, title: "Experience" },
    { id: 5, title: "Preferences" },
    { id: 6, title: "Review" },
  ];

  const progress = calculateProgress(formData);

  // Validation functions
  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone.trim()) return true; // Optional field
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateNumericInput = (
    value: string,
    min?: number,
    max?: number
  ): boolean => {
    if (value === "") return true; // Allow empty values
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    if (min !== undefined && numValue < min) return false;
    if (max !== undefined && numValue > max) return false;
    return true;
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (currentStep) {
      case 1: // Personal Info
        if (!formData.personal.firstName.trim()) {
          newErrors.firstName = "First name is required";
        }
        if (!formData.personal.lastName.trim()) {
          newErrors.lastName = "Last name is required";
        }
        if (!formData.personal.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!validateEmail(formData.personal.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        // Phone, date of birth, and nationality are optional
        if (
          formData.personal.phone &&
          !validatePhoneNumber(formData.personal.phone)
        ) {
          newErrors.phone = "Please enter a valid phone number";
        }
        break;

      case 2: // Academic Background
        if (!formData.academics.educationLevel) {
          newErrors.educationLevel = "Highest qualification is required";
        }
        if (!formData.academics.institution.trim()) {
          newErrors.institution = "Institution name is required";
        }
        if (!formData.academics.fieldOfStudy.trim()) {
          newErrors.fieldOfStudy = "Field of study is required";
        }
        // GPA and graduation year are optional
        if (
          formData.academics.gpa &&
          !validateNumericInput(formData.academics.gpa, 0, 10)
        ) {
          newErrors.gpa = "Please enter a valid GPA (0-10)";
        }
        break;

      case 3: // Test Scores - Optional but must be valid if provided
        if (
          formData.testScores.ieltsOverall &&
          !validateNumericInput(formData.testScores.ieltsOverall, 0, 9)
        ) {
          newErrors.ieltsOverall = "IELTS score must be between 0-9";
        }
        if (
          formData.testScores.toeflTotal &&
          !validateNumericInput(formData.testScores.toeflTotal, 0, 100)
        ) {
          newErrors.toeflTotal = "TOEFL score must be between 0-100";
        }
        if (
          formData.testScores.greTotal &&
          !validateNumericInput(formData.testScores.greTotal, 0, 345)
        ) {
          newErrors.greTotal = "GRE score must be between 0-345";
        }
        if (
          formData.testScores.gmatTotal &&
          !validateNumericInput(formData.testScores.gmatTotal, 0, 650)
        ) {
          newErrors.gmatTotal = "GMAT score must be between 0-650";
        }
        break;

      case 4: // Experience - Optional but check word limits
        if (wordCounts.workExperience > 300) {
          newErrors.workExperience =
            "Work experience must be 300 words or less";
        }
        if (wordCounts.internships > 300) {
          newErrors.internships = "Internships must be 300 words or less";
        }
        if (wordCounts.projects > 300) {
          newErrors.projects = "Projects must be 300 words or less";
        }
        if (wordCounts.certifications > 300) {
          newErrors.certifications = "Certifications must be 300 words or less";
        }
        break;

      case 5: // Preferences - Make fields optional
        // All preference fields are now optional - users can complete their profile without filling these
        if (formData.preferences.targetCountries.length > 1) {
          newErrors.targetCountries = "Please select only one target country";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

<<<<<<< Updated upstream
=======
  // Handle target country changes and update global country state
  const handleTargetCountryChange = (targetCountries: string[]) => {
    if (targetCountries.length === 1) {
      const selectedCountry = targetCountries[0];
      if (selectedCountry === "Germany") {
        setSelectedCountry("DE");
      } else if (selectedCountry === "United Kingdom") {
        setSelectedCountry("UK");
      }
      // Also update the user profile immediately for better UX
      updateUserProfile({ targetCountries }).catch((error) => {
        console.error("Error updating target countries:", error);
      });
    }
    // If "Both" is selected or multiple countries, the country toggle remains enabled
  };

>>>>>>> Stashed changes
  const handleInputChange = (
    section: keyof FormData,
    field: string,
    value: any
  ) => {
    // Handle specific validations
    if (field === "phone") {
      // Only allow numbers, spaces, hyphens, parentheses, and plus sign
      value = value.replace(/[^0-9\s\-\(\)\+]/g, "");
    } else if (
      field === "gpa" ||
      field.includes("ielts") ||
      field.includes("toefl") ||
      field.includes("gre") ||
      field.includes("gmat")
    ) {
      // Only allow numbers and decimal points for numeric fields
      value = value.replace(/[^0-9\.]/g, "");
      // Ensure only one decimal point
      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }
    }

    // Handle target country changes
    if (field === "targetCountries" && section === "preferences") {
      handleTargetCountryChange(value);
    }

    // Update word count for experience fields
    if (
      section === "experience" &&
      ["workExperience", "internships", "projects", "certifications"].includes(
        field
      )
    ) {
      const wordCount = countWords(value);
      setWordCounts((prev) => ({
        ...prev,
        [field]: wordCount,
      }));

      // Prevent typing if word limit exceeded
      if (wordCount > 300) {
        return; // Don't update if exceeding word limit
      }
    }

    setFormData((prev) => {
      const currentSection = prev[section];
      if (!currentSection) {
        console.error(`Section ${section} does not exist in formData`);
        return prev;
      }

      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value,
        },
      };
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const completeProfile = async () => {
    if (!validateCurrentStep()) {
      console.log("Validation failed");
      return;
    }

    setIsSaving(true);
    try {
      const profileData = {
        firstName: formData.personal.firstName || "",
        lastName: formData.personal.lastName || "",
        name: `${formData.personal.firstName || ""} ${
          formData.personal.lastName || ""
        }`.trim(),
        phone: formData.personal.phone || "",
        dateOfBirth: formData.personal.dateOfBirth || "",
        nationality: formData.personal.nationality || "",
        educationLevel: formData.academics.educationLevel || "",
        fieldOfStudy: formData.academics.fieldOfStudy || "",
        institution: formData.academics.institution || "",
        graduationYear: formData.academics.graduationYear || "",
        gpa: formData.academics.gpa || "",
        gradingSystem: formData.academics.gradingSystem || "",
        targetCountries: formData.preferences.targetCountries || [],
        preferredPrograms: formData.preferences.preferredPrograms || [],
        studyLevel: formData.preferences.studyLevel || "",
        intakePreference: formData.preferences.intakePreference || "",
        // Test scores
        ieltsOverall: formData.testScores.ieltsOverall || "",
        ieltsListening: formData.testScores.ieltsListening || "",
        ieltsReading: formData.testScores.ieltsReading || "",
        ieltsWriting: formData.testScores.ieltsWriting || "",
        ieltsSpeaking: formData.testScores.ieltsSpeaking || "",
        toeflTotal: formData.testScores.toeflTotal || "",
        greTotal: formData.testScores.greTotal || "",
        gmatTotal: formData.testScores.gmatTotal || "",
        // Experience
        workExperience: formData.experience.workExperience || "",
        internships: formData.experience.internships || "",
        projects: formData.experience.projects || "",
        certifications: formData.experience.certifications || "",
        // Mark profile as complete
        profileCompleted: true,
      };

      await updateUserProfile(profileData);

      // Update global country state after successful profile save
      handleTargetCountryChange(formData.preferences.targetCountries);

      clearLocalStorage();
      console.log("ProfileBuilder: Profile completed successfully");
      setCurrentStep(6); // Go to review step
      setCompletedSteps([1, 2, 3, 4, 5]);
    } catch (error) {
      console.error("Error completing profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length) {
      const newCompletedSteps = [...completedSteps];
      if (!newCompletedSteps.includes(currentStep)) {
        newCompletedSteps.push(currentStep);
      }
      setCompletedSteps(newCompletedSteps);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderError = (fieldName: string) => {
    if (errors[fieldName]) {
      return <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>;
    }
    return null;
  };

  const renderWordCounter = (fieldName: keyof typeof wordCounts) => {
    const count = wordCounts[fieldName];
    const isOverLimit = count > 300;
    return (
      <p
        className={`text-xs mt-1 ${
          isOverLimit ? "text-red-500" : "text-muted-foreground"
        }`}>
        {count}/300 words
      </p>
    );
  };

  const renderStepContent = () => {
    // Safety check to ensure formData is properly structured
    if (
      !formData ||
      !formData.personal ||
      !formData.academics ||
      !formData.testScores ||
      !formData.experience ||
      !formData.preferences
    ) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading form data...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}>
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload CV/Resume
              </label>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleCVUpload}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload a PDF or text file to auto-fill your profile details
              </p>
              {renderError("cvUpload")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  placeholder="Alex"
                  value={formData.personal.firstName}
                  onChange={(e) =>
                    handleInputChange("personal", "firstName", e.target.value)
                  }
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.firstName ? "border-red-500" : "border-border"
                  }`}
                />
                {renderError("firstName")}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="Johnson"
                  value={formData.personal.lastName}
                  onChange={(e) =>
                    handleInputChange("personal", "lastName", e.target.value)
                  }
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.lastName ? "border-red-500" : "border-border"
                  }`}
                />
                {renderError("lastName")}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="alex.johnson@email.com"
                value={formData.personal.email}
                onChange={(e) =>
                  handleInputChange("personal", "email", e.target.value)
                }
                className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? "border-red-500" : "border-border"
                }`}
              />
              {renderError("email")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.personal.phone}
                  onChange={(e) =>
                    handleInputChange("personal", "phone", e.target.value)
                  }
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.phone ? "border-red-500" : "border-border"
                  }`}
                />
                {renderError("phone")}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.personal.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("personal", "dateOfBirth", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nationality
              </label>
              <select
                value={formData.personal.nationality}
                onChange={(e) =>
                  handleInputChange("personal", "nationality", e.target.value)
                }
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Select your nationality</option>
                <option value="United States">United States</option>
                <option value="India">India</option>
                <option value="China">China</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}>
            <div>
              <label className="block text-sm font-medium mb-2">
                Highest Qualification *
              </label>
              <select
                value={formData.academics.educationLevel}
                onChange={(e) =>
                  handleInputChange(
                    "academics",
                    "educationLevel",
                    e.target.value
                  )
                }
                className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.educationLevel ? "border-red-500" : "border-border"
                }`}>
                <option value="">Select qualification</option>
                <option value="High School Diploma">High School Diploma</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
              {renderError("educationLevel")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Institution Name *
                </label>
                <input
                  type="text"
                  placeholder="University of California, Berkeley"
                  value={formData.academics.institution}
                  onChange={(e) =>
                    handleInputChange(
                      "academics",
                      "institution",
                      e.target.value
                    )
                  }
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.institution ? "border-red-500" : "border-border"
                  }`}
                />
                {renderError("institution")}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Field of Study *
                </label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  value={formData.academics.fieldOfStudy}
                  onChange={(e) =>
                    handleInputChange(
                      "academics",
                      "fieldOfStudy",
                      e.target.value
                    )
                  }
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.fieldOfStudy ? "border-red-500" : "border-border"
                  }`}
                />
                {renderError("fieldOfStudy")}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Graduation Year
                </label>
                <select
                  value={formData.academics.graduationYear}
                  onChange={(e) =>
                    handleInputChange(
                      "academics",
                      "graduationYear",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select year</option>
                  {generateGraduationYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  GPA/Grade
                </label>
                <input
                  type="text"
                  placeholder="3.8"
                  value={formData.academics.gpa}
                  onChange={(e) =>
                    handleInputChange("academics", "gpa", e.target.value)
                  }
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.gpa ? "border-red-500" : "border-border"
                  }`}
                />
                {renderError("gpa")}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Grading System
                </label>
                <select
                  value={formData.academics.gradingSystem}
                  onChange={(e) =>
                    handleInputChange(
                      "academics",
                      "gradingSystem",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select system</option>
                  <option value="4.0 Scale">4.0 Scale</option>
                  <option value="10.0 Scale">10.0 Scale</option>
                  <option value="Percentage">Percentage</option>
                  <option value="First Class/Second Class">
                    First Class/Second Class
                  </option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">IELTS Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Overall Band
                  </label>
                  <input
                    type="text"
                    placeholder="7.5"
                    value={formData.testScores.ieltsOverall}
                    onChange={(e) =>
                      handleInputChange(
                        "testScores",
                        "ieltsOverall",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.ieltsOverall ? "border-red-500" : "border-border"
                    }`}
                  />
                  {renderError("ieltsOverall")}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Listening
                  </label>
                  <input
                    type="text"
                    placeholder="8.0"
                    value={formData.testScores.ieltsListening}
                    onChange={(e) =>
                      handleInputChange(
                        "testScores",
                        "ieltsListening",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reading
                  </label>
                  <input
                    type="text"
                    placeholder="7.5"
                    value={formData.testScores.ieltsReading}
                    onChange={(e) =>
                      handleInputChange(
                        "testScores",
                        "ieltsReading",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Writing
                  </label>
                  <input
                    type="text"
                    placeholder="7.0"
                    value={formData.testScores.ieltsWriting}
                    onChange={(e) =>
                      handleInputChange(
                        "testScores",
                        "ieltsWriting",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Speaking
                  </label>
                  <input
                    type="text"
                    placeholder="7.5"
                    value={formData.testScores.ieltsSpeaking}
                    onChange={(e) =>
                      handleInputChange(
                        "testScores",
                        "ieltsSpeaking",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Other Test Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    TOEFL Total (0-100)
                  </label>
                  <input
                    type="text"
                    placeholder="100"
                    value={formData.testScores.toeflTotal}
                    onChange={(e) =>
                      handleInputChange(
                        "testScores",
                        "toeflTotal",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.toeflTotal ? "border-red-500" : "border-border"
                    }`}
                  />
                  {renderError("toeflTotal")}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    GRE Total (0-345)
                  </label>
                  <input
                    type="text"
                    placeholder="320"
                    value={formData.testScores.greTotal}
                    onChange={(e) =>
                      handleInputChange(
                        "testScores",
                        "greTotal",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.greTotal ? "border-red-500" : "border-border"
                    }`}
                  />
                  {renderError("greTotal")}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    GMAT Total (0-650)
                  </label>
                  <input
                    type="text"
                    placeholder="650"
                    value={formData.testScores.gmatTotal}
                    onChange={(e) =>
                      handleInputChange(
                        "testScores",
                        "gmatTotal",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.gmatTotal ? "border-red-500" : "border-border"
                    }`}
                  />
                  {renderError("gmatTotal")}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}>
            <div>
              <label className="block text-sm font-medium mb-2">
                Work Experience
              </label>
              <select
                value={formData.experience.workExperience}
                onChange={(e) =>
                  handleInputChange(
                    "experience",
                    "workExperience",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Select years of experience</option>
                <option value="0 years">0 years</option>
                <option value="1 year">1 year</option>
                <option value="2 years">2 years</option>
                <option value="3 years">3 years</option>
                <option value="4 years">4 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Internships
              </label>
              <textarea
                rows={4}
                placeholder="List your internships and key achievements..."
                value={formData.experience.internships}
                onChange={(e) =>
                  handleInputChange("experience", "internships", e.target.value)
                }
                className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.internships ? "border-red-500" : "border-border"
                }`}
              />
              {renderWordCounter("internships")}
              {renderError("internships")}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Projects</label>
              <textarea
                rows={4}
                placeholder="Describe your academic and personal projects..."
                value={formData.experience.projects}
                onChange={(e) =>
                  handleInputChange("experience", "projects", e.target.value)
                }
                className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.projects ? "border-red-500" : "border-border"
                }`}
              />
              {renderWordCounter("projects")}
              {renderError("projects")}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Certifications
              </label>
              <textarea
                rows={3}
                placeholder="List your professional certifications and courses..."
                value={formData.experience.certifications}
                onChange={(e) =>
                  handleInputChange(
                    "experience",
                    "certifications",
                    e.target.value
                  )
                }
                className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.certifications ? "border-red-500" : "border-border"
                }`}
              />
              {renderWordCounter("certifications")}
              {renderError("certifications")}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Study Level
                </label>
                <select
                  value={formData.preferences.studyLevel}
                  onChange={(e) =>
                    handleInputChange(
                      "preferences",
                      "studyLevel",
                      e.target.value
                    )
                  }
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.studyLevel ? "border-red-500" : "border-border"
                  }`}>
                  <option value="">Select study level</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                </select>
                {renderError("studyLevel")}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Intake Preference
                </label>
                <select
                  value={formData.preferences.intakePreference}
                  onChange={(e) =>
                    handleInputChange(
                      "preferences",
                      "intakePreference",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select intake</option>
                  {generateIntakePreferences().map((intake) => (
                    <option key={intake} value={intake}>
                      {intake}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Target Country
              </label>
              <p className="text-sm text-muted-foreground mb-3">
                Please select your target country (optional)
              </p>
<<<<<<< Updated upstream
=======
              {formData.preferences.targetCountries.length === 1 &&
                formData.preferences.targetCountries[0] !== "Both" && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> Selecting a specific country will
                      lock the country toggle in your navigation bar to that
                      country.
                    </p>
                  </div>
                )}
>>>>>>> Stashed changes
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Germany", "United Kingdom", "Both"].map((country) => (
                  <label key={country} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="targetCountry"
                      checked={formData.preferences.targetCountries.includes(
                        country
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange("preferences", "targetCountries", [
                            country,
                          ]);
                        }
                      }}
                      className="rounded border-border focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm">{country}</span>
                  </label>
                ))}
              </div>
              {renderError("targetCountries")}
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}>
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Profile Complete!</h2>
              <p className="text-muted-foreground mb-8">
                Congratulations! Your profile is now 100% complete and ready for
                university applications.
              </p>

              {/* Achievement */}
              <div className="glass rounded-2xl p-6 bg-gradient-to-r from-primary/5 to-success/5 mb-8">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-4xl">🎓</div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Achievement Unlocked!
                    </h3>
                    <p className="text-muted-foreground">
                      Profile Master - Complete your profile 100%
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  clearLocalStorage();
                  navigate("/dashboard");
                }}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl hover-lift press-effect font-medium text-lg">
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}>
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">
                Step {currentStep} Content
              </h3>
              <p className="text-muted-foreground">
                This step is under construction. Please continue to see the
                complete flow.
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>
          <h1 className="text-4xl font-bold mb-3">Complete Your Profile</h1>
          <p className="text-xl text-muted-foreground">
            Let's get to know you better to provide personalized recommendations
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}>
          <div className="flex items-center justify-between mb-6">
            <span className="text-base font-semibold text-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-base font-medium text-muted-foreground">
              {progress}% Complete
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-4 mb-12 shadow-inner">
            <motion.div
              className="bg-primary h-4 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Step Indicators */}
          <div className="grid grid-cols-6 gap-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center text-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 shadow-md ${
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                      : completedSteps.includes(step.id)
                      ? "bg-success text-success-foreground shadow-success/25"
                      : "bg-muted text-muted-foreground border-2 border-border"
                  }`}>
                  {completedSteps.includes(step.id) ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <span className="font-semibold text-lg">{step.id}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <h4
                    className={`text-sm font-semibold leading-tight ${
                      currentStep === step.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}>
                    {step.title}
                  </h4>
<<<<<<< Updated upstream
                  <p className="text-xs text-muted-foreground leading-relaxed px-1">
                    {step.description}
                  </p>
=======
>>>>>>> Stashed changes
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          className="glass rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}>
          <h2 className="text-2xl font-semibold mb-6">
            {steps[currentStep - 1].title}
          </h2>

          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-180 ${
              currentStep === 1
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-card border border-border hover:bg-card-hover hover-lift press-effect"
            }`}>
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>

          <div className="flex gap-3">
            <button
              onClick={
                currentStep === 5
                  ? completeProfile
                  : currentStep === 6
                  ? () => {
                      clearLocalStorage();
                      navigate("/dashboard");
                    }
                  : nextStep
              }
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-180 ${
                isSaving
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover-lift press-effect"
              }`}>
              {isSaving
                ? "Saving..."
                : currentStep === 5
                ? "Complete Profile"
                : currentStep === 6
                ? "Go to Dashboard"
                : "Next"}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
