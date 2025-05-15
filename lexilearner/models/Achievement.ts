export interface Achievement {
    id: string;
    name: string;
    description: string;
    badge: string;
    createdAt: string;
    updatedAt: string;
    string: string;
}

export interface PupilAchievement {
    id: string;
    pupilId: string;
    achievementId: string;
    createdAt: string;
}
