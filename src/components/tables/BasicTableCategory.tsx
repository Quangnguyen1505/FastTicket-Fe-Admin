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
import { deleteCategories, getAllCategory } from "@/services/category.service";
import { Category } from "@/types/categories";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";

export default function BasicTableCategories({
  refreshTrigger,
  onEditCategory,
}: {
  refreshTrigger: number;
  onEditCategory: (category: Category) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchAllCategories = async () => {
      const res = await getAllCategory();
      setCategories(res.metadata || []);
    };

    fetchAllCategories();
  }, [shopId, accessToken, refreshTrigger]);

  const handleDelete = async (categoryId: string) => {
    try {
        if (!shopId || !accessToken) {
            toast.error("Vui lòng đăng nhập lại!");
            return;
        }

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thể loại này?");
        if (!confirmDelete) return;

        const res = await deleteCategories(shopId, accessToken, categoryId);
        console.log("res ", res.data);
        
        toast.success("Đã xóa thể loại thành công!");
        setCategories((prev) =>
            prev.filter((category) => category.id !== categoryId)
        );
    } catch (error) {
        console.log("error ", error);
        toast.error("Xóa thể loại thất bại. Vui lòng thử lại.");
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
                  Slug
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
                  Ngày tạo
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ngày kết thúc
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
              {categories.map((categories) => (
                <TableRow key={categories.id}>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {categories.cate_name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {categories.cate_slug}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {categories.cate_description}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {new Date(categories.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {new Date(categories.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start">
                    <div className="flex space-x-4">
                    <button
                      onClick={() => onEditCategory(categories)}                    
                      className=" mr-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(categories.id)}
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
