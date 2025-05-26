"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Movie, MovieUploadFormData } from "@/types/movies";
import { getAllCategory } from "@/services/category.service";
import { Category } from "@/types/categories";
import toast from "react-hot-toast";

interface EditMovieModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMovie: MovieUploadFormData) => void;
}

const EditMovieModal: React.FC<EditMovieModalProps> = ({ movie, isOpen, onClose, onSave }) => {
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const getInitialEditedMovie = (movie: Movie): MovieUploadFormData => ({
        file: null,
        movie_title: movie.movie_title,
        movie_video_trailer_code: movie.movie_video_trailer_code,
        movie_content: movie.movie_content,
        movie_time: movie.movie_time,
        movie_director: movie.movie_director,
        movie_performer: movie.movie_performer,
        movie_status: movie.movie_status,
        movie_category_name: movie.movie_categories.map((c) => ({ name: c.category.cate_name })),
        movie_country: movie.movie_country,
        movie_price: movie.movie_price,
        movie_release_date: movie.movie_release_date.split("T")[0],
        movie_age_rating: movie.movie_age_rating,
    });
    
    const [editedMovie, setEditedMovie] = useState<MovieUploadFormData>(getInitialEditedMovie(movie));
      
    useEffect(() => {
        if (movie) {
            setEditedMovie(getInitialEditedMovie(movie));
        }
    }, [isOpen, movie]);

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const res = await getAllCategory();
            setAllCategories(res.metadata || []);
          } catch (error) {
            console.error("Lỗi khi tải thể loại:", error);
          }
        };
      
        fetchCategories();
      }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;
      
        let newValue: string | number = value;
        if (type === "number") {
          newValue = value === "" ? "" : Number(value);
        }
      
        setEditedMovie((prev) => ({
          ...prev,
          [name]: newValue,
        }));
    };
      
      

    const handleSave = () => {
        if (!editedMovie.movie_title || !editedMovie.movie_release_date) {
          toast.error("Vui lòng nhập đầy đủ tiêu đề phim và ngày phát hành.");
          return;
        }
      
        const uploadData: MovieUploadFormData = {
          ...editedMovie,
          movie_time: Number(editedMovie.movie_time),
          movie_price: Number(editedMovie.movie_price),
        };
        
        onSave(uploadData);
        onClose();
      };
      
      

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Chỉnh sửa thông tin phim
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Cập nhật các thông tin của bộ phim.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                    <Label>Tiêu đề phim</Label>
                    <Input name="movie_title" defaultValue={editedMovie.movie_title || ""} onChange={handleChange} />
                </div>

                <div>
                    <Label>Đạo diễn</Label>
                    <Input name="movie_director" defaultValue={editedMovie.movie_director || ""} onChange={handleChange} />
                </div>

                <div>
                    <Label>Diễn viên</Label>
                    <Input name="movie_performer" defaultValue={editedMovie.movie_performer || ""} onChange={handleChange} />
                </div>

                <div>
                    <Label>Thời lượng (phút)</Label>
                    <Input name="movie_time" defaultValue={editedMovie.movie_time || ""} onChange={handleChange} />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Trạng thái
                    </label>
                    <select
                        name="movie_status"
                        value={editedMovie.movie_status}
                        onChange={handleChange}
                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    >
                        <option value="">Chọn trạng thái</option>
                        <option value="now-showing">Đang chiếu</option>
                        <option value="upcoming-movies">Sắp chiếu</option>
                    </select>
                </div>

                <div>
                    <Label>Ngày phát hành</Label>
                    <Input
                    name="movie_release_date"
                    type="date"
                    defaultValue={editedMovie.movie_release_date || ""}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-span-2">
                    <Label>Ảnh poster</Label>
                    {(previewUrl || movie.movie_image_url) && (
                    <img
                        src={previewUrl || movie.movie_image_url}
                        alt="Poster"
                        className="h-40 rounded-md object-cover mb-2"
                    />
                    )}
                    <Label>Chọn ảnh poster mới</Label>
                    <input
                    type="file"
                    name="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                        setPreviewUrl(URL.createObjectURL(file));
                        } else {
                        setPreviewUrl(null);
                        }
                        setEditedMovie((prev) => ({
                        ...prev,
                        file,
                        }));
                    }}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    />
                </div>



                <div className="col-span-2">
                    <Label>Mã video trailer</Label>
                    <Input
                    name="movie_video_trailer_code"
                    defaultValue={editedMovie.movie_video_trailer_code || ""}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <Label>Giá vé (VNĐ)</Label>
                    <Input
                        type="number"
                        name="movie_price"
                        defaultValue={editedMovie.movie_price || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Thể loại
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {allCategories.map((category) => (
                      <label key={category.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-white/90">
                        <input
                          type="checkbox"
                          value={category.cate_name}
                          checked={editedMovie.movie_category_name.some((c) => c.name === category.cate_name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                                setEditedMovie((prev) => ({
                                    ...prev,
                                    movie_category_name: [...prev.movie_category_name, { name: category.cate_name }],
                                }));
                            } else {
                                setEditedMovie((prev) => ({
                                    ...prev,
                                    movie_category_name: prev.movie_category_name.filter((c) => c.name !== category.cate_name),
                              }));
                            }
                          }}
                        />
                        {category.cate_name}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                    <Label>Quốc gia</Label>
                    <Input
                        name="movie_country"
                        defaultValue={editedMovie.movie_country || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Độ tuổi
                  </label>
                  <select
                    name="movie_age_rating"
                    value={editedMovie.movie_age_rating}
                    onChange={handleChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  >
                    <option value="">Chọn giới hạn</option>
                    <option value="T13">T13</option>
                    <option value="T16">T16</option>
                    <option value="T18">T18</option>
                    <option value="K">K</option>
                  </select>
                </div>

                <div className="col-span-2">
                    <Label>Nội dung phim</Label>
                    <Input
                        name="movie_content"
                        defaultValue={editedMovie.movie_content || ""}
                        onChange={handleChange}
                />
                </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button size="sm" onClick={handleSave}>
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditMovieModal;
