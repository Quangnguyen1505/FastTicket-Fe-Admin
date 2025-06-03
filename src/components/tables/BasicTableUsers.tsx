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
import { getAllUsers, searchUsers, updateUsers } from "@/services/user.service";
import EditUserModal from "./EditUserModal"; 
import { convertUserToFormData } from "@/helpers/convertUserToFormData";
import toast from "react-hot-toast";
import Pagination from "./Pagination";
import { useSearch } from "@/contexts/SearchContext";

export default function BasicTableUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const { context, searchTerm } = useSearch();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect( () => {
      if(!shopId || !accessToken) {
        toast.error("Vui lòng đăng nhập hoặc đăng ký để tiếp tục!");
        return;
      }
      if (context === "users" && searchTerm) {
        console.log("Filtering users with search term:", searchTerm);
        const fetchUsers = async () => {
          const res = await searchUsers(shopId, accessToken, searchTerm);
          console.log("Filtered users:", res);
          setFilteredUsers(res.metadata.users || []);
        }

        fetchUsers();
      } else {
        setFilteredUsers(users);
      }
    }, [context, searchTerm, users]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getAllUsers({
        user_id: shopId,
        accessToken,
        limit: 50,
        page: currentPage,
      });
      console.log("Fetched users:", res);
      setUsers(res.metadata.users || []);
      setFilteredUsers(res.metadata.users || []);
      setTotalPages(Math.ceil(res.metadata.totalCount / 10));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [shopId, accessToken, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, currentPage]);

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
        setFilteredUsers((prev) =>
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
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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
              {filteredUsers.map((user) => (
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

      <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
      </div>
      <div className="mb-4"></div>
    </div>
  );
}
