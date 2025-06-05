'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Event, EventsUploadFormData, EventsUploadFormDataTime } from '@/types/events';
import { updateEvents } from '@/services/event.service';
import { convertEventFormData } from '@/helpers/convertEventFormData';
import toast from 'react-hot-toast';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onSave: (updatedEvent: EventsUploadFormDataTime) => void;
  shopId: string;
  accessToken: string;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
  shopId,
  accessToken,
}) => {
  const [formData, setFormData] = useState<EventsUploadFormData>({
    file: null,
    image: '',
    name: '',
    description: '',
    start: new Date(),
    end: new Date(),
    active: true,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.EventName || '',
        description: event.EventDescription || '',
        start: event.EventStart ? new Date(event.EventStart) : new Date(),
        end: event.EventEnd ? new Date(event.EventEnd) : new Date(),
        active: event.EventActive ?? true,
        image: event.EventImageUrl || '',
        file: null,
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (type === 'datetime-local') {
      setFormData((prev) => ({
        ...prev,
        [name]: new Date(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleSubmit = async () => {
    if (!event) return;

    try {
      const updatedEvent: EventsUploadFormDataTime = {
        name: formData.name,
        description: formData.description,
        start: formData.start.toISOString(),
        end: formData.end.toISOString(),
        active: formData.active,
        file: formData.file,
      };

      const formDataUpdate = convertEventFormData(updatedEvent);

      await updateEvents(shopId, accessToken, event.ID, formDataUpdate);

      onSave(updatedEvent);
      onClose();
    } catch (error) {
      console.error('Cập nhật sự kiện thất bại:', error);
      toast.error('Cập nhật thất bại. Vui lòng thử lại!');
    }
  };

  const formatDateInput = (date: Date) =>
    date ? new Date(date).toISOString().slice(0, 16) : '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl p-6 lg:p-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Chỉnh sửa sự kiện</h2>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Tên sự kiện</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Bắt đầu</label>
            <input
              type="datetime-local"
              name="start"
              value={formatDateInput(formData.start)}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Kết thúc</label>
            <input
              type="datetime-local"
              name="end"
              value={formatDateInput(formData.end)}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
            />
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

        <div className="flex items-center gap-2">
          <input
            id="event-active"
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label htmlFor="event-active" className="text-sm text-gray-700">
            Sự kiện đang hoạt động
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditEventModal;
