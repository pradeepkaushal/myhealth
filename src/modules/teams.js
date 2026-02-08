import { getLevelForStreak } from "../utils/levels";
import { getLocalDateKey } from "../utils/date";

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const createTeam = (name) => ({
  id: createId(),
  name,
  members: [],
});

export const addMemberToTeam = (team, name) => {
  const member = {
    id: createId(),
    name,
    streak: 0,
    level: getLevelForStreak(0),
    dailyActivity: [],
  };
  return { ...team, members: [...team.members, member] };
};

export const removeMemberFromTeam = (team, memberId) => ({
  ...team,
  members: team.members.filter((member) => member.id !== memberId),
});

export const logMemberActivity = (team, memberId, minutes) => {
  const todayKey = getLocalDateKey(new Date());
  return {
    ...team,
    members: team.members.map((member) => {
      if (member.id !== memberId) return member;
      const nextStreak = member.lastActive === todayKey ? member.streak : member.streak + 1;
      const nextActivity = [...member.dailyActivity, { date: todayKey, minutes }];
      return {
        ...member,
        streak: nextStreak,
        lastActive: todayKey,
        level: getLevelForStreak(nextStreak),
        dailyActivity: nextActivity,
      };
    }),
  };
};
