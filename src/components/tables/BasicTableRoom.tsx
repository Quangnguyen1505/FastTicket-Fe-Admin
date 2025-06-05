"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useAppSelector } from "@/redux/hooks";
import { Room } from "@/types/rooms";
import { deleteRooms, getAllRooms } from "@/services/rooms.service";
import toast from "react-hot-toast";

export default function BasicTableRooms({
  refreshTrigger,
  onEditRoom,
}: {
  refreshTrigger: number;
  onEditRoom: (room: Room) => void;
}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchAllRooms = async () => {
      const res = await getAllRooms({limit: 50, page: 1});
      console.log("res ", res);
      setRooms(res.metadata || []);
    };

    fetchAllRooms();
  }, [shopId, accessToken, refreshTrigger]);

  const handleDelete = async (roomId: string) => {
    try {
      if (!shopId || !accessToken) {
        toast.error("Vui lòng đăng nhập lại!");
        return;
      }

      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
      if (!confirmDelete) return;

      const res = await deleteRooms(shopId, accessToken, roomId);
      console.log("res ", res.data);

      toast.success("Đã xóa phòng thành công!");
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
    } catch (error) {
      console.log("error ", error);
      toast.error("Xóa phòng thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tên</TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tổng số ghế</TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Trạng thái</TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Ngày phát hành</TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Loại ghế</TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Thao tác</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">{room.room_name}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">{room.room_seat_quantity}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">{room.room_status ? "Đang hoạt động" : "Không hoạt động"}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {new Date(room.room_release_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {room.Room_seat_types.map((type) => type.Seat_type.name).join(", ")}
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start">
                    <div className="flex space-x-4">
                      <button onClick={() => onEditRoom(room)} className="mr-2 text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(room.id)} className="text-red-500 hover:text-red-700">
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
    </div>
  );
}
