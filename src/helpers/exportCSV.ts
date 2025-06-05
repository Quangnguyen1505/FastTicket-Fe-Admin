import { Movie } from "@/types/movies";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { ShowTimes } from "@/types/showtimes";

export function exportMoviesToExcel(data: Movie[]) {
  if (!data.length) {
    toast.error("Không có dữ liệu để xuất.");
    return;
  }

  const worksheetData = data.map((movie) => ({
    "ID": movie.id || "",
    "Tên phim": movie.movie_title || "",
    "Thể loại":  (movie.movie_categories || [])
    .map(mc => mc.category.cate_name)
    .join(", "),
    "Thời lượng (phút)": movie.movie_time || "",
    "Ngày khởi chiếu": movie.movie_release_date
      ? new Date(movie.movie_release_date).toLocaleDateString("vi-VN")
      : "",
    "Nhà sản xuất": movie.movie_director || "",
    "Trạng thái": movie.movie_status || "",
    "Độ tuổi": movie.movie_age_rating || "",
    "Giá vé nhập": movie.movie_price ? `${movie.movie_price} VNĐ` : "",
    "Nội dung": movie.movie_content || "",
    "Diễn viên": movie.movie_performer || "",
    "Hình ảnh": movie.movie_image_url || "",
    "Video trailer code": movie.movie_video_trailer_code || "",
    "Quốc gia": movie.movie_country || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách phim");

  XLSX.writeFile(workbook, "danh_sach_phim.xlsx");
};

export function exportShowtimesToExcel(data: ShowTimes[]) {
  if (!data.length) {
    toast.error("Không có dữ liệu để xuất.");
    return;
  }

  const worksheetData = data.map((showtime) => ({
    "ID": showtime.id || "",
    "Phim": showtime.Movie?.movie_title || "",
    "Phòng chiếu": showtime.Room?.room_name || "",
    "Ngày chiếu": showtime.show_date
      ? new Date(showtime.show_date).toLocaleDateString("vi-VN")
      : "",
    "Giờ bắt đầu": showtime.start_time || "",
    "Giờ kết thúc": showtime.end_time || "",
    "Trạng thái": showtime.status || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách suất chiếu");

  XLSX.writeFile(workbook, "danh_sach_suat_chieu.xlsx");
}