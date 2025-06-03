"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Room } from "@/types/rooms";
import { getAllRooms } from "@/services/rooms.service";
import { getAllMovies } from "@/services/movies.service";
import { Movie } from "@/types/movies";
import { getAllShowTimes } from "@/services/showtimes";
import { ShowTimeRequestData, ShowTimes } from "@/types/showtimes";
import { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { getAllSeatType } from "@/services/seatType.service";
import { SeatType } from "@/types/seat-type";


interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: ShowTimeRequestData) => void;
  initialStart?: string;
  initialEnd?: string;
}

const AddShowTimeModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showtimes, setShowTimes] = useState<ShowTimes[]>([]);
  const [nameTypes, setNameTypes] = useState<SeatType[]>([]);
  const [surchargeData, setSurchargeData] = useState<{ [key: string]: number }>({});

  const [rooms, setRooms] = useState<Room[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchAllRooms = async () => {
      try {
        const resRooms = await getAllRooms({ limit: 50 });
        setRooms(resRooms.metadata);
      } catch (error) {
        console.error("Error fetching showtimes", error);
      }
    };

    const fetchAllMovies = async () => {
      try {
        const resMovies = await getAllMovies({ limit: 50 });
        setMovies(resMovies.metadata);
      } catch (error) {
        console.error("Error fetching showtimes", error);
      } 
    };

    const fetchNameTypes = async () => {
      try {
        const res = await getAllSeatType();
        setNameTypes(res.metadata);
        // Khởi tạo các trường surcharge mặc định 0
        const initialSurcharge: { [key: string]: number } = {};
        res.metadata.forEach((type: SeatType) => {
          initialSurcharge[type.name] = 0;
        });
        setSurchargeData(initialSurcharge);
      } catch (error) {
        console.error("Error fetching name types", error);
      }
    };

    fetchAllRooms();
    fetchAllMovies();
    fetchNameTypes();
  }, []);

  useEffect(() => {
    const isValidDate = /^20\d{2}-\d{2}-\d{2}$/.test(showDate) && !isNaN(new Date(showDate).getTime());

    if (!isValidDate || !showDate) return;
    console.log("Ngày chiếu được chọn:", isValidDate);
    const fetchAllShowTimeByShowDate = async () => {
      try {
        const resShowTimes = await getAllShowTimes({ user_id: shopId, accessToken, limit: 50, show_date: showDate });
        setShowTimes(resShowTimes.metadata);
      } catch (error) {
        console.error("Error fetching showtimes", error);
      }
    }
    fetchAllShowTimeByShowDate();
  }, [accessToken, shopId, showDate]);

  const roomsHasSelectedMovie = useMemo(() => {
    return showtimes
      .filter((show) => show.movie_id === selectedMovie)
      .map((show) => show.room_id);
  }, [showtimes, selectedMovie]);

  const isSelectedMovieInOtherRoom = useMemo(() => {
    return (
      selectedMovie &&
      roomsHasSelectedMovie.length > 0 &&
      selectedRoom &&
      !roomsHasSelectedMovie.includes(selectedRoom)
    );
  }, [selectedMovie, selectedRoom, roomsHasSelectedMovie]);
  
  const roomsHasOtherMovie = useMemo(() => {
    if (!selectedMovie) return [];
  
    return showtimes.reduce<string[]>((acc, show) => {
      if (show.movie_id !== selectedMovie) {
        acc.push(show.room_id);
      }
      return acc;
    }, []);
  }, [showtimes, selectedMovie]);

  const overlappingRoomIds = useMemo(() => {
    if (!start || !end) return [];
  
    const selectedStart = new Date(`${showDate}T${start}:00`);
    const selectedEnd = new Date(`${showDate}T${end}:00`);
  
    return showtimes
      .filter((show) => {
        const existingStart = new Date(`${showDate}T${show.start_time}`);
        const existingEnd = new Date(`${showDate}T${show.end_time}`);
  
        // Kiểm tra nếu thời gian mới bị giao với suất cũ
        return (
          (selectedStart < existingEnd && selectedEnd > existingStart)
        );
      })
      .map((show) => show.room_id);
  }, [showtimes, start, end, showDate]);
  

  const handleSubmit = () => {
    if (!showDate || !start || !end || !selectedMovie || !selectedRoom) {
      return;
    }
  
    const payload: ShowTimeRequestData = {
      show_date: showDate,             
      start_time: start + ":00",           
      end_time: end + ":00",
      movie_id: selectedMovie,
      room_id: selectedRoom,
      surcharge_seat: Object.keys(surchargeData).map((name_type) => ({
        name_type,
        surcharge: Number(surchargeData[name_type] || 0),
      })),
    };
  
    onAdd(payload); // callback gửi ra ngoài
    onClose();      // đóng modal
  };
   

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6 lg:p-10">
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
            Thêm mới suất chiếu
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lên kế hoạch cho phim sắp chiếu của bạn bằng cách điền thông tin suất chiếu bên dưới.
          </p>
        </div>

        {/* Select Movie */}
        <div className="mt-8">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Tên phim
          </label>
          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="">Chọn phim</option>
            {movies.map((movie) => {
              return (
                <option key={movie.id} value={movie.id}>
                  {movie.movie_title}
                </option>
              );
            })}
          </select>
        </div>

        {/* Select Room */}
        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Phòng chiếu
          </label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="">Chọn phòng</option>
            {rooms.map((room) => {
              const isScheduled = overlappingRoomIds.includes(room.id);
              const hasOtherMovie = roomsHasOtherMovie.includes(room.id);
              return (
                <option key={room.id} value={room.id}>
                  {isScheduled || hasOtherMovie ? "⚠️ " : ""}{room.room_name}
                  {hasOtherMovie ? " (đã có phim khác)" : ""}
                </option>
              );
            })}
          </select>
          {selectedRoom && roomsHasOtherMovie.includes(selectedRoom) && (
            <p className="text-sm text-red-500 mt-2">
              ⚠️ Phòng này hiện đã có phim khác chiếu
            </p>
          )}
          {isSelectedMovieInOtherRoom && (
            <p className="text-sm text-red-500 mt-2">
              ⚠️ Phim này đã có suất chiếu trong ngày ở phòng khác. Bạn có chắc muốn chọn phòng này không?
            </p>
          )}
        </div>

        {/* Show Date */}
        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Ngày chiếu
          </label>
          <input
            type="date"
            value={showDate}
            onChange={(e) => setShowDate(e.target.value)}
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        {/* Start & End Time */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Giờ bắt đầu
            </label>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Giờ kết thúc
            </label>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>

        <div className="mt-6">
          <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Phụ thu theo loại ghế</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {nameTypes.map((type) => (
              <div key={type.name}>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 capitalize">
                  {type.name}
                </label>
                <input
                  type="number"
                  value={surchargeData[type.name] || 0}
                  onChange={(e) =>
                    setSurchargeData({ ...surchargeData, [type.name]: Number(e.target.value) })
                  }
                  className="h-10 w-full rounded border px-3 text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
        <button
          onClick={onClose}
          className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="btn btn-success flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
          disabled={roomsHasOtherMovie.includes(selectedRoom)}
        >
          Thêm suất chiếu
        </button>
      </div>
    </Modal>
  );
};

export default AddShowTimeModal;