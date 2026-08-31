import React, { useEffect, useRef, useState } from 'react';
import { usePlaceWell } from '../context/PlaceWellContext';
import {
  ExperienceType,
  ExperienceResult,
  RoundType,
  QuestionType,
  ExperienceStatus,
} from '../types/database';
import { ResultBadge, DifficultyStars, RoundTypeBadge } from '../components/ui/Badges';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  ShieldCheck,
  Building2,
  Clock,
  HelpCircle,
  BookOpen,
  Sparkles,
  Share2
} from 'lucide-react';

interface RoundFormState {
  round_number: number;
  round_type: RoundType;
  duration_minutes: number;
  description_text: string;
  difficulty_rating: number;
  platform_used: string;
  notes: string;
  topic_id: number;
  questions: {
    question_text: string;
    question_type: QuestionType;
    topic_id: number;
    difficulty: number;
    reference_link: string;
  }[];
}

interface ResourceFormState {
  title: string;
  url: string;
  skill_id?: number;
}

interface SelectOption {
  value: string | number;
  label: string;
  meta?: string;
}

const useOutsideClick = <T extends HTMLElement>(isOpen: boolean, onClose: () => void) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, onClose]);

  return ref;
};

const SearchableSelect: React.FC<{
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  className?: string;
}> = ({ value, onChange, options, placeholder = 'Select an option', searchable = false, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useOutsideClick<HTMLDivElement>(isOpen, () => setIsOpen(false));

  const selectedOption = options.find((option) => String(option.value) === String(value));

  const filteredOptions = searchable
    ? options.filter((option) => {
        const searchText = `${option.label} ${option.meta ?? ''}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      })
    : options;

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-left text-xs font-semibold text-slate-900 dark:text-white shadow-sm transition-all hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900/95 text-white shadow-2xl shadow-slate-950/50 backdrop-blur-sm transition-all duration-200 ease-out ${
          isOpen
            ? 'pointer-events-auto max-h-80 opacity-100 translate-y-0'
            : 'pointer-events-none max-h-0 translate-y-1 opacity-0 border-transparent'
        }`}
      >
        {searchable && (
          <div className="border-b border-slate-700 p-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
            />
          </div>
        )}

        <div className="max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = String(option.value) === String(value);
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-brand-600/20 text-brand-300'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {option.meta && <span className="text-[10px] text-slate-400">{option.meta}</span>}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-3 text-xs text-slate-400">No matching option found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SubmitExperiencePage: React.FC<{
  onNavigate: (page: string, params?: any) => void;
  editExperienceId?: number;
}> = ({ onNavigate, editExperienceId }) => {
  const { db, currentUser, submitExperience, updateExperience } = usePlaceWell();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdExpId, setCreatedExpId] = useState<number | null>(null);

  // Step 1: Basic Experience
  const [companyId, setCompanyId] = useState<number>(1);
  const [roleTitle, setRoleTitle] = useState('');
  const [experienceType, setExperienceType] = useState<ExperienceType>('internship');
  const [year, setYear] = useState<number>(2025);
  const [result, setResult] = useState<ExperienceResult>('selected');
  const [overallDifficulty, setOverallDifficulty] = useState<number>(3);
  const [ctcOrStipend, setCtcOrStipend] = useState('');
  const [summaryText, setSummaryText] = useState('');

  // Step 2 & 3: Rounds and Questions
  const [rounds, setRounds] = useState<RoundFormState[]>([
    {
      round_number: 1,
      round_type: 'Tech',
      duration_minutes: 60,
      description_text: '',
      difficulty_rating: 3,
      platform_used: '',
      notes: '',
      topic_id: 1,
      questions: [],
    },
  ]);

  // Step 4: Resources
  const [resources, setResources] = useState<ResourceFormState[]>([]);

  // Step 5: Privacy
  const [isAnonymousPublic, setIsAnonymousPublic] = useState(true);
  const [isDataAccurate, setIsDataAccurate] = useState(false);

  // Helpers to add/remove rounds
  const addRound = () => {
    const nextNum = rounds.length + 1;
    setRounds([
      ...rounds,
      {
        round_number: nextNum,
        round_type: 'Tech',
        duration_minutes: 60,
        description_text: '',
        difficulty_rating: 3,
        platform_used: '',
        notes: '',
        topic_id: 1,
        questions: [],
      },
    ]);
  };

  const removeRound = (index: number) => {
    if (rounds.length <= 1) return;
    const updated = rounds.filter((_, i) => i !== index).map((r, i) => ({ ...r, round_number: i + 1 }));
    setRounds(updated);
  };

  // Add question to round
  const addQuestion = (roundIndex: number) => {
    const updated = [...rounds];
    updated[roundIndex].questions.push({
      question_text: '',
      question_type: 'coding',
      topic_id: 1,
      difficulty: 3,
      reference_link: '',
    });
    setRounds(updated);
  };

  const removeQuestion = (roundIndex: number, qIndex: number) => {
    const updated = [...rounds];
    updated[roundIndex].questions = updated[roundIndex].questions.filter((_, i) => i !== qIndex);
    setRounds(updated);
  };

  // Add resource
  const addResource = () => {
    setResources([...resources, { title: '', url: '', skill_id: 1 }]);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!editExperienceId) return;

    const experience = db.interview_experiences.find((exp) => exp.experience_id === editExperienceId);
    if (!experience) return;

    setCompanyId(experience.company_id);
    setRoleTitle(experience.role_title);
    setExperienceType(experience.experience_type);
    setYear(experience.year);
    setResult(experience.result);
    setOverallDifficulty(experience.overall_difficulty);
    setCtcOrStipend(experience.ctc_or_stipend || '');
    setSummaryText(experience.summary_text);
    setIsAnonymousPublic(experience.is_anonymous_public);

    const existingRounds = db.rounds
      .filter((round) => round.experience_id === editExperienceId)
      .sort((a, b) => a.round_number - b.round_number)
      .map((round) => ({
        round_number: round.round_number,
        round_type: round.round_type,
        duration_minutes: round.duration_minutes,
        description_text: round.description_text,
        difficulty_rating: round.difficulty_rating,
        platform_used: round.platform_used,
        notes: round.notes,
        topic_id: round.topic_id,
        questions: db.questions
          .filter((question) => question.round_id === round.round_id)
          .map((question) => ({
            question_text: question.question_text,
            question_type: question.question_type,
            topic_id: question.topic_id,
            difficulty: question.difficulty,
            reference_link: question.reference_link,
          })),
      }));

    const existingResources = db.resources
      .filter((resource) => resource.experience_id === editExperienceId)
      .map((resource) => ({
        title: resource.title,
        url: resource.url,
        skill_id: db.skill_resources.find((sr) => sr.resource_id === resource.resource_id)?.skill_id,
      }));

    setRounds(existingRounds.length > 0 ? existingRounds : [{
      round_number: 1,
      round_type: 'Tech',
      duration_minutes: 60,
      description_text: '',
      difficulty_rating: 3,
      platform_used: '',
      notes: '',
      topic_id: 1,
      questions: [],
    }]);
    setResources(existingResources.length > 0 ? existingResources : [{ title: '', url: '', skill_id: 1 }]);
    setCurrentStep(1);
  }, [editExperienceId, db]);

  const handleFinalSubmit = async (status: ExperienceStatus) => {
    const payload = {
      experience: {
        company_id: Number(companyId),
        role_title: roleTitle.trim(),
        experience_type: experienceType,
        year: Number(year),
        result,
        overall_difficulty: Number(overallDifficulty),
        ctc_or_stipend: ctcOrStipend.trim(),
        total_rounds: rounds.length,
        summary_text: summaryText.trim(),
        is_anonymous_public: isAnonymousPublic,
        status,
      },
      rounds: rounds.map((r) => ({
        round: {
          topic_id: Number(r.topic_id),
          round_number: r.round_number,
          round_type: r.round_type,
          duration_minutes: Number(r.duration_minutes),
          description_text: r.description_text.trim(),
          difficulty_rating: Number(r.difficulty_rating),
          platform_used: r.platform_used.trim(),
          difficulty: Number(r.difficulty_rating),
          notes: r.notes.trim(),
        },
        questions: r.questions.map((q) => ({
          topic_id: Number(q.topic_id),
          question_text: q.question_text.trim(),
          question_type: q.question_type,
          difficulty: Number(q.difficulty),
          reference_link: q.reference_link.trim(),
        })),
      })),
      resources: resources.filter((res) => res.title.trim() && res.url.trim()),
    };

    if (editExperienceId) {
      await updateExperience(editExperienceId, payload);
      setCreatedExpId(editExperienceId);
      setIsSubmitted(true);
      return;
    }

    const expId = await submitExperience(payload);
    setCreatedExpId(expId);
    setIsSubmitted(true);
  };

  const stepsList = [
    'Basic Experience',
    'Rounds Structure',
    'Round Questions',
    'Prep Resources',
    'Privacy & Anonymity',
    'Review & Submit',
  ];

  const isStepOneValid = () => {
    return !!(
      companyId &&
      roleTitle.trim() &&
      experienceType &&
      year &&
      result &&
      overallDifficulty &&
      summaryText.trim()
    );
  };

  const isStepTwoValid = () => {
    return rounds.length > 0 && rounds.every((round) => {
      return !!(
        round.round_type &&
        Number(round.duration_minutes) > 0 &&
        round.platform_used.trim() &&
        round.topic_id &&
        Number(round.difficulty_rating) > 0 &&
        round.description_text.trim() &&
        round.notes.trim()
      );
    });
  };

  const isStepThreeValid = () => {
    return rounds.length > 0 && rounds.every((round) => {
      return round.questions.length > 0 && round.questions.every((question) => {
        return !!(
          question.question_text.trim() &&
          question.question_type &&
          question.topic_id &&
          Number(question.difficulty) > 0
        );
      });
    });
  };

  const isStepFourValid = () => {
    return resources.every((resource) => {
      if (!resource.title.trim() && !resource.url.trim() && !resource.skill_id) return true;
      return !!(resource.title.trim() && resource.url.trim() && resource.skill_id);
    });
  };

  const isStepFiveValid = () => isAnonymousPublic && isDataAccurate;

  const isFormReadyForSubmit = () => {
    return isStepOneValid() && isStepTwoValid() && isStepThreeValid() && isStepFourValid() && isStepFiveValid();
  };

  if (isSubmitted && createdExpId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Interview Experience Shared Successfully!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Thank you for helping fellow college students understand the technical interview bar. Your submission has been securely stored.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p>
            <strong>Role:</strong> {roleTitle} at{' '}
            {db.companies.find((c) => c.company_id === Number(companyId))?.name}
          </p>
          <p>
            <strong>Anonymity:</strong>{' '}
            {isAnonymousPublic ? 'Protected (Anonymous Alumni)' : 'Public'}
          </p>
          <p>
            <strong>Total Rounds:</strong> {rounds.length}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('alumni-details', { experienceId: createdExpId })}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition-all"
          >
            View Live Experience Page
          </button>
          <button
            onClick={() => onNavigate('feed')}
            className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
          >
            Return to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Stepper Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Submit Experience
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Help other students prepare by sharing your interview rounds, platform details, questions, and advice.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="relative">
          <div className="flex items-center gap-2 overflow-hidden rounded-full border border-slate-700/80 bg-slate-800/60 p-1.5">
            {stepsList.map((st, idx) => {
              const stepNum = idx + 1;
              const isDone = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              const isPast = stepNum <= currentStep;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setCurrentStep(stepNum)}
                  className={`relative flex-1 rounded-full px-2 py-2 text-center text-[10px] sm:text-[11px] font-extrabold transition-all duration-200 ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                      : isDone
                      ? 'bg-brand-500/15 text-brand-200 border border-brand-500/30'
                      : 'bg-transparent text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
                  } ${isPast ? 'border border-transparent' : ''}`}
                >
                  <span className="block truncate">{st}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${(currentStep / stepsList.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* FORM BODY */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8">
        {/* STEP 1: Basic Experience */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Step 1 — Company & Role Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company <span className="text-brand-600 dark:text-brand-400">*</span></label>
                <SearchableSelect
                  value={companyId}
                  onChange={(value) => setCompanyId(Number(value))}
                  options={db.companies.map((c) => ({
                    value: c.company_id,
                    label: c.name,
                    meta: c.industry,
                  }))}
                  searchable
                  placeholder="Select company"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Role Title <span className="text-brand-600 dark:text-brand-400">*</span></label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Embedded Systems Intern, Software Engineer"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Experience Type <span className="text-brand-600 dark:text-brand-400">*</span></label>
                <SearchableSelect
                  value={experienceType}
                  onChange={(value) => setExperienceType(value as ExperienceType)}
                  options={[
                    { value: 'internship', label: 'Internship' },
                    { value: 'placement', label: 'Full-time Placement' },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Drive Year <span className="text-brand-600 dark:text-brand-400">*</span></label>
                <SearchableSelect
                  value={year}
                  onChange={(value) => setYear(Number(value))}
                  options={[
                    { value: 2026, label: '2026' },
                    { value: 2025, label: '2025' },
                    { value: 2024, label: '2024' },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Interview Result <span className="text-brand-600 dark:text-brand-400">*</span></label>
                <SearchableSelect
                  value={result}
                  onChange={(value) => setResult(value as ExperienceResult)}
                  options={[
                    { value: 'selected', label: 'Selected' },
                    { value: 'rejected', label: 'Rejected' },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Overall Difficulty Rating (1 to 5) <span className="text-brand-600 dark:text-brand-400">*</span>
                </label>
                <SearchableSelect
                  value={overallDifficulty}
                  onChange={(value) => setOverallDifficulty(Number(value))}
                  options={[
                    { value: 1, label: '1 — Easy' },
                    { value: 2, label: '2 — Moderate' },
                    { value: 3, label: '3 — Intermediate' },
                    { value: 4, label: '4 — Hard' },
                    { value: 5, label: '5 — Very Hard' },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  CTC / Stipend (Optional)
                </label>
                <input
                  type="text"
                  value={ctcOrStipend}
                  onChange={(e) => setCtcOrStipend(e.target.value)}
                  placeholder="e.g. ₹75,000/month or ₹28 LPA"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Experience Summary & Key Takeaways <span className="text-brand-600 dark:text-brand-400">*</span></label>
              <textarea
                rows={4}
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
                placeholder="Give a high level overview of the drive, overall tone of the interviewers, key topics tested..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Rounds Builder */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  <span>Step 2 — Interview Rounds ({rounds.length})</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Specify details for each round (OA, Technical, System Design, HR, GD).
                </p>
              </div>

              <button
                type="button"
                onClick={addRound}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/70 hover:bg-brand-100 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 font-bold text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Round
              </button>
            </div>

            <div className="space-y-5">
              {rounds.map((round, rIndex) => (
                <div
                  key={round.round_number}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                        {round.round_number}
                      </span>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Round {round.round_number}
                      </span>
                    </div>

                    {rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRound(rIndex)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                        title="Remove Round"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Round Type <span className="text-brand-600 dark:text-brand-400">*</span></label>
                      <div className="mt-1">
                        <SearchableSelect
                          value={round.round_type}
                          onChange={(value) => {
                            const updated = [...rounds];
                            updated[rIndex].round_type = value as RoundType;
                            setRounds(updated);
                          }}
                          options={[
                            { value: 'OA', label: 'OA (Online Assessment)' },
                            { value: 'Tech', label: 'Technical Interview' },
                            { value: 'SysDesign', label: 'System Design' },
                            { value: 'HR', label: 'HR / Behavioral' },
                            { value: 'GD', label: 'Group Discussion' },
                          ]}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration (Minutes) <span className="text-brand-600 dark:text-brand-400">*</span></label>
                      <input
                        type="number"
                        value={round.duration_minutes}
                        onChange={(e) => {
                          const updated = [...rounds];
                          updated[rIndex].duration_minutes = Number(e.target.value);
                          setRounds(updated);
                        }}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Platform Used <span className="text-brand-600 dark:text-brand-400">*</span></label>
                      <input
                        type="text"
                        value={round.platform_used}
                        onChange={(e) => {
                          const updated = [...rounds];
                          updated[rIndex].platform_used = e.target.value;
                          setRounds(updated);
                        }}
                        placeholder="HackerEarth, Teams, CoderPad"
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Tested Topic <span className="text-brand-600 dark:text-brand-400">*</span></label>
                      <div className="mt-1">
                        <SearchableSelect
                          value={round.topic_id}
                          onChange={(value) => {
                            const updated = [...rounds];
                            updated[rIndex].topic_id = Number(value);
                            setRounds(updated);
                          }}
                          options={db.topics.map((t) => ({
                            value: t.topic_id,
                            label: t.topic_name,
                            meta: t.category,
                          }))}
                          searchable
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Round Difficulty (1-5) <span className="text-brand-600 dark:text-brand-400">*</span></label>
                      <div className="mt-1">
                        <SearchableSelect
                          value={round.difficulty_rating}
                          onChange={(value) => {
                            const updated = [...rounds];
                            updated[rIndex].difficulty_rating = Number(value);
                            setRounds(updated);
                          }}
                          options={[
                            { value: 1, label: '1 — Easy' },
                            { value: 2, label: '2 — Moderate' },
                            { value: 3, label: '3 — Intermediate' },
                            { value: 4, label: '4 — Hard' },
                            { value: 5, label: '5 — Very Hard' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Round Description <span className="text-brand-600 dark:text-brand-400">*</span></label>
                    <textarea
                      rows={2}
                      value={round.description_text}
                      onChange={(e) => {
                        const updated = [...rounds];
                        updated[rIndex].description_text = e.target.value;
                        setRounds(updated);
                      }}
                      placeholder="Explain what happened in this round..."
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Candidate Notes & Advice for Juniors <span className="text-brand-600 dark:text-brand-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={round.notes}
                      onChange={(e) => {
                        const updated = [...rounds];
                        updated[rIndex].notes = e.target.value;
                        setRounds(updated);
                      }}
                      placeholder="Tips, tricky edge cases to watch for..."
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Questions per Round */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Step 3 — Questions Asked in Each Round</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Add specific coding, theoretical, or puzzle questions asked in each round.
              </p>
            </div>

            <div className="space-y-6">
              {rounds.map((round, rIndex) => (
                <div key={round.round_number} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RoundTypeBadge roundType={round.round_type} roundNumber={round.round_number} />
                      <span className="text-xs text-slate-500 dark:text-slate-400">({round.questions.length} questions added)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addQuestion(rIndex)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs hover:bg-purple-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Question to Round {round.round_number}
                    </button>
                  </div>

                  {round.questions.length === 0 ? (
                    <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-400 dark:text-slate-500">
                      No specific questions logged for this round yet. Click "Add Question" above.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {round.questions.map((q, qIndex) => (
                        <div
                          key={qIndex}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Question #{qIndex + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeQuestion(rIndex, qIndex)}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <textarea
                              rows={2}
                              value={q.question_text}
                              onChange={(e) => {
                                const updated = [...rounds];
                                updated[rIndex].questions[qIndex].question_text = e.target.value;
                                setRounds(updated);
                              }}
                              placeholder="Type the exact question or problem statement..."
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Question Type <span className="text-brand-600 dark:text-brand-400">*</span></label>
                              <div className="mt-1">
                                <SearchableSelect
                                  value={q.question_type}
                                  onChange={(value) => {
                                    const updated = [...rounds];
                                    updated[rIndex].questions[qIndex].question_type = value as QuestionType;
                                    setRounds(updated);
                                  }}
                                  options={[
                                    { value: 'coding', label: 'Coding Problem' },
                                    { value: 'theory', label: 'Theory / Concepts' },
                                    { value: 'puzzle', label: 'Puzzle / Brainteaser' },
                                  ]}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Topic <span className="text-brand-600 dark:text-brand-400">*</span></label>
                              <div className="mt-1">
                                <SearchableSelect
                                  value={q.topic_id}
                                  onChange={(value) => {
                                    const updated = [...rounds];
                                    updated[rIndex].questions[qIndex].topic_id = Number(value);
                                    setRounds(updated);
                                  }}
                                  options={db.topics.map((t) => ({
                                    value: t.topic_id,
                                    label: t.topic_name,
                                    meta: t.category,
                                  }))}
                                  searchable
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Difficulty (1-5) <span className="text-brand-600 dark:text-brand-400">*</span></label>
                              <div className="mt-1">
                                <SearchableSelect
                                  value={q.difficulty}
                                  onChange={(value) => {
                                    const updated = [...rounds];
                                    updated[rIndex].questions[qIndex].difficulty = Number(value);
                                    setRounds(updated);
                                  }}
                                  options={[
                                    { value: 1, label: '1 (Easy)' },
                                    { value: 2, label: '2 (Medium-)' },
                                    { value: 3, label: '3 (Medium)' },
                                    { value: 4, label: '4 (Hard)' },
                                    { value: 5, label: '5 (Very Hard)' },
                                  ]}
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <input
                              type="url"
                              value={q.reference_link}
                              onChange={(e) => {
                                const updated = [...rounds];
                                updated[rIndex].questions[qIndex].reference_link = e.target.value;
                                setRounds(updated);
                              }}
                              placeholder="Reference / Practice URL (e.g. LeetCode / GeeksforGeeks link)"
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Preparation Resources */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span>Step 4 — Recommended Preparation Resources</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Attach articles, docs, and cheat-sheets that helped you prepare for this drive.
                </p>
              </div>

              <button
                type="button"
                onClick={addResource}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/70 hover:bg-teal-100 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Resource
              </button>
            </div>

            <div className="space-y-3">
              {resources.map((res, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                    <div className="sm:col-span-6">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Resource Title <span className="text-brand-600 dark:text-brand-400">*</span></label>
                      <input
                        type="text"
                        value={res.title}
                        onChange={(e) => {
                          const updated = [...resources];
                          updated[index].title = e.target.value;
                          setResources(updated);
                        }}
                        placeholder="e.g. C++ STL Guide or FreeRTOS Book"
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Skill <span className="text-brand-600 dark:text-brand-400">*</span></label>
                      <div className="mt-1">
                        <SearchableSelect
                          value={res.skill_id ?? 1}
                          onChange={(value) => {
                            const updated = [...resources];
                            updated[index].skill_id = Number(value);
                            setResources(updated);
                          }}
                          options={db.skills.map((s) => ({
                            value: s.skill_id,
                            label: s.skill_name,
                          }))}
                          searchable
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-1 flex justify-end pt-5">
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="text-slate-400 hover:text-rose-600 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL <span className="text-brand-600 dark:text-brand-400">*</span></label>
                    <input
                      type="url"
                      value={res.url}
                      onChange={(e) => {
                        const updated = [...resources];
                        updated[index].url = e.target.value;
                        setResources(updated);
                      }}
                      placeholder="https://..."
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Privacy & Anonymity */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Step 5 — Final Declarations</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please confirm the publishing and accuracy settings before your experience goes live.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-900/80 shadow-card dark:shadow-dark-card overflow-hidden">
              <div className="p-5 sm:p-6 space-y-4">
                <div className="rounded-2xl border border-slate-700/80 bg-slate-800/70 p-4 sm:p-5">
                  <div className="space-y-3">
                    <h4 className="text-base font-extrabold text-white">
                      Publish Anonymously
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-300">
                      I understand that publishing anonymously protects my identity by hiding my personal details from public view. This allows me to share my interview journey honestly without exposing my name, email, phone number, or user record to other students or external visitors.
                    </p>

                    <label className="inline-flex items-center gap-2.5 pt-1 text-xs font-semibold text-slate-200">
                      <input
                        type="checkbox"
                        checked={isAnonymousPublic}
                        onChange={(e) => setIsAnonymousPublic(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                      />
                      <span>I affirm</span>
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700/80 bg-slate-800/70 p-4 sm:p-5">
                  <div className="space-y-3">
                    <h4 className="text-base font-extrabold text-white">
                      Data Accuracy
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-300">
                      I affirm that the information entered in this submission is accurate to the best of my knowledge and based on my real experience. I understand that misleading, exaggerated, or fabricated details can mislead juniors and diminish trust in the community.
                    </p>

                    <label className="inline-flex items-center gap-2.5 pt-1 text-xs font-semibold text-slate-200">
                      <input
                        type="checkbox"
                        checked={isDataAccurate}
                        onChange={(e) => setIsDataAccurate(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-brand-500 focus:ring-brand-500 focus:ring-offset-0"
                      />
                      <span>I affirm</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Live Preview & Submission */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span>Step 6 — Live Experience Preview</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This is exactly how other college students will see your submission.
              </p>
            </div>

            {/* Live Preview Card */}
            <div className="p-6 rounded-3xl border border-brand-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-card dark:shadow-dark-card space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    {isAnonymousPublic ? 'Anonymous Alumni' : currentUser?.name}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {currentUser?.college} • {currentUser?.branch} (Graduating {currentUser?.graduation_year})
                  </p>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {db.companies.find((c) => c.company_id === Number(companyId))?.name} — {roleTitle}
                  </h3>
                </div>

                <ResultBadge result={result} size="md" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  {year} • {experienceType.toUpperCase()}
                </span>
                {ctcOrStipend && (
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                    {ctcOrStipend}
                  </span>
                )}
                <DifficultyStars rating={overallDifficulty} size="sm" />
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed italic">
                "{summaryText}"
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Rounds Breakdown ({rounds.length} rounds)
                </h4>
                {rounds.map((r) => (
                  <div key={r.round_number} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Round {r.round_number}: {r.round_type} ({r.duration_minutes} mins)
                      </span>
                      <DifficultyStars rating={r.difficulty_rating} size="sm" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{r.description_text}</p>
                    {r.questions.length > 0 && (
                      <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold pt-1">
                        + {r.questions.length} questions attached
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleFinalSubmit('draft')}
                disabled={!isFormReadyForSubmit()}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  isFormReadyForSubmit()
                    ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    : 'bg-slate-700/60 text-slate-400 cursor-not-allowed'
                }`}
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => handleFinalSubmit('published')}
                disabled={!isFormReadyForSubmit()}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
                  isFormReadyForSubmit()
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/25'
                    : 'bg-slate-700/60 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Submit for Community Review</span>
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}
            className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, 6))}
              disabled={
                (currentStep === 1 && !isStepOneValid()) ||
                (currentStep === 2 && !isStepTwoValid()) ||
                (currentStep === 3 && !isStepThreeValid()) ||
                (currentStep === 4 && !isStepFourValid()) ||
                (currentStep === 5 && !isStepFiveValid())
              }
              className={`inline-flex items-center gap-1 px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${
                (currentStep === 1 && !isStepOneValid()) ||
                (currentStep === 2 && !isStepTwoValid()) ||
                (currentStep === 3 && !isStepThreeValid()) ||
                (currentStep === 4 && !isStepFourValid()) ||
                (currentStep === 5 && !isStepFiveValid())
                  ? 'bg-slate-600 opacity-50 cursor-not-allowed text-slate-200 shadow-none'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'
              }`}
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
