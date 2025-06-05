"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Snack, SnackRequestUpdate } from "@/types/snack";
import toast from "react-hot-toast";

interface EditSnackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedFields: Partial<SnackRequestUpdate>) => void;
  snack: Snack;
}

export default function EditSnackModal({
  isOpen,
  onClose,
  onSave,
  snack,
}: EditSnackModalProps) {
  const [formData, setFormData] = useState<SnackRequestUpdate>({
    item_name: "",
    item_price: 0,
    category: null,
    quantity_available: 0,
    file: null,
  });

  useEffect(() => {
    if (snack) {
      setFormData({
        item_name: snack.item_name ?? "",
        item_price: Number(snack.item_price) ?? 0,
        category: snack.category === undefined || snack.category === null || snack.category === ""
          ? null
          : (Number(snack.category) === 0
              ? 0
              : Number(snack.category) === 1
                ? 1
                : null),
        quantity_available: Number(snack.quantity_available) ?? 0,
        file: null, // file upload mới, không map từ URL
      });
    }
  }, [snack]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "item_price" || name === "quantity_available"
          ? Number(value)
          : name === "category"
          ? (value === "" ? null : Number(value)) as 0 | 1 | null
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSave = () => {
    const updatedFields: Partial<SnackRequestUpdate> = {};

    // item_name
    if (formData.item_name !== snack.item_name) {
      updatedFields.item_name = formData.item_name;
    }
    // item_price
    if (formData.item_price !== Number(snack.item_price)) {
      updatedFields.item_price = formData.item_price;
    }
    // category
    if ((snack.category === undefined || snack.category === null || snack.category === "") ? null : Number(snack.category) !== formData.category) {
      updatedFields.category = formData.category;
    }
    // quantity_available
    if (formData.quantity_available !== Number(snack.quantity_available)) {
      updatedFields.quantity_available = formData.quantity_available;
    }
    // file
    if (formData.file instanceof File) {
      updatedFields.file = formData.file;
    }

    onClose();
    if (Object.keys(updatedFields).length > 0) {
      onSave?.(updatedFields);
    } else {
      toast("Không có thay đổi nào!");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-6 lg:p-10">
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar gap-4">
        <h5 className="text-xl font-semibold">Chỉnh sửa sản phẩm</h5>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tên sản phẩm</label>
            <input
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Giá</label>
            <input
              type="number"
              name="item_price"
              value={formData.item_price}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Số lượng còn lại</label>
            <input
              type="number"
              name="quantity_available"
              value={formData.quantity_available}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phân loại</label>
            <select
              name="category"
              value={formData.category ?? ""}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Chọn loại</option>
              <option value={0}>Đồ ăn</option>
              <option value={1}>Đồ uống</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Tải ảnh mới (nếu có)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border rounded-lg"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </Modal>
  );
}
