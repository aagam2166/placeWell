import React, { useState } from 'react';
import { Round, Topic, Skill, Question } from '../../types/database';
import { RoundTypeBadge, DifficultyStars, TopicPill } from './Badges';
import { QuestionCard } from './Cards';
import { ChevronDown, Clock, Laptop, Lightbulb, MessageSquare } from 'lucide-react';

export const RoundAccordion: React.FC<{
  round: Round;
  topic?: Topic;
  skill?: Skill;
  questions: (Question & { topic?: Topic })[];
  defaultOpen?: boolean;
}> = ({ round, topic, skill, questions, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card overflow-hidden transition-all duration-300">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors focus:outline-none"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-900 flex items-center justify-center font-black text-xs text-brand-700 dark:text-brand-300">
            {round.round_number}
          </div>

          <RoundTypeBadge roundType={round.round_type} />

          {round.platform_used && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              <Laptop className="w-3 h-3 text-slate-400" />
              {round.platform_used}
            </span>
          )}

          {round.duration_minutes > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              {round.duration_minutes} mins
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <DifficultyStars rating={round.difficulty_rating || round.difficulty} size="sm" />
          <div
            className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-transform duration-300 ${
              isOpen ? 'rotate-180 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400' : ''
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-5">
          {/* Platform & Duration Mobile Sub-bar */}
          <div className="sm:hidden flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2">
            {round.platform_used && (
              <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-medium">
                <Laptop className="w-3 h-3" /> {round.platform_used}
              </span>
            )}
            {round.duration_minutes > 0 && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> {round.duration_minutes} mins
              </span>
            )}
          </div>

          {/* Description */}
          {round.description_text && (
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-500" />
                Round Overview & Discussion
              </h5>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/60 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {round.description_text}
              </p>
            </div>
          )}

          {/* Key Topics Evaluated */}
          {topic && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Evaluated Topic:</span>
              <TopicPill name={topic.topic_name} category={topic.category} />
              {skill && (
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  (under <strong className="text-slate-700 dark:text-slate-300">{skill.skill_name}</strong>)
                </span>
              )}
            </div>
          )}

          {/* Specific Questions Asked */}
          {questions.length > 0 && (
            <div className="space-y-2.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Questions Asked ({questions.length})
              </h5>
              <div className="space-y-2.5">
                {questions.map((q) => (
                  <QuestionCard key={q.question_id} question={q} topic={q.topic} />
                ))}
              </div>
            </div>
          )}

          {/* Candidate Notes & Pro-Tips */}
          {round.notes && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-amber-900 dark:text-amber-200 block mb-0.5">Candidate Advice:</strong>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{round.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
