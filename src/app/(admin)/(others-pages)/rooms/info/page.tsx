"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useAppSelector } from "@/redux/hooks";
import { Room, RoomRequestData } from "@/types/rooms";
import { createRooms, updateRooms } from "@/services/rooms.service";
import BasicTableRooms from "@/components/tables/BasicTableRoom";
import { getAllSeatType } from "@/services/seatType.service";
import { SeatType } from "@/types/seat-type";

type RoomSeatType = {
  type: string;
  quantity: number;
};

export default function BasicTables() {
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State cho các input
  const [roomName, setRoomName] = useState("");
  const [roomSeatTypes, setRoomSeatTypes] = useState<RoomSeatType[]>([]);
  const [roomSeatQuantity, setRoomSeatQuantity] = useState("");
  const [roomReleaseDate, setRoomReleaseDate] = useState("");
  const [seatTypes, setseatTypes] = useState<SeatType[]>([]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setEditMode(false);
    setRoom(null);
    setRoomName("");
    setRoomSeatTypes([]);
    setRoomSeatQuantity("");
    setRoomReleaseDate("");
  };

  useEffect(() => {
      const fetchSeatTypes = async () => {
        try {
          const res = await getAllSeatType()
          setseatTypes(res.metadata || []);
        } catch (error) {
          console.error("Lỗi khi tải thể loại:", error);
        }
      };
    
      fetchSeatTypes();
    }, []);

    const handleSaveRoom = async () => {
      if (!shopId || !accessToken) return;
    
      const roomData: RoomRequestData = {
        room_name: roomName,
        room_seat: roomSeatTypes.map((type) => ({
          type: type.type,
          quantity: type.quantity,
        })),
        room_seat_quantity: roomSeatTypes.reduce((total, curr) => total + curr.quantity, 0),
        room_release_date: new Date(roomReleaseDate),
      };
    
      try {
        if (editMode && room) {
          await updateRooms(shopId, accessToken, room.id, roomData);
        } else {
          // console.log("room data ", roomData)
          await createRooms(shopId, accessToken, roomData);
        }
    
        setRefreshTrigger((prev) => prev + 1);
        closeModal();
      } catch (error) {
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
        console.error("Error saving room:", error);
      }
    };
    
    
    const handleEditRoom = (room: Room) => {
      setEditMode(true);
      setRoom(room);
      setRoomName(room.room_name);
      setRoomSeatTypes(
        (room.Room_seat_types || []).map((item) => ({
          type: item.Seat_type.name,
          quantity: 0,
        }))
      );
      setRoomSeatQuantity(room.room_seat_quantity?.toString() || "");
      setRoomReleaseDate(
        room.room_release_date
          ? new Date(room.room_release_date).toISOString().split("T")[0]
          : ""
      );      
      openModal();
    };    
    

  return (
    <div>
      <PageBreadcrumb pageTitle="Phòng" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex items-center gap-10">
              <span className="text-base font-semibold">Thông Tin Phòng</span>
              <Button size="sm" variant="primary" onClick={openModal}>
                Thêm Phòng +
              </Button>
            </div>
          }
        >
          <BasicTableRooms
            refreshTrigger={refreshTrigger}
            onEditRoom={handleEditRoom}
          />
        </ComponentCard>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {editMode ? "Chỉnh sửa phòng" : "Thêm phòng"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {editMode
                ? "Chỉnh sửa thông tin phòng bên dưới"
                : "Nhập tên phòng bạn muốn thêm vào hệ thống"}
            </p>
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tên phòng
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Ví dụ: Phòng 1"
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Chọn loại ghế và số lượng
            </label>
            {seatTypes && seatTypes.map((seat) => {
              const value = roomSeatTypes.find((item) => item.type === seat.name)?.quantity || "";
              return (
                <div key={seat.id} className="flex items-center gap-4">
                  <span className="min-w-[80px] capitalize">{seat.name}</span>
                  <input
                    type="number"
                    placeholder="Số lượng"
                    value={value}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value || "0");
                      setRoomSeatTypes((prev) => {
                        const exists = prev.find((item) => item.type === seat.name);
                        if (exists) {
                          return prev.map((item) =>
                            item.type === seat.name ? { ...item, quantity: qty } : item
                          );
                        }
                        return [...prev, { type: seat.name, quantity: qty }];
                      });
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tổng số ghế
            </label>
            <input
              type="number"
              value={roomSeatQuantity}
              onChange={(e) => setRoomSeatQuantity(e.target.value)}
              placeholder="Ví dụ: 100"
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Ngày phát hành
            </label>
            <input
              type="date"
              value={roomReleaseDate}
              onChange={(e) => setRoomReleaseDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={handleSaveRoom}
              type="button"
              className="btn btn-success flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {editMode ? "Cập nhật" : "Thêm Phòng"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
