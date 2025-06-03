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
import Pagination from "@/components/tables/Pagination";
import { useSearch } from "@/contexts/SearchContext";

export default function BasicTables() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { context, searchTerm } = useSearch();
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  useEffect( () => {
    // Chỉ lọc nếu đang trong context "movies"
    if (context === "movies" && searchTerm) {
      console.log("Filtering movies with search term:", searchTerm);
      const fetchMovies = async () => {
        const res = await getAllMovies({search: searchTerm});
        setFilteredMovies(res.metadata.movies || []);
      }

      fetchMovies();
    } else {
      setFilteredMovies(movies);
    }
  }, [context, searchTerm, movies]);


  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchMovies = useCallback(async (page: number) => {
    try {
      const res = await getAllMovies({
        limit: 8,
        page,
        movie_status: "now-showing",
      });
      console.log("Fetched movies:", res);
      setMovies(res.metadata.movies || []);
      setTotalPages(Math.ceil(res.metadata.totalCount / 8));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phim:", error);
    }
  }, []);


  useEffect(() => {
    fetchMovies(currentPage);
  }, [fetchMovies, currentPage]);

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

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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
          <BasicTableMovie movies={filteredMovies} setMovies={setMovies}/>
          {/* Hiển thị thông báo khi có tìm kiếm */}
          {context === "movies" && searchTerm && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Đang tìm kiếm: {searchTerm} - Tìm thấy {filteredMovies.length} kết quả
              </p>
              <button 
                className="mt-2 text-sm text-blue-500 hover:underline"
                onClick={() => {
                  // Reset tìm kiếm
                  const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (searchInput) searchInput.value = "";
                  // Gọi hàm reset context
                  // (Bạn có thể thêm hàm reset trong context nếu cần)
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
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
