/**
 * Gamification utility for calculating levels and awarding badges
 */

const LEVELS = [
    { level: 1, name: 'Beginner', xpRequired: 0 },
    { level: 2, name: 'Skilled', xpRequired: 200 },
    { level: 3, name: 'Expert', xpRequired: 500 },
    { level: 4, name: 'Master', xpRequired: 1000 },
];

const BADGES = [
    { id: 'top_volunteer', name: 'Top Volunteer', description: 'Complete 10 tasks as a volunteer', condition: (user) => user.completedVolunteerTasks >= 10 },
    { id: 'fast_responder', name: 'Fast Responder', description: 'Average response time under 1 hour', condition: (user) => user.avgResponseTime < 60 },
    { id: 'community_hero', name: 'Community Hero', description: 'Earn 1000 total points', condition: (user) => user.totalEarnedPoints >= 1000 },
];

const calculateLevel = (xp) => {
    let currentLevel = LEVELS[0];
    for (const lvl of LEVELS) {
        if (xp >= lvl.xpRequired) {
            currentLevel = lvl;
        } else {
            break;
        }
    }
    return currentLevel;
};

const getNewBadges = (user, existingBadges) => {
    const newBadges = [];
    for (const badge of BADGES) {
        if (!existingBadges.includes(badge.id) && badge.condition(user)) {
            newBadges.push(badge.id);
        }
    }
    return newBadges;
};

module.exports = {
    calculateLevel,
    getNewBadges,
    LEVELS,
    BADGES
};
