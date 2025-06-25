export interface Skill {
  id: string;
  name: string;
  icon: string | null;
  category: SkillCategory;
}

export enum SkillCategory {
  WEB_DEVELOPER = "WEB_DEVELOPMENT",
  MOBILE_DEVELOPMENT = "MOBILE_DEVELOPMENT",
  OTHER = "Other",
}
