'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvents, getAllEvents } from '@/services/event.service';
import { Event, EventsUploadFormData, EventsUploadFormDataTime } from '@/types/events';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useAppSelector } from '@/redux/hooks';
import { Modal } from '@/components/ui/modal';
import { convertEventFormData } from '@/helpers/convertEventFormData';
import Image from 'next/image';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState<EventsUploadFormData>({
    name: '',
    description: '',
    start: new Date(),
    end: new Date(),
    file: null,
    image: '',
    active: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await getAllEvents({ limit: 50, page: 1 });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    };
    fetchAllEvents();
  }, []);

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form on close
    setFormData({
      name: '',
      description: '',
      start: new Date(),
      end: new Date(),
      file: null,
      image: '',
      active: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'datetime-local') {
      setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const formatDateInput = (date: Date) => {
    return new Date(date).toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  };

  const handleAddEvent = async () => {
    try {
      if(!shopId || !accessToken) return;
      console.log('Form submitted:', formData);

      const payload: EventsUploadFormDataTime = {
        name: formData.name,
        description: formData.description,
        start: formData.start.toISOString(), 
        end: formData.end.toISOString(),
        active: formData.active,
        file: formData.file,
      };

      const convertFromData = convertEventFormData(payload);
      const res = await createEvents(shopId, accessToken, convertFromData);
      const newEvent: Event = res.data;

      setEvents((prevEvents) => [newEvent, ...prevEvents]);

      closeModal();
    } catch (error) {
      console.error('Lỗi khi thêm sự kiện:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-6 px-6 py-4">
      <PageBreadcrumb pageTitle="Danh sách sự kiện" />
      <ComponentCard
        title={
          <div className="flex items-center gap-10">
            <span className="text-base font-semibold">Thông Tin Sự kiện</span>
            <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
              Thêm sự kiện mới +
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {events && events.map((event) => (
            <div
              key={event.ID}
              className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-x-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => handleEventClick(event.ID)}
            >
              {/* <img
                src={event.EventImageUrl}
                alt={event.EventName}
                className="w-16 h-16 object-cover rounded-md"
              /> */}
              <Image
                src={event.EventImageUrl}
                alt={event.EventName}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold dark:text-white">{event.EventName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{event.EventDescription}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(event.EventStart).toLocaleString()} -{' '}
                  {new Date(event.EventEnd).toLocaleString()}
                </div>
              </div>
              <div className="ml-4">
                <button
                  className={`px-4 py-2 rounded-md text-white ${
                    event.EventActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                >
                  {event.EventActive ? 'Đang hoạt động' : 'Không hoạt động'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Modal thêm sự kiện */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[600px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              Thêm sự kiện
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập sự kiện bạn muốn thêm vào hệ thống
            </p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tên sự kiện</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
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

          <div className="flex items-center gap-2 mt-3">
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

          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={handleAddEvent}
              type="button"
              className="btn btn-success flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              Thêm sự kiện
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventsPage;
