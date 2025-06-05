"use client"; // Đảm bảo là trang client-side

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { ShowTimes } from "@/types/showtimes";
import { EventInput } from "@fullcalendar/core/index.js";
import { deleteShowTimes, getShowTimeByMovieId } from "@/services/showtimes";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";

interface CalendarEvent extends EventInput {
  movieId: string;
  extendedProps: {
    calendar: string;
    roomId?: string;
    showTimeId?: string;
  };
}
   

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  showtime: ShowTimes | null;
  onUpdate: (event: CalendarEvent) => void;
}

const EditShowTimeModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, event, showtime, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [level, setLevel] = useState("");
  const [showDate, setShowDate] = useState("");
  const [roomName, setRoomName] = useState("");
  const [showTimes, setShowTimes] = useState<ShowTimes[]>([]);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  const calendarsEvents = {
    Success: "Đang chiếu",
    Warning: "Đã chiếu",
  };

  useEffect(() => {
    if (event && showtime) {
      setTitle(event.title || showtime.Movie.movie_title);  
      setStart(showtime.start_time); 
      setEnd(showtime.end_time);  
      setLevel(event.extendedProps?.calendar || "");
      setShowDate(showtime.show_date || "");
      setRoomName(showtime.Room.room_name || "");
    }
    
  }, [event, showtime]);

  useEffect(() => {
    if(!showtime?.movie_id) return;
    const fetchShowTimeByMovieId = async () => {
      console.log("showtime?.movie_id ",showtime?.movie_id );
      
      const res = await getShowTimeByMovieId(showtime?.movie_id || "", showtime?.show_date || "");
      setShowTimes(res.metadata || []);
    };
    fetchShowTimeByMovieId();
  }, [showtime?.movie_id, showtime?.show_date]);

  const handleSubmit = () => {
    if (event) {
      onUpdate({ ...event, title, start, end, extendedProps: { ...event.extendedProps, calendar: level } });
      onClose();
    }
  };

  const handleDeleteShowtime = async (showtimeId: string) => {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xoá lịch chiếu này?");
    if (!confirmDelete) return;
  
    try {
      if (!shopId || !accessToken) {
        console.error("Shop ID or access token is missing");
        return;
      }
      await deleteShowTimes(shopId, accessToken, showtimeId);
      toast.success("Xoá lịch chiếu thành công");
      setShowTimes((prev) => prev.filter((s) => s.id !== showtimeId));
    } catch (error) {
      console.error("Lỗi khi xoá lịch chiếu:", error);
      toast.error("Không thể xoá lịch chiếu. Vui lòng thử lại.");
    }
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6 lg:p-10">
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Thông Tin/Chỉnh sửa suất chiếu
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
          Lên kế hoạch cho khoảnh khắc quan trọng tiếp theo của bạn: lên lịch hoặc chỉnh sửa lịch chiếu để đi đúng hướng
          </p>
        </div>

        <div className="mt-8">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Phim
            </label>
            <input
              id="event-title"
              type="text"
              value={title}
              readOnly
              onChange={(e) => setTitle(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Phòng
            </label>
            <input
              id="event-room"
              type="text"
              value={roomName || ""}
              readOnly
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Ngày chiếu
            </label>
            <input
              id="event-show-date"
              type="date"
              value={showDate}
              onChange={(e) => setShowDate(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
            Trạng thái
          </label>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            {Object.entries(calendarsEvents).map(([key, label]) => (
              <div key={key} className="n-chk">
                <div className={`form-check form-check-${key.toLowerCase()} form-check-inline`}>
                  <label
                    className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                    htmlFor={`modal${key}`}
                  >
                    <span className="relative">
                      <input
                        className="sr-only form-check-input"
                        type="radio"
                        name="event-level"
                        value={key}
                        id={`modal${key}`}
                        checked={level === key}
                        disabled // <- Không cho chỉnh
                        readOnly
                      />
                      <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                        <span
                          className={`h-2 w-2 rounded-full bg-white ${
                            level === key ? "block" : "hidden"
                          }`}
                        ></span>
                      </span>
                    </span>
                    {label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Lịch chiếu
          </label>
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
            {showTimes.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Vui lòng đợi trong giây lát...</p>
            ) : (
              showTimes.map((item) => (
                <div
                  key={item.id}
                  className="relative p-3 border border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <button
                    onClick={() => handleDeleteShowtime(item.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600 dark:hover:text-red-500"
                    title="Xoá lịch chiếu"
                  >
                    ✕
                  </button>
                  <div className="text-sm text-gray-800 dark:text-white font-medium">
                    Ngày: {item.show_date}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Giờ chiếu: {item.start_time} - {item.end_time}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Phòng: {item.Room?.room_name}
                  </div>
                </div>
              ))       
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
        <button
          onClick={onClose}
          type="button"
          className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
        >
          Close
        </button>
        <button
          onClick={handleSubmit}
          type="button"
          className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
        >
          Update Changes
        </button>
      </div>
    </Modal>
  );
};

export default EditShowTimeModal;
