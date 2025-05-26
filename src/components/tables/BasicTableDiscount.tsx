"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
import { Discount, DiscountRequestUpdate } from "@/types/discount"; // Đảm bảo đã có type Discount
import { deleteDiscount, getAllDiscount, updateDiscount } from "@/services/discount.service"; // Đảm bảo đã tạo service
import EditDiscountModal from "../modal/EditDiscountModal";

export default function BasicTableDiscount({
  refreshTrigger,
  allMovies,
}: {
  refreshTrigger: number;
  allMovies: { id: string; title: string }[];
}) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  const fetchDiscounts = useCallback(async () => {
    try {
      if (!shopId || !accessToken) return;
      const res = await getAllDiscount(shopId, accessToken);
      setDiscounts(res.metadata.discounts || []);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      toast.error("Lỗi khi tải danh sách mã giảm giá");
    }
  }, [shopId, accessToken, refreshTrigger]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleEdit = (discount: Discount) => {
    console.log("discount ", discount)
    setSelectedDiscount(discount);
    setEditModalOpen(true);
  };

  const handleDelete = async (discountId: string) => {
    try {
      if (!shopId || !accessToken) {
        toast.error("Vui lòng đăng nhập lại!");
        return;
      }

      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?");
      if (!confirmDelete) return;

      await deleteDiscount(shopId, accessToken, discountId);
      toast.success("Đã xóa mã giảm giá thành công!");
      setDiscounts((prev) => prev.filter((d) => d.id !== discountId));
    } catch (error) {
      console.error("Error deleting discount:", error);
      toast.error("Xóa mã giảm giá thất bại. Vui lòng thử lại.");
    }
  };

  const handleUpdateDiscount = async (updatedFields: Partial<DiscountRequestUpdate>) => {
    if (!shopId || !accessToken || !selectedDiscount) {
      toast.error("Vui lòng đăng nhập lại!");
      return;
    }

    try {
      const res = await updateDiscount(
        shopId,
        accessToken,
        selectedDiscount.id,
        updatedFields
      );

      const updatedDiscount = res.metadata;
      console.log("updatedDiscount ", updatedDiscount)

      const mergedDiscount = {
        ...selectedDiscount,
        ...updatedFields,
      };

      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((d) =>
          d.id === selectedDiscount.id ? (updatedDiscount ?? mergedDiscount) : d
        )
      );

      toast.success("Cập nhật mã giảm giá thành công!");
      setEditModalOpen(false);
      setSelectedDiscount(null);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi cập nhật mã giảm giá.");
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
                  "Tên mã",
                  "Mã giảm giá",
                  "Giá trị",
                  "Loại",
                  "Ngày bắt đầu",
                  "Ngày kết thúc",
                  "Số lượt dùng",
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
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {discount.discount_name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {discount.discount_code}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {discount.discount_value}
                    {discount.discount_type === "PERCENTAGE" ? "%" : "VNĐ"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {discount.discount_type === "PERCENTAGE" 
                      ? "Phần trăm" 
                      : "Giảm trực tiếp"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {new Date(discount.discount_start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {new Date(discount.discount_end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {discount.discount_max_uses}
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEdit(discount)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(discount.id)}
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

      {/* Modal chỉnh sửa - Cần implement riêng */}
      {editModalOpen && selectedDiscount && (
        <EditDiscountModal
          isOpen={editModalOpen}
          discount={selectedDiscount}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdateDiscount}
          movies={allMovies}
        />
      )}
    </div>
  );
}