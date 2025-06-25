import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { Project } from "../../interface/Project";
import { Button, Spinner } from "flowbite-react";
import { AxiosError } from "axios";

interface FormAddProjectProps {
  onAddProject: (newProject: Project) => void;
}

export const FormAddProject: React.FC<FormAddProjectProps> = ({
  onAddProject,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    demo_link: "",
    github_link: "",
    technologies: [] as { skill_id: string }[],
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [availableSkills, setAvailableSkills] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Tambahkan loading state
  const [submitting, setSubmitting] = useState(false); // Untuk mencegah double submit
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Untuk alert error
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Key untuk localStorage
  const localStorageSkillsKey = "skillsData";

  // Ambil daftar skill dari server atau localStorage
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);

        // Cek apakah data skill sudah ada di localStorage
        const cachedSkills = localStorage.getItem(localStorageSkillsKey);
        if (cachedSkills) {
          setAvailableSkills(JSON.parse(cachedSkills)); // Gunakan data dari localStorage
        } else {
          // Fetch data skill dari API jika tidak ada di localStorage
          const response = await axiosInstance.get("/api/skill");
          const data = response.data.data;
          setAvailableSkills(data);
          localStorage.setItem(localStorageSkillsKey, JSON.stringify(data)); // Simpan ke localStorage
        }
      } catch (error) {
        setErrorMessage("Gagal memuat daftar skill. Silakan refresh halaman.");
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Handler untuk input text
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler untuk memilih thumbnail
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  // Handler untuk memilih skill
  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const skillId = e.target.value;
    if (skillId && !selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
      setFormData({
        ...formData,
        technologies: [...formData.technologies, { skill_id: skillId }],
      });
    }
  };

  // Handler untuk menghapus skill
  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = selectedSkills.filter((id) => id !== skillId);
    setSelectedSkills(updatedSkills);
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(
        (tech) => tech.skill_id !== skillId
      ),
    });
  };

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (submitting) return;
    setSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("demo_link", formData.demo_link);
    data.append("github_link", formData.github_link);
    formData.technologies.forEach((tech, index) => {
      data.append(`technologies[${index}][skill_id]`, tech.skill_id);
    });
    if (thumbnail) {
      data.append("thumbnail", thumbnail);
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/project", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onAddProject(response.data.data);
      // Reset form setelah sukses
      setFormData({
        title: "",
        description: "",
        demo_link: "",
        github_link: "",
        technologies: [],
      });
      setThumbnail(null);
      setSelectedSkills([]);
      setSuccessMessage("Project berhasil ditambahkan!");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof AxiosError
          ? error.response?.data?.message ||
              "Gagal menambahkan project. Silakan cek data dan coba lagi."
          : "Terjadi kesalahan yang tidak terduga"
      );
      console.error("Error adding project:", error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Tampilkan loading state jika data sedang di-fetch
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner color="#3b82f6" size={50} />
      </div>
    );
  }

  return (
    <div className="relative">
      {submitting && (
        <div className="flex justify-center items-center absolute inset-0 bg-white bg-opacity-60 z-10">
          <Spinner color="#3b82f6" size={50} />
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3">
            &times;
          </button>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3">
            &times;
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        {/* Input untuk title */}
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Input untuk description */}
        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Input untuk demo_link */}
        <input
          type="text"
          name="demo_link"
          placeholder="Demo Link"
          value={formData.demo_link}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />

        {/* Input untuk github_link */}
        <input
          type="text"
          name="github_link"
          placeholder="GitHub Link"
          value={formData.github_link}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />

        {/* Input untuk thumbnail */}
        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Input untuk technologies */}
        <div>
          <label className="block text-sm font-medium mb-2">Technologies</label>
          <select
            onChange={handleSkillChange}
            className="w-full p-2 border rounded">
            <option value="">Select a skill</option>
            {availableSkills?.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedSkills.map((skillId) => {
              const skill = availableSkills.find((s) => s.id === skillId);
              return (
                <div
                  key={skillId}
                  className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                  {skill?.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skillId)}
                    className="ml-2 text-blue-800 hover:text-blue-900">
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tombol submit */}
        <Button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
          disabled={submitting}>
          {submitting ? <Spinner color="#ffffff" size={20} /> : "Add Project"}
        </Button>
      </form>
    </div>
  );
};
