import React from 'react';
import { FocusSession } from '../types';
import ConsistencyCalendar from './ConsistencyCalendar';

export interface StudyStreakProps {
  focusSessions: FocusSession[];
  dailyGoalMinutes: number;
  onUpdateDailyGoal?: (minutes: number) => void;
  className?: string;
  defaultExpanded?: boolean;
}

export default function StudyStreak({
  focusSessions,
  dailyGoalMinutes,
  onUpdateDailyGoal,
  className = '',
  defaultExpanded
}: StudyStreakProps) {
  return (
    <ConsistencyCalendar
      focusSessions={focusSessions}
      dailyGoalMinutes={dailyGoalMinutes}
      onUpdateDailyGoal={onUpdateDailyGoal}
      className={className}
      defaultExpanded={defaultExpanded}
    />
  );
}

export { ConsistencyCalendar };
