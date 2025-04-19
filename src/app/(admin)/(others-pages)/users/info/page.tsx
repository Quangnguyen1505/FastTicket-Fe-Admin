"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { UserRequestCreate } from "@/types/users";
import { useAppSelector } from "@/redux/hooks";
import BasicTableUsers from "@/components/tables/BasicTableUsers";
import { Modal } from "@/components/ui/modal";
import { addUsers } from "@/services/user.service";

export default function BasicTables() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddUser = async () => {
    try {
        if (!shopId || !accessToken) {
          console.error("Thiếu shopId hoặc accessToken.");
          return;
        }
    
        const userPayload: UserRequestCreate = {
            email: userName,
            password: password,
        };
    
        await addUsers(shopId, accessToken, userPayload); 
    
        closeModal();
      } catch (error) {
        console.error("Lỗi khi thêm người dùng:", error);
      }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Người Dùng" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex items-center gap-10">
              <span className="text-base font-semibold">Thông Tin Người Dùng</span>
              <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
                Thêm người dùng +
              </Button>
            </div>
          }
        >
          <BasicTableUsers />
        </ComponentCard>
      </div>

    <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="max-w-[600px] p-6 lg:p-10"
    >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                Thêm người dùng
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Nhập tài khoản và mật khẩu bạn muốn thêm vào hệ thống
            </p>
        </div>
        <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Tài khoản
            </label>
            <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ví dụ: Hành động, Tình cảm, Hoạt hình..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
        </div>

        <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Mật khẩu
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ví dụ: Thể loại này nói về những bộ phim..."
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
            onClick={handleAddUser}
            type="button"
            className="btn btn-success flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto">Thêm người dùng</button>
        </div>
        </div>
    </Modal>
    </div>
  );
}
