import { useEffect, useState } from "react";
import { FaCode, FaMobile, FaGraduationCap } from "react-icons/fa";
import { PersonalInfoType } from "../interface/PersonalInfo";
import axiosInstance from "../utils/axiosConfig";
import { Alert } from "flowbite-react";

export default function About() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>({
    id: "",
    name: "",
    bio: "",
    email: "",
    job_title: "",
    profile_photo: "",
    years_experience: 0,
    total_projects: 0,
    total_technologies: 0,
    created_at: "",
    updated_at: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [myProject, setMyProject] = useState<Project[]>([]);

  const localStoragePersonalInfoKey = "personalInfoData";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch Personal Info
        const cachedPersonalInfo = localStorage.getItem(
          localStoragePersonalInfoKey
        );
        if (cachedPersonalInfo) {
          const parsedPersonalInfo = JSON.parse(cachedPersonalInfo);
          setPersonalInfo(parsedPersonalInfo);
        } else {
          const response = await axiosInstance.get("/api/personal-info");
          const data = response.data.data[0];
          setPersonalInfo(data);
          localStorage.setItem(
            localStoragePersonalInfoKey,
            JSON.stringify(data)
          );
        }

        // Fetch Projects
      } catch (error) {
        setError((error as string) || "Failed to fetch data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="text-blue-gray-100 overflow-x-hidden flex flex-col justify-center px-4 lg:px-20"
      id="about">
      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-16" data-aos="fade-right">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {personalInfo.name}
            </h1>
            <p className="mt-2 text-xl font-light tracking-wider">
              {personalInfo.job_title}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6" data-aos="fade-up">
              <p className="text-2xl leading-relaxed">{personalInfo.bio}</p>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-blue-gray-800/30 rounded-lg hover:bg-blue-gray-800/50 transition-all">
                  <span className="text-3xl font-bold text-blue-400">
                    {personalInfo.years_experience}+
                  </span>
                  <p className="text-sm mt-1">Years Experience</p>
                </div>
                <div className="text-center p-4 bg-blue-gray-800/30 rounded-lg hover:bg-blue-gray-800/50 transition-all">
                  <span className="text-3xl font-bold text-purple-400">
                    {personalInfo.total_projects}+
                  </span>
                  <p className="text-sm mt-1">Projects</p>
                </div>
                <div className="text-center p-4 bg-blue-gray-800/30 rounded-lg hover:bg-blue-gray-800/50 transition-all">
                  <span className="text-3xl font-bold text-teal-400">
                    {personalInfo.total_technologies}+
                  </span>
                  <p className="text-sm mt-1">Technologies</p>
                </div>
              </div>
            </div>

            <div className="space-y-6" data-aos="fade-left">
              <div className="grid gap-6">
                <div className="p-6 bg-blue-gray-800/30 rounded-xl hover:bg-blue-gray-800/50 transition-all">
                  <FaCode className="text-4xl text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Web Development
                  </h3>
                  <p className="text-blue-gray-300">
                    Experienced in building responsive and dynamic web
                    applications using modern frameworks and technologies.
                  </p>
                </div>

                <div className="p-6 bg-blue-gray-800/30 rounded-xl hover:bg-blue-gray-800/50 transition-all">
                  <FaMobile className="text-4xl text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Mobile Development
                  </h3>
                  <p className="text-blue-gray-300">
                    Creating cross-platform mobile applications using Flutter
                    for seamless user experiences.
                  </p>
                </div>

                <div className="p-6 bg-blue-gray-800/30 rounded-xl hover:bg-blue-gray-800/50 transition-all">
                  <FaGraduationCap className="text-4xl text-teal-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Continuous Learning
                  </h3>
                  <p className="text-blue-gray-300">
                    Always staying updated with the latest technologies and best
                    practices in software development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
