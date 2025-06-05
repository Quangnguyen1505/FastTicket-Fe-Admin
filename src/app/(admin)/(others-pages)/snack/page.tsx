'use client';

import React, { useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useAppSelector } from '@/redux/hooks';
import { Modal } from '@/components/ui/modal';
import { SnackRequestCreate } from '@/types/snack';
import BasicTableSnack from '@/components/tables/BasicTableSnack';
import { convertSnackFormData } from '@/helpers/convertSnackFormData';
import { addSnack } from '@/services/snack.service';

const SnacksPage: React.FC = () => {
  const [formData, setFormData] = useState<SnackRequestCreate>({
    item_name: '',
    item_price: 0,
    file: null,
    quantity_available: 0,
    category: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form on close
    setFormData({
      item_name: '',
      item_price: 0,
      file: null,
      quantity_available: 0,
      category: 0,
    });
  };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type, checked } = e.target as HTMLInputElement;
//     if (type === 'checkbox') {
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else if (type === 'datetime-local') {
//       setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev: SnackRequestCreate) => ({ ...prev, file }));
  };

//   const formatDateInput = (date: Date) => {
//     return new Date(date).toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
//   };

  const handleAddSnack = async () => {
    try {
      if(!shopId || !accessToken) return;
      console.log('Form submitted:', formData);

      const payload: SnackRequestCreate = {
        item_name: formData.item_name,
        item_price: formData.item_price,
        file: formData.file,
        quantity_available: formData.quantity_available,
        category: formData.category,
      };

      const convertFromData = convertSnackFormData(payload);
      await addSnack(shopId, accessToken, convertFromData);
      setRefreshTrigger((prev) => prev + 1);

      closeModal();
    } catch (error) {
      console.error('Lỗi khi thêm snack:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'item_price' || name === 'quantity_available' ? parseInt(value) : value,
    }));
  };  

  return (
    <div className="flex flex-col space-y-6 px-6 py-4">
      <PageBreadcrumb pageTitle="Danh sách snack" />
      <ComponentCard
        title={
          <div className="flex items-center gap-10">
            <span className="text-base font-semibold">Thông Tin Snack</span>
            <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
              Thêm snack mới +
            </Button>
          </div>
        }
      >
        <BasicTableSnack
          refreshTrigger={refreshTrigger}
        />
      </ComponentCard>

      {/* Modal thêm sự kiện */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[600px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              Thêm snack
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập snack bạn muốn thêm vào hệ thống
            </p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tên snack</label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Giá</label>
            <input
              type="number"
              name="item_price"
              value={formData.item_price}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Số lượng</label>
              <input
                type="number"
                name="quantity_available"
                value={formData.quantity_available}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Loại</label>
              <select
                name="category"
                value={formData.category ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '0' || value === '1') {
                    setFormData((prev) => ({
                      ...prev,
                      category: parseInt(value) as 0 | 1,
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      category: null,
                    }));
                  }
                }}
                className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
              >
                <option value="">Chọn loại</option>
                <option value={0}>SNACKS</option>
                <option value={1}>DRINK</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
            />
            {formData.file && (
              <p className="mt-2 text-sm text-gray-500">Ảnh đã chọn: {formData.file.name}</p>
            )}
          </div>

          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={handleAddSnack}
              type="button"
              className="btn btn-success flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              Thêm snack
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SnacksPage;
