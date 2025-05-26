"use client";
import React, { useCallback, useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableMovie from "@/components/tables/BasicTableMovie";
import Button from "@/components/ui/button/Button";
import MovieFormModal from "@/components/common/MovieFormModal";
import { Movie, MovieUploadFormData } from "@/types/movies";
import { createMovies, getAllMovies } from "@/services/movies.service";
import { useAppSelector } from "@/redux/hooks";
import { convertMovieToFormData } from "@/helpers/convertMovieToFormData";
import toast from "react-hot-toast";

export default function BasicTables() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchMovies = useCallback(async () => {
    try {
      const res = await getAllMovies({
        limit: 50,
        page: 1,
        movie_status: "now-showing",
      });
      setMovies(res.metadata || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phim:", error);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleAddMovie = async (movie: MovieUploadFormData) => {
    try {
        if (!shopId || !accessToken) {
            console.error("Thiếu shopId hoặc accessToken.");
            return;
        }

        const formData = convertMovieToFormData(movie);
        
        const res = await createMovies(shopId, accessToken, formData);
        const newMovie = res.metadata;
        if (newMovie) {
          setMovies((prev) => [...prev, newMovie]); 
        }
        toast.success("Thêm phim thành công!");
        

        closeModal(); 
    } catch (error) {
        console.error("Lỗi khi thêm phim:", error);
    }
  }; 

  return (
    <div>
      <PageBreadcrumb pageTitle="Phim" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex items-center gap-10">
              <span className="text-base font-semibold">Thông Tin Phim</span>
              <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
                Thêm phim mới +
              </Button>
            </div>
          }
        >
          <BasicTableMovie movies={movies} setMovies={setMovies}/>
        </ComponentCard>
      </div>

      <MovieFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddMovie}
      />
    </div>
  );
}
