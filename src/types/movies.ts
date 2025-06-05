export interface Movie {
    id: string;
    movie_title: string;
    movie_image_url: string;
    movie_video_trailer_code: string;
    movie_content: string;
    movie_time: number;
    movie_director: string;
    movie_performer: string;
    movie_price: number;
    movie_status: string;
    movie_country: string;
    movie_age_rating: string;
    movie_release_date: string;
    createdAt: string;
    updatedAt: string;
    movie_categories: {
      cate_id: string;
      category: {
        cate_name: string;
      };
    }[];
}

export interface GetAllMoviesResponse {
    message: string;
    status: number;
    metadata: GetAllMetadataMoviesAndCountResponse;
}

export interface GetAllMetadataMoviesAndCountResponse {
    movies: Movie[];
    totalCount: number;
}

export interface GetMovieResponse {
  message: string;
  status: number;
  metadata: Movie;
}

export interface MovieUploadFormData {
  file: File | null;
  movie_image_url?: string;
  movie_video_trailer_code: string;
  movie_title: string;
  movie_content: string;
  movie_time: number;
  movie_director: string;
  movie_performer: string;
  movie_status: string;
  movie_category_name: { name: string }[]; // Đây là JSON string nên cần parse khi nhận
  movie_country: string;
  movie_price: number;
  movie_release_date: string; // có thể để Date nếu parse sẵn
  movie_age_rating: string;
}
  