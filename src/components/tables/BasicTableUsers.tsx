"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useAppSelector } from "@/redux/hooks";
import { User, UserRequestUpdate } from "@/types/users";
import { getAllUsers, updateUsers } from "@/services/user.service";
import EditUserModal from "./EditUserModal"; 
import { convertUserToFormData } from "@/helpers/convertUserToFormData";
import toast from "react-hot-toast";

export default function BasicTableUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getAllUsers({
        user_id: shopId,
        accessToken,
        limit: 50,
        page: 1,
      });
      setUsers(res.metadata || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [shopId, accessToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateUser = async (updatedFormData: UserRequestUpdate) => {
      try {
        if (!selectedUser) return;
        if (!shopId || !accessToken) {
          toast.error("pls register or signin!");
          return;
        }
    
        const updatedUser: User = {
            ...selectedUser,
            ...updatedFormData,
            usr_phone: Number(updatedFormData.usr_phone),
            usr_sex: Number(updatedFormData.usr_sex),
            usr_date_of_birth: new Date(updatedFormData.usr_date_of_birth),
            id: selectedUser.id,
        };  
    
        console.log("form movie ", updatedFormData )
        const formData = convertUserToFormData(updatedFormData);
        await updateUsers(shopId, accessToken, selectedUser.id, formData)
        setUsers((prev) =>
          prev.map((m) => (m.id === updatedUser.id ? updatedUser : m))
        );
        setEditModalOpen(false); 
      } catch (error) {
        console.log("error ", error);
        toast.error("Cập nhật người dùng thất bại. Vui lòng thử lại.");
      }
    };

  const getStatusBadgeColor = (status: boolean | number) => {
    return status ? "success" : "error";
  };  
  

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "Ảnh đại diện",
                  "Tên",
                  "Email",
                  "Số điện thoại",
                  "Giới tính",
                  "Ngày sinh",
                  "Địa chỉ",
                  "Vai trò",
                  "Ngày đăng ký",
                  "Trạng thái",
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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="w-14 h-14 overflow-hidden rounded-full border border-gray-200">
                      <Image
                        src={user.usr_avatar_url || "/images/user/profile.png"}
                        alt="Avatar"
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {(user.usr_first_name || "-") + " " + (user.usr_last_name || "-")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.usr_email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.usr_phone || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.usr_sex === 0
                        ? "Không xác định"
                        : user.usr_sex === 1
                        ? "Nam"
                        : "Nữ"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.usr_date_of_birth
                      ? new Date(user.usr_date_of_birth).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.usr_address || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.Role?.role_name || "Unknown"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start text-theme-sm">
                    <Badge size="sm" color={getStatusBadgeColor(user.usr_status)}>
                        {user.usr_status ? "active" : "blocked"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => toast.error("Tính năng xóa chưa hỗ trợ")}
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
      {selectedUser && (
        <EditUserModal
          isOpen={editModalOpen}
          user={selectedUser}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdateUser}
          shopId={shopId|| ""}
          accessToken={accessToken || ""}
        />
      )}
    </div>
  );
}
