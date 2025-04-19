"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { MovieUploadFormData } from "@/types/movies";
import { getAllCategory } from "@/services/category.service";
import { Category } from "@/types/categories";

interface MovieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movie: MovieUploadFormData) => void;
}

const MovieFormModal: React.FC<MovieFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [step, setStep] = useState(1);
  const [movie, setMovie] = useState<MovieUploadFormData>({
    file: null,
    movie_video_trailer_code: "",
    movie_title: "",
    movie_content: "",
    movie_time: 0,
    movie_director: "",
    movie_performer: "",
    movie_status: "",
    movie_category_name: [],
    movie_country: "",
    movie_price: 0,
    movie_release_date: "",
    movie_age_rating: "",
  });

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
      HTMLInputElement | 
      HTMLTextAreaElement | 
      HTMLSelectElement
    >
  ) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMovie({ ...movie, file: e.target.files[0] });
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSave = () => {
    onSubmit(movie);
    onClose();
    setStep(1);
    setMovie({ ...movie, movie_title: "", movie_content: "", file: null }); // Reset nếu cần
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6 lg:p-10">
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {step === 1 ? "Thông tin cơ bản" : "Thông tin bổ sung"}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {step === 1 
              ? "Nhập các thông tin cơ bản về phim"
              : "Thêm các thông tin chi tiết và hình ảnh cho phim"}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Bước 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Tên phim
                </label>
                <input
                  name="movie_title"
                  placeholder="Nhập tên phim"
                  value={movie.movie_title}
                  onChange={handleChange}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Mô tả phim
                </label>
                <textarea
                  name="movie_content"
                  placeholder="Mô tả nội dung phim"
                  value={movie.movie_content}
                  onChange={handleChange}
                  className="dark:bg-dark-900 h-32 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Đạo diễn
                  </label>
                  <input
                    name="movie_director"
                    placeholder="Nhập tên đạo diễn"
                    value={movie.movie_director}
                    onChange={handleChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Diễn viên
                  </label>
                  <input
                    name="movie_performer"
                    placeholder="Nhập tên diễn viên"
                    value={movie.movie_performer}
                    onChange={handleChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
            </>
          )}

          {/* Bước 2 */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Giá vé
                  </label>
                  <input
                    name="movie_price"
                    placeholder="Nhập giá vé"
                    value={movie.movie_price}
                    onChange={handleChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Thời lượng
                  </label>
                  <input
                    name="movie_time"
                    placeholder="Nhập thời lượng"
                    value={movie.movie_time}
                    onChange={handleChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Ngày phát hành
                  </label>
                  <input
                    name="movie_release_date"
                    type="date"
                    value={movie.movie_release_date}
                    onChange={handleChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Độ tuổi
                  </label>
                  <select
                    name="movie_age_rating"
                    value={movie.movie_age_rating}
                    onChange={handleChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="T13">T13</option>
                    <option value="T16">T16</option>
                    <option value="T18">T18</option>
                    <option value="K">K</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Tải ảnh phim
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
                {movie.file && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Ảnh đã chọn: {movie.file.name}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Bước 3 */}
          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Mã video
                  </label>
                  <input
                    name="movie_video_trailer_code"
                    placeholder="Nhập mã video"
                    value={movie.movie_video_trailer_code}
                    onChange={handleChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Quốc gia
                  </label>
                  <input
                    name="movie_country"
                    placeholder="Nhập quốc gia"
                    value={movie.movie_country}
                    onChange={handleChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
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
                          checked={movie.movie_category_name.some((c) => c.name === category.cate_name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMovie((prev) => ({
                                ...prev,
                                movie_category_name: [...prev.movie_category_name, { name: category.cate_name }],
                              }));
                            } else {
                              setMovie((prev) => ({
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
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Trạng thái
                  </label>
                  <select
                    name="movie_status"
                    value={movie.movie_status}
                    onChange={handleChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="now-showing">Đang chiếu</option>
                    <option value="upcoming-movies">Sắp chiếu</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={handlePrev}>
              Quay lại
            </Button>
          )}

          {step < 3 && (
            <Button onClick={handleNext}>
              Tiếp theo
            </Button>
          )}

          {step === 3 && (
            <Button onClick={handleSave}>
              Lưu
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MovieFormModal;
