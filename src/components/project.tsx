import { useEffect, useState } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import axiosInstance from "../utils/axiosConfig";
import { Alert } from "flowbite-react";
import { Project as ProjectType } from "../interface/Project";

export default function Project() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // Cek apakah data sudah ada di localStorage
        const response = await axiosInstance.get("/api/project");
        const data = response.data.data;
        setProjects(data);
      } catch (error) {
        setError((error as string) || "Failed to fetch projects");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen py-20 px-4 lg:px-20 bg-gradient-to-b from-transparent to-blue-gray-900/20">
      <h1
        className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center mb-16"
        id="project"
        data-aos="fade-up">
        My Projects
      </h1>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-16">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative rounded-xl overflow-hidden bg-blue-gray-800/30 hover:bg-blue-gray-800/40 transition-all duration-300"
              data-aos="fade-up">
              <div className="md:grid md:grid-cols-2 gap-8 p-6">
                {/* Image Section */}
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={project.thumbnail} // Pastikan field `image` ada di data proyek
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    alt={project.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <div className="flex gap-4">
                      <a
                        href={project.github_link} // Pastikan field `githubLink` ada di data proyek
                        className="text-white hover:text-blue-400 transition-colors">
                        <FaGithub size={24} />
                      </a>
                      <a
                        href={project.demo_link} // Pastikan field `demoLink` ada di data proyek
                        className="text-white hover:text-blue-400 transition-colors">
                        <FaExternalLinkAlt size={24} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="mt-6 md:mt-0">
                  <h3 className="text-2xl font-bold text-blue-gray-100 mb-4">
                    {project.title}
                  </h3>
                  <p className="text-blue-gray-200 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-sm bg-blue-400/20 text-blue-400 rounded-full">
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
