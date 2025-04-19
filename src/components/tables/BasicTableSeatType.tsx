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
import { SeatType } from "@/types/seat-type";
import { deleteSeatTypes, getAllSeatType } from "@/services/seatType.service";

export default function BasicTableSeatTypes({
  refreshTrigger,
  onEditSeatTypes,
}: {
  refreshTrigger: number;
  onEditSeatTypes: (seatType: SeatType) => void;
}) {
  const [seatTypes, setSeatType] = useState<SeatType[]>([]);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchAllSeatTypes = async () => {
      const res = await getAllSeatType();
      setSeatType(res.metadata || []);
    };

    fetchAllSeatTypes();
  }, [shopId, accessToken, refreshTrigger]);

  const handleDelete = async (seatTypeId: string) => {
    try {
        if (!shopId || !accessToken) {
            alert("Vui lòng đăng nhập lại!");
            return;
        }

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thể loại này?");
        if (!confirmDelete) return;

        const res = await deleteSeatTypes(shopId, accessToken, seatTypeId);
        console.log("res ", res.data);
        
        alert("Đã xóa thể loại thành công!");
        setSeatType((prev) =>
            prev.filter((seatType) => seatType.id !== seatTypeId)
        );
    } catch (error) {
        console.log("error ", error);
        alert("Xóa thể loại thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tên
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Mô tả
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {seatTypes.map((seatType) => (
                <TableRow key={seatType.id}>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {seatType.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {seatType.description}
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start">
                    <div className="flex space-x-4">
                    <button
                      onClick={() => onEditSeatTypes(seatType)}                    
                      className=" mr-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(seatType.id)}
                      className="text-red-500 hover:text-red-700"
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
    </div>
  );
}
