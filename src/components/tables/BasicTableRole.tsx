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
import { Role } from "@/types/roles";
import { deleteRoles, getAllRoles } from "@/services/roles.service";
import Badge from "../ui/badge/Badge";
import toast from "react-hot-toast";

export default function BasicTableRoles({
  refreshTrigger,
  onEditRole,
}: {
  refreshTrigger: number;
  onEditRole: (role: Role) => void;
}) {
  const [roles, setRoles] = useState<Role[]>([]);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if(!shopId || !accessToken) {
        return
    }
    const fetchAllRoles = async () => {
      const res = await getAllRoles(shopId, accessToken);
      setRoles(res.metadata || []);
    };

    fetchAllRoles();
  }, [shopId, accessToken, refreshTrigger]);

  const getStatusBadgeColor = (status: string) => {
    const statusColors = {
      "active": "success",
      "block": "warning",
      expired: "error",
    } as const;
  
    return statusColors[status as keyof typeof statusColors] || "error";
  };

  const handleDelete = async (roleId: string) => {
    try {
        if (!shopId || !accessToken) {
            toast.error("Vui lòng đăng nhập lại!");
            return;
        }

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thể loại này?");
        if (!confirmDelete) return;

        const res = await deleteRoles(shopId, accessToken, roleId);
        console.log("res ", res.data);
        
        toast.success("Đã xóa thể loại thành công!");
        setRoles((prev) =>
            prev.filter((role) => role.id !== roleId)
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
                  Trạng thái
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
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {role.role_name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {role.role_slug}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {role.role_description}
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start text-theme-sm">
                    <Badge
                      size="sm"
                      color={getStatusBadgeColor(role.role_status)}
                    >
                      {role.role_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start">
                    <div className="flex space-x-4">
                    <button
                      onClick={() => onEditRole(role)}                    
                      className=" mr-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
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
