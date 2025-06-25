export interface PersonalInfoType {
  id: string;
  name: string;
  job_title: string;
  bio: string;
  email: string;
  profile_photo: string | File; // Bisa berupa string (URL) atau File
  years_experience: number;
  total_projects: number;
  total_technologies: number;
  created_at: string;
  updated_at: string;
}
