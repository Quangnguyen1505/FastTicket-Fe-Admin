"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
import { Snack, SnackRequestUpdate } from "@/types/snack";
import { deleteSnacks, getAllSnack, updateSnack } from "@/services/snack.service";
import EditSnackModal from "../modal/EditSnackModal";
import { convertSnackUpdateFormData } from "@/helpers/convertSnackFormData";

export default function BasicTableSnack({
    refreshTrigger
}: {
    refreshTrigger: number;
}) {
    const [snacks, setSnacks] = useState<Snack[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  const fetchSnacks = useCallback(async () => {
    try {
      console.log('refreshTrigger changed:', refreshTrigger);
      if(!shopId || !accessToken) return;
      const res = await getAllSnack(shopId, accessToken);
      setSnacks(res.metadata.snacks || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [shopId, accessToken, refreshTrigger]);

  useEffect(() => {
    fetchSnacks();
  }, [fetchSnacks]);

  const handleEdit = (snack: Snack) => {
    setSelectedSnack(snack);
    setEditModalOpen(true);
  };

  const handleDelete = async (snackId: string) => {
    try {
      if (!shopId || !accessToken) {
        toast.error("Vui lòng đăng nhập lại!");
        return;
      }

      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
      if (!confirmDelete) return;

      const res = await deleteSnacks(shopId, accessToken, snackId);
      console.log("res ", res.data);

      toast.success("Đã xóa snack thành công!");
      setSnacks((prev) => prev.filter((snack) => snack.id !== snackId));
    } catch (error) {
      console.log("error ", error);
      toast.error("Xóa phòng thất bại. Vui lòng thử lại.");
    }
  }

  const handleUpdateSnack = async (updatedFields: Partial<SnackRequestUpdate>) => {
    if (!shopId || !accessToken || !selectedSnack) {
      toast.error("Vui lòng đăng nhập lại!");
      return;
    }

    try {
      const newFormData = convertSnackUpdateFormData(updatedFields);
      await updateSnack(shopId, accessToken, selectedSnack.id, newFormData);

      toast.success("Cập nhật thành công!");

      // ✅ Cập nhật snack trong danh sách
      setSnacks((prevSnacks) =>
        prevSnacks.map((snack) =>
          snack.id === selectedSnack.id
            ? {
                ...snack,
                ...updatedFields,
                quantity_available:
                  updatedFields.quantity_available !== undefined
                    ? String(updatedFields.quantity_available)
                    : snack.quantity_available,
                category:
                  updatedFields.category !== undefined && updatedFields.category !== null
                    ? String(updatedFields.category)
                    : snack.category,
              }
            : snack
        )
      );

      setEditModalOpen(false);
    } catch (error) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
      console.error("Update error:", error);
    }
  };


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "Tên sản phẩm",
                  "Giá",
                  "Ảnh",
                  "Số lượng sẳn sàng",
                  "thể loại",
                  "Hành động",
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {snacks.map((snack) => (
                <TableRow key={snack.id}>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {snack.item_name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {snack.item_price} VNĐ  
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="w-14 h-14 overflow-hidden rounded-full border border-gray-200">
                      <Image
                        src={snack.item_image_url || "/images/user/profile.png"}
                        alt="snacks"
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {snack.quantity_available || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {snack.category || "-"}
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEdit(snack)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(snack.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete"
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

      {/* Modal chỉnh sửa nếu cần */}
      {selectedSnack && (
        <EditSnackModal
          isOpen={editModalOpen}
          snack={selectedSnack}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdateSnack}
        />
      )} 
    </div>
  );
}
