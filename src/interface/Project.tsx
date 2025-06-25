import { Skill } from "./Skill";

export interface Technologi {
  id: string;
  name: string;
  icon: string | null;
  category: string;
  created_at: string;
  skill: Skill;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  demo_link: string;
  github_link: string;
  created_at: string;
  updated_at: string;
  technologies: Technologi[];
}
