"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import BasicTableCategories from "@/components/tables/BasicTableCategory";
import { Modal } from "@/components/ui/modal";
import { createCategories, updateCategories } from "@/services/category.service";
import { useAppSelector } from "@/redux/hooks";
import { CategoryRequestEdit } from "@/types/categories";
import toast from "react-hot-toast";

export default function BasicTables() {
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // <- true: sửa, false: thêm
  const [editingCategory, setEditingCategory] = useState<CategoryRequestEdit | null>(null);
  
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setEditMode(false);
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };  
  //   if(!shopId || !accessToken) return;
  //   if (categoryName.trim() === "") return;
  
  //   const newCategory = {
  //       cate_name: categoryName,
  //       cate_description: categoryDescription,
  //   };
  
  //   const newCate = await createCategories(shopId, accessToken, newCategory)
  //   console.log(newCate)

  //   setRefreshTrigger((prev) => prev + 1);
    
  //   closeModal();
  // };
  
  const handleSaveCategory = async () => {
    if (!shopId || !accessToken || categoryName.trim() === "") return;

    const categoryData = {
      cate_name: categoryName,
      cate_description: categoryDescription,
    };

    try {
      if (editMode && editingCategory) {
        await updateCategories(shopId, accessToken, editingCategory.id, categoryData);
        toast.success("Cập nhật thể loại thành công!");
      } else {
        await createCategories(shopId, accessToken, categoryData);
        toast.success("Thêm thể loại thành công!");
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
      <PageBreadcrumb pageTitle="Thể Loại" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex items-center gap-10">
              <span className="text-base font-semibold">Thông Tin Thể loại</span>
              <Button size="sm" variant="primary" onClick={openModal}>
                Thêm Thể loại +
              </Button>
            </div>
          }
        >
          <BasicTableCategories refreshTrigger={refreshTrigger} onEditCategory={(category) => {
            setEditMode(true);
            setEditingCategory(category);
            setCategoryName(category.cate_name);
            setCategoryDescription(category.cate_description || "");
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
              {editMode ? "Chỉnh sửa thể loại" : "Thêm thể loại"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {editMode
                ? "Chỉnh sửa thông tin thể loại bên dưới"
                : "Nhập tên thể loại bạn muốn thêm vào hệ thống"}
            </p>
          </div>
          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tên thể loại
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
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
              {editMode ? "Cập nhật" : "Thêm thể loại"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
