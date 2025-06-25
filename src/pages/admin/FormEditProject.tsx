import React, { useState, useEffect } from "react";
import { Project, Technologi } from "../../interface/Project";
import axiosInstance from "../../utils/axiosConfig";
import { Button, Spinner, Badge, Alert } from "flowbite-react";
import { Skill } from "../../interface/Skill";
import { AxiosError } from "axios";

interface FormEditProjectProps {
  project: Project;
  onEditProject: (updatedProject: Project) => void;
  onCancel: () => void;
  onSuccess: (message: string) => void; // Tambahkan prop onSuccess
}

export const FormEditProject: React.FC<FormEditProjectProps> = ({
  project,
  onEditProject,
  onCancel,
  onSuccess,
}) => {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [demoLink, setDemoLink] = useState(project.demo_link || "");
  const [githubLink, setGithubLink] = useState(project.github_link || "");
  const [technologies, setTechnologies] = useState<Technologi[]>(
    project.technologies || []
  );
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [onError, setOnError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosInstance.get("/api/skill");
        setSkills(response.data.data);
      } catch (error: unknown) {
        setOnError((error as AxiosError).message);
        console.error("Gagal memuat skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    formData.append("demo_link", demoLink);
    formData.append("github_link", githubLink);

    const newTechnologiesId: { skill_id: string }[] = [];
    technologies.forEach((tech) => {
      newTechnologiesId.push({ skill_id: tech.id });
    });

    newTechnologiesId.forEach((tech, index) => {
      formData.append(`technologies[${index}][skill_id]`, tech.skill_id);
    });

    try {
      setLoading(true);
      const response = await axiosInstance.patch(
        `/api/project/${project.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status && response.data.data) {
        onEditProject(response.data.data);
        onSuccess(response.data.message); // Panggil onSuccess dengan pesan success
      } else {
        setOnError(response.data.message);
        console.error("Respons tidak valid:", response.data);
      }
    } catch (error) {
      setOnError((error as AxiosError).message);
      console.error("Gagal memperbarui proyek:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {onError && (
        <Alert color="failure" className="mb-4">
          {onError}
        </Alert>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Judul</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Deskripsi
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Thumbnail
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Demo Link
        </label>
        <input
          type="text"
          value={demoLink}
          onChange={(e) => setDemoLink(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          GitHub Link
        </label>
        <input
          type="text"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Technologies
        </label>
        <div className="flex gap-2">
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Pilih Skill</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            onClick={() => {
              if (selectedSkill) {
                const selected = skills.find(
                  (skill) => skill.id === selectedSkill
                );
                if (selected) {
                  const isSkillAlreadyAdded = technologies.some(
                    (tech) => tech.id === selected.id
                  );

                  if (!isSkillAlreadyAdded) {
                    const newTech: Technologi = {
                      id: selected.id,
                      name: selected.name,
                      icon: selected.icon || null,
                      category: selected.category || "",
                      created_at: new Date().toISOString(),
                      skill: selected,
                    };
                    setTechnologies([...technologies, newTech]);
                    setSelectedSkill("");
                  } else {
                    console.warn("Skill sudah ditambahkan.");
                  }
                }
              }
            }}
            className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Tambah
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {technologies.map((tech, index) => (
            <Badge key={index} color="info" className="flex items-center gap-2">
              <span>{tech.name}</span>
              <button
                onClick={() => {
                  const newTechs = technologies.filter((_, i) => i !== index);
                  setTechnologies(newTechs);
                }}
                className="text-sm hover:text-red-500">
                &times;
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Button type="submit" className="bg-blue-500 text-white rounded">
              Simpan
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white rounded">
              Batal
            </Button>
          </>
        )}
      </div>
    </form>
  );
};
