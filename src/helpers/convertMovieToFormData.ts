import { MovieUploadFormData } from "@/types/movies";

export function convertMovieToFormData(movie: MovieUploadFormData): FormData {
  const formData = new FormData();

  if (movie.file instanceof File) {
    formData.append('file', movie.file);
  }
  formData.append("movie_title", movie.movie_title);
  formData.append("movie_video_trailer_code", movie.movie_video_trailer_code);
  formData.append("movie_content", movie.movie_content);
  formData.append("movie_time", movie.movie_time.toString());
  formData.append("movie_director", movie.movie_director);
  formData.append("movie_performer", movie.movie_performer);
  formData.append("movie_status", movie.movie_status);
  formData.append("movie_category_name", JSON.stringify(movie.movie_category_name));
  formData.append("movie_country", movie.movie_country);
  formData.append("movie_price", movie.movie_price.toString());
  formData.append("movie_release_date", movie.movie_release_date);
  formData.append("movie_age_rating", movie.movie_age_rating);

  return formData;
}
