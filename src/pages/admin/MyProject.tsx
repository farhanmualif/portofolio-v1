import React, { useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { Project } from "../../interface/Project";
import { FormAddProject } from "./FormAddProject";
import { AxiosError } from "axios";
import { Button, Spinner } from "flowbite-react";
import { FormEditProject } from "./FormEditProject";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchProjects = async () => {
  const response = await axiosInstance.get("/api/project");
  return response.data.data as Project[];
};

const MyProject: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch & cache data project
  const {
    data: projects = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 60, // cache 1 jam
  });

  // Fungsi untuk menghapus project
  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      try {
        await axiosInstance.delete(`/api/project/${id}`);
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      } catch (err) {
        alert(
          err instanceof AxiosError
            ? err.response?.data?.message || "Gagal menghapus proyek"
            : "Terjadi kesalahan yang tidak terduga"
        );
      }
    }
  };

  // Fungsi untuk menambahkan project baru
  const handleAddProject = async () => {
    setShowForm(false);
    setSuccessMessage("Project berhasil ditambahkan!");
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  // Fungsi untuk mengedit project
  const handleEditProject = async () => {
    setShowEditForm(false);
    setEditingProject(null);
    setSuccessMessage("Proyek berhasil diperbarui!");
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  // Tampilkan spinner saat loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="#3b82f6" size={50} />
      </div>
    );
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>Gagal memuat data project</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Project</h2>

      {/* Tampilkan alert success jika ada */}
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

      <button
        onClick={() => setShowForm(!showForm)}
        className=" text-white rounded mb-4 text-sm py-1 px-3 hover:bg-blue-500 bg-blue-600">
        {showForm ? "Tutup Form" : "Tambah Project"}
      </button>

      {showForm ? (
        <FormAddProject onAddProject={handleAddProject} />
      ) : showEditForm && editingProject ? (
        <FormEditProject
          project={editingProject}
          onEditProject={handleEditProject}
          onSuccess={(message) => setSuccessMessage(message)}
          onCancel={() => {
            setShowEditForm(false);
            setEditingProject(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="border p-4 rounded">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-48 object-cover mb-4"
                />
                <h3 className="text-lg font-bold">{project.title}</h3>
                <p className="text-sm">{project.description}</p>

                <div className="mt-2">
                  <h4 className="text-sm font-semibold">Technologies:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(Array.isArray(project.technologies)
                      ? project.technologies
                      : []
                    ).map((tech) => {
                      if (tech.skill && tech.skill.name) {
                        return (
                          <span
                            key={tech.skill.id}
                            className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                            {tech.skill.name}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="flex mt-4">
                  <Button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-500 text-white rounded mt-2 mr-3">
                    Delete
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingProject(project);
                      setShowEditForm(true);
                    }}
                    className="bg-yellow-400 text-white rounded mt-2">
                    Edit
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>Tidak ada proyek yang ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProject;
