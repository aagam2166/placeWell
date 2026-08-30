import React, { useState } from 'react';
import { RoundType, Topic, Skill } from '../../types/database';

export const OutcomeDonutChart: React.FC<{
  selected: number;
  rejected: number;
  total: number;
}> = ({ selected, rejected, total }) => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  if (total === 0) {
    return <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">No outcome data reported yet</div>;
  }

  const selPct = Math.round((selected / total) * 100);
  const rejPct = Math.round((rejected / total) * 100);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const selOffset = 0;
  const selLength = (selPct / 100) * circumference;

  const rejOffset = -selLength;
  const rejLength = (rejPct / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="14"
            fill="transparent"
          />

          {selPct > 0 && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-emerald-500 transition-all duration-500 cursor-pointer hover:stroke-emerald-400"
              strokeWidth={activeSegment === 'selected' ? 17 : 14}
              strokeDasharray={`${selLength} ${circumference}`}
              strokeDashoffset={selOffset}
              strokeLinecap="round"
              fill="transparent"
              onMouseEnter={() => setActiveSegment('selected')}
              onMouseLeave={() => setActiveSegment(null)}
            />
          )}

          {rejPct > 0 && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-rose-500 transition-all duration-500 cursor-pointer hover:stroke-rose-400"
              strokeWidth={activeSegment === 'rejected' ? 17 : 14}
              strokeDasharray={`${rejLength} ${circumference}`}
              strokeDashoffset={rejOffset}
              strokeLinecap="round"
              fill="transparent"
              onMouseEnter={() => setActiveSegment('rejected')}
              onMouseLeave={() => setActiveSegment(null)}
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {activeSegment === 'selected' ? `${selPct}%` : activeSegment === 'rejected' ? `${rejPct}%` : total}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {activeSegment ? activeSegment : 'Responses'}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2.5">
        <div
          className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
            activeSegment === 'selected' ? 'bg-emerald-50/80 dark:bg-emerald-950/60 ring-1 ring-emerald-200 dark:ring-emerald-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
          onMouseEnter={() => setActiveSegment('selected')}
          onMouseLeave={() => setActiveSegment(null)}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-2xs"></span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">{selected}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">({selPct}%)</span>
          </div>
        </div>

        <div
          className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
            activeSegment === 'rejected' ? 'bg-rose-50/80 dark:bg-rose-950/60 ring-1 ring-rose-200 dark:ring-rose-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
          onMouseEnter={() => setActiveSegment('rejected')}
          onMouseLeave={() => setActiveSegment(null)}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-2xs"></span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rejected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">{rejected}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">({rejPct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DifficultyHistogram: React.FC<{
  distribution: { [stars: number]: number };
  total: number;
}> = ({ distribution, total }) => {
  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = distribution[stars] || 0;
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <div key={stars} className="flex items-center gap-3 text-xs">
            <span className="w-12 font-semibold text-slate-700 dark:text-slate-300 text-right flex items-center justify-end gap-1">
              <span>{stars}</span>
              <span className="text-amber-400">★</span>
            </span>

            <div className="flex-1 h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-cyan-500 to-brand-600"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>

            <span className="w-14 text-slate-500 dark:text-slate-400 text-right font-medium">
              {count} <span className="text-slate-400 dark:text-slate-500 text-[10px]">({percentage}%)</span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const RoundFrequencyChart: React.FC<{
  roundStructure: { [key in RoundType]?: number };
}> = ({ roundStructure }) => {
  const labels: { [key in RoundType]: string } = {
    OA: 'Online Assessment',
    Tech: 'Technical Round',
    SysDesign: 'System Design',
    HR: 'HR / Behavioral',
    GD: 'Group Discussion',
  };

  const colors: { [key in RoundType]: string } = {
    OA: 'bg-cyan-500',
    Tech: 'bg-brand-600',
    SysDesign: 'bg-indigo-500',
    HR: 'bg-purple-500',
    GD: 'bg-teal-500',
  };

  const totalRounds = Object.values(roundStructure).reduce((a, b) => (a || 0) + (b || 0), 0) || 1;

  const roundEntries = (['OA', 'Tech', 'SysDesign', 'HR', 'GD'] as RoundType[])
    .map((type) => ({
      type,
      label: labels[type],
      count: roundStructure[type] || 0,
      color: colors[type],
      pct: Math.round(((roundStructure[type] || 0) / totalRounds) * 100),
    }))
    .filter((e) => e.count > 0);

  return (
    <div className="space-y-3">
      {/* Visual multi-segmented bar */}
      <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
        {roundEntries.map((entry) => (
          <div
            key={entry.type}
            className={`${entry.color} transition-all duration-500 hover:opacity-90`}
            style={{ width: `${entry.pct}%` }}
            title={`${entry.label}: ${entry.count} occurrences (${entry.pct}%)`}
          />
        ))}
      </div>

      {/* Breakdown list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
        {roundEntries.map((entry) => (
          <div key={entry.type} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className={`w-2.5 h-2.5 rounded-full ${entry.color}`} />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{entry.type}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{entry.count} rounds ({entry.pct}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TopicFrequencyBar: React.FC<{
  topTopics: { topic: Topic; skill: Skill; count: number; percentage: number }[];
  onSelectTopic?: (topic: Topic) => void;
}> = ({ topTopics, onSelectTopic }) => {
  if (topTopics.length === 0) {
    return <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">No specific topic frequency recorded yet</div>;
  }

  return (
    <div className="space-y-3">
      {topTopics.slice(0, 6).map((item) => (
        <div
          key={item.topic.topic_id}
          onClick={() => onSelectTopic?.(item.topic)}
          className="group p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-500 hover:bg-cyan-50/30 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-cyan-400 transition-colors">
                {item.topic.topic_name}
              </span>
              <span className="text-[10px] uppercase font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                {item.skill.skill_name}
              </span>
            </div>
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              {item.count} mentions
            </span>
          </div>

          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-500 to-brand-600 transition-all duration-700"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
