"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useAppSelector } from "@/redux/hooks";
import { SeatTypeRequestEdit } from "@/types/seat-type";
import { createSeatTypes, updateSeatTypes } from "@/services/seatType.service";
import BasicTableSeatTypes from "@/components/tables/BasicTableSeatType";
import toast from "react-hot-toast";

export default function BasicTables() {
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // <- true: sửa, false: thêm
  const [editingSeatTypes, setEditingSeatTypes] = useState<SeatTypeRequestEdit | null>(null);
  
//   const [categoryName, setCategoryName] = useState("");
  const [seatTypesName, setSeatTypesName] = useState("");
//   const [categoryDescription, setCategoryDescription] = useState("");
const [seatTypesDescription, setSeatTypesDescription] = useState("");
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setEditMode(false);
    setEditingSeatTypes(null);
    setSeatTypesName("");
    setSeatTypesDescription("");
  };  
  
  const handleSaveCategory = async () => {
    if (!shopId || !accessToken || seatTypesName.trim() === "") return;

    const seatTypesData = {
        name: seatTypesName,
        description: seatTypesDescription,
    };

    try {
      if (editMode && editingSeatTypes) {
        await updateSeatTypes(shopId, accessToken, editingSeatTypes.id, seatTypesData);
      } else {
        await createSeatTypes(shopId, accessToken, seatTypesData);
      }
      
      setRefreshTrigger((prev) => prev + 1);
      closeModal();
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Error saving category:", error);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Kiểu ghế" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex items-center gap-10">
              <span className="text-base font-semibold">Thông Tin Kiểu Ghế</span>
              <Button size="sm" variant="primary" onClick={openModal}>
                Thêm kiểu ghế +
              </Button>
            </div>
          }
        >
          <BasicTableSeatTypes refreshTrigger={refreshTrigger} onEditSeatTypes={(seatType) => {
            setEditMode(true);
            setEditingSeatTypes(seatType);
            setSeatTypesName(seatType.name);
            setSeatTypesDescription(seatType.description || "");
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
              {editMode ? "Chỉnh sửa kiểu ghế" : "Thêm kiểu ghế"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {editMode
                ? "Chỉnh sửa thông tin kiểu ghế bên dưới"
                : "Nhập tên kiểu ghế bạn muốn thêm vào hệ thống"}
            </p>
          </div>
          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tên kiểu ghế
            </label>
            <input
              type="text"
              value={seatTypesName}
              onChange={(e) => setSeatTypesName(e.target.value)}
              placeholder="Ví dụ: Hành động, Tình cảm, Hoạt hình..."
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Mô tả
            </label>
            <input
                type="text"
                value={seatTypesDescription}
                onChange={(e) => setSeatTypesDescription(e.target.value)}
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
              onClick={handleSaveCategory}
              type="button"
              className="btn btn-success flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {editMode ? "Cập nhật" : "Thêm kiểu ghế"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
