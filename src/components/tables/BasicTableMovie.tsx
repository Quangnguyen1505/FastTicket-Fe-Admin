"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { deleteMovies, getAllMovies, updateMovies } from "@/services/movies.service";
import { Movie, MovieUploadFormData } from "@/types/movies"; // Đảm bảo import MovieUploadFormData
import EditMovieModal from "./EditMovieModal";
import { convertMovieToFormData } from "@/helpers/convertMovieToFormData";
import { useAppSelector } from "@/redux/hooks";

export default function BasicTableMovie() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  const fetchMovies = useCallback(async () => {
    try {
      const res = await getAllMovies({
        limit: 50,
        page: 1,
        movie_status: "now-showing",
      });
      setMovies(res.metadata || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setEditModalOpen(true);
  };

  const handleUpdateMovie = async (updatedFormData: MovieUploadFormData) => {
    try {
      if (!selectedMovie) return;
      if (!shopId || !accessToken) {
        alert("pls register or signin!");
        return;
      }
  
      const updatedMovie: Movie = {
        ...selectedMovie,
        ...updatedFormData,
        id: selectedMovie.id,
        movie_categories: selectedMovie.movie_categories || [],
      };
  
      console.log("form movie ", updatedFormData )
      const formData = convertMovieToFormData(updatedFormData);
      await updateMovies(shopId, accessToken, selectedMovie.id, formData)
      setMovies((prev) =>
        prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))
      );
      setEditModalOpen(false); 
    } catch (error) {
      console.log("error ", error);
      alert("update movice failed. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (movieId: string) => {
    try {
        if (!shopId || !accessToken) {
            alert("Vui lòng đăng nhập lại!");
            return;
        }

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thể loại này?");
        if (!confirmDelete) return;

        const res = await deleteMovies(shopId, accessToken, movieId);
        console.log("res ", res.data);
        
        alert("Đã xóa thể loại thành công!");
        setMovies((prev) =>
            prev.filter((movie) => movie.id !== movieId)
        );
    } catch (error) {
        console.log("error ", error);
        alert("Xóa thể loại thất bại. Vui lòng thử lại.");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const statusColors = {
      "now-showing": "success",
      "coming-soon": "warning",
      expired: "error",
    } as const;
  
    return statusColors[status as keyof typeof statusColors] || "error";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "Poster",
                  "Tên Phim",
                  "Thời gian bắt đầu",
                  "Thời gian Kết thúc",
                  "Đạo diễn",
                  "Diễn viên",
                  "Thời lượng",
                  "Link trailer",
                  "Status",
                  "Actions",
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="w-14 h-20 overflow-hidden rounded-md border border-gray-200">
                      <Image
                        src={movie.movie_image_url}
                        alt={movie.movie_title}
                        width={56}
                        height={80}
                        className="object-cover w-full h-full"
                        priority
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {movie.movie_title}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {new Date(movie.movie_release_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    -
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {movie.movie_director}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {movie.movie_performer}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {movie.movie_time} phút
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-blue-500 dark:text-blue-400">
                    <a
                      href={`https://www.youtube.com/watch?v=${movie.movie_video_trailer_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-700"
                    >
                      Trailer
                    </a>
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start text-theme-sm">
                    <Badge
                      size="sm"
                      color={getStatusBadgeColor(movie.movie_status)}
                    >
                      {movie.movie_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {selectedMovie && (
        <EditMovieModal
          isOpen={editModalOpen}
          movie={selectedMovie}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdateMovie}
        />
      )}
    </div>
  );
}