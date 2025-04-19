"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useAppSelector } from "@/redux/hooks";
import { Role } from "@/types/roles";
import { createRoles, updateRoles } from "@/services/roles.service";
import BasicTableRoles from "@/components/tables/BasicTableRole";

export default function BasicTables() {
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // <- true: sửa, false: thêm
  const [roles, setRoles] = useState<Role | null>(null);
  
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [roleActive, setRoleActive] = useState("");
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setEditMode(false);
    setRoles(null);
    setRoleName("");
    setRoleDescription("");
    setRoleActive("");
  }; 

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleActive(e.target.value);
  };
  
  
  const handleSaveCategory = async () => {
    if (!shopId || !accessToken || roleName.trim() === "") return;

    const roleData = {
        role_name: roleName,
        role_status: roleActive,
        role_description: roleDescription,
    };

    try {
      if (editMode && roles) {
        await updateRoles(shopId, accessToken, roles.id, roleData);
      } else {
        await createRoles(shopId, accessToken, roleData);
      }
      
      setRefreshTrigger((prev) => prev + 1);
      closeModal();
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Error saving role:", error);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Vai trò" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex items-center gap-10">
              <span className="text-base font-semibold">Thông Tin Vai Trò</span>
              <Button size="sm" variant="primary" onClick={openModal}>
                Thêm vai trò +
              </Button>
            </div>
          }
        >
          <BasicTableRoles refreshTrigger={refreshTrigger} onEditRole={(role) => {
            setEditMode(true);
            setRoles(role);
            setRoleName(role.role_name);
            setRoleDescription(role.role_description || "");
            setRoleActive(role.role_status || "");
            openModal();
          }} />
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
                {editMode ? "Chỉnh sửa vai trò" : "Thêm vai trò"}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                {editMode
                    ? "Chỉnh sửa thông tin vai trò bên dưới"
                    : "Nhập tên vai trò bạn muốn thêm vào hệ thống"}
                </p>
            </div>
            <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tên vai trò
                </label>
                <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Ví dụ: "
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
            </div>

            <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Mô tả
                </label>
                <input
                    type="text"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Ví dụ: "
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
            </div>

            <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Trạng thái
                </label>
                <select
                    name="role_status"
                    value={roleActive}
                    onChange={handleChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                    <option value="">Chọn trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="block">Chặn</option>
                </select>
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
              onClick={handleSaveCategory}
              type="button"
              className="btn btn-success flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {editMode ? "Cập nhật" : "Thêm vai trò"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
