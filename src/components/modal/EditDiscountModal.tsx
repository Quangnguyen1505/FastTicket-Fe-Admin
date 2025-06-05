"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Discount, DiscountRequestUpdate, DiscountTypeEnum } from "@/types/discount";
import MovieMultiSelect from "@/components/multiSelect";
import toast from "react-hot-toast";

interface EditDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedFields: Partial<DiscountRequestUpdate>) => void;
  discount: Discount;
  movies: { id: string; title: string }[];
}

export default function EditDiscountModal({
  isOpen,
  onClose,
  onSave,
  discount,
  movies,
}: EditDiscountModalProps) {
  const [formData, setFormData] = useState<DiscountRequestUpdate>({
    discount_name: "",
    discount_description: "",
    discount_code: "",
    discount_value: 0,
    discount_type: DiscountTypeEnum.PERCENTAGE,
    discount_start_date: "",
    discount_end_date: "",
    discount_max_uses: 0,
    discount_min_booking_amount: 0,
    discount_is_active: true,
    movie_ids: [],
  });

  useEffect(() => {
      if (discount) {
        setFormData({
          discount_name: discount.discount_name ?? "",
          discount_description: discount.discount_description !== undefined && discount.discount_description !== null ? String(discount.discount_description) : "",
          discount_code: discount.discount_code ?? "",
          discount_value: Number(discount.discount_value) ?? 0,
          discount_type:
            discount.discount_type === "PERCENTAGE"
              ? DiscountTypeEnum.PERCENTAGE
              : DiscountTypeEnum.AMOUNT,
          discount_start_date: discount.discount_start_date
            ? new Date(discount.discount_start_date).toISOString()
            : "",
          discount_end_date: discount.discount_end_date
            ? new Date(discount.discount_end_date).toISOString()
            : "",
          discount_max_uses: Number(discount.discount_max_uses) ?? 0,
          discount_min_booking_amount: Number(discount.discount_min_booking_amount) ?? 0,
          discount_is_active: Boolean(discount.discount_is_active),
          movie_ids: discount.movie_ids ?? [],
        });
      }
    }, [discount]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("discount_value") ||
        name.includes("discount_max_uses") ||
        name.includes("discount_min_booking_amount")
          ? Number(value)
          : value,
    }));
  };

  const handleDateChange = (name: "discount_start_date" | "discount_end_date", dateString: string) => {
    const date = new Date(dateString);
    setFormData((prev) => ({
      ...prev,
      [name]: date.toISOString(),
    }));
  };

const handleSave = () => {
  const updatedFields: Partial<DiscountRequestUpdate> = {};

  for (const key in formData) {
    const typedKey = key as keyof DiscountRequestUpdate;
    const originalValue = discount[typedKey as keyof Discount];
    const newValue = formData[typedKey];

    if (
      typedKey === "discount_start_date" ||
      typedKey === "discount_end_date"
    ) {
      const originalDate = originalValue ? new Date(originalValue as string).toISOString() : "";
      if (newValue && originalDate !== newValue) {
        updatedFields[typedKey] = newValue as string;
      }
    } else if (typedKey === "movie_ids") {
      const originalArr = originalValue as string[] | undefined;
      const newArr = newValue as string[];
      if (
        !originalArr ||
        newArr.length !== originalArr.length ||
        newArr.some((id) => !originalArr.includes(id))
      ) {
        updatedFields[typedKey] = newArr;
      }
    } else if (
      typedKey === "discount_value" ||
      typedKey === "discount_max_uses" ||
      typedKey === "discount_min_booking_amount"
    ) {
      if ((originalValue as number) !== (newValue as number)) {
        updatedFields[typedKey] = newValue as number;
      }
    } else if (typedKey === "discount_is_active") {
      if ((originalValue as boolean) !== (newValue as boolean)) {
        updatedFields[typedKey] = newValue as boolean;
      }
    } else if (typedKey === "discount_type") {
      if ((originalValue as DiscountTypeEnum) !== (newValue as DiscountTypeEnum)) {
        updatedFields[typedKey] = newValue as DiscountTypeEnum;
      }
    } else {
      if ((originalValue as string) !== (newValue as string) && newValue !== undefined) {
        updatedFields[typedKey] = newValue as string;
      }
    }
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
        <h5 className="text-xl font-semibold">Chỉnh sửa mã giảm giá</h5>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tên mã</label>
            <input
              name="discount_name"
              value={formData.discount_name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mã giảm giá</label>
            <input
              name="discount_code"
              value={formData.discount_code}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Giá trị</label>
              <input
                type="number"
                name="discount_value"
                value={formData.discount_value}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Loại</label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value={DiscountTypeEnum.PERCENTAGE}>Phần trăm</option>
                <option value={DiscountTypeEnum.AMOUNT}>Giảm trực tiếp</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Ngày bắt đầu</label>
              <input
                type="datetime-local"
                name="discount_start_date"
                value={formData.discount_start_date?.slice(0, 16)}
                onChange={(e) => handleDateChange("discount_start_date", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Ngày kết thúc</label>
              <input
                type="datetime-local"
                name="discount_end_date"
                value={formData.discount_end_date?.slice(0, 16)}
                onChange={(e) => handleDateChange("discount_end_date", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Số lượt dùng</label>
              <input
                type="number"
                name="discount_max_uses"
                value={formData.discount_max_uses}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Giá trị đơn tối thiểu</label>
              <input
                type="number"
                name="discount_min_booking_amount"
                value={formData.discount_min_booking_amount}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Mô tả</label>
            <textarea
              name="discount_description"
              value={formData.discount_description}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <MovieMultiSelect
            movies={movies.map(({ id, title }) => ({ id, movie_title: title }))}
            selectedMovieIds={formData.movie_ids ?? []}
            setSelectedMovieIds={(ids) =>
                setFormData((prev) => ({ ...prev, movie_ids: ids }))
            }
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="discount_is_active"
              checked={formData.discount_is_active}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discount_is_active: e.target.checked,
                }))
              }
            />
            <label className="text-sm font-medium">Kích hoạt</label>
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
