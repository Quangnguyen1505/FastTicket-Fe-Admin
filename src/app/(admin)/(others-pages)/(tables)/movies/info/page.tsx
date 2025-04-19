"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableMovie from "@/components/tables/BasicTableMovie";
import Button from "@/components/ui/button/Button";
import MovieFormModal from "@/components/common/MovieFormModal";
import { MovieUploadFormData } from "@/types/movies";
import { createMovies } from "@/services/movies.service";
import { useAppSelector } from "@/redux/hooks";
import { convertMovieToFormData } from "@/helpers/convertMovieToFormData";

export default function BasicTables() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddMovie = async (movie: MovieUploadFormData) => {
    try {
        if (!shopId || !accessToken) {
            console.error("Thiếu shopId hoặc accessToken.");
            return;
        }

        const formData = convertMovieToFormData(movie);
        
        await createMovies(shopId, accessToken, formData);
        
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
          <BasicTableMovie />
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
