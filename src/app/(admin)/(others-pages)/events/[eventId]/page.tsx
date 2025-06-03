'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Paperclip, Edit, Trash2  } from 'lucide-react';
import { deleteEvents, getDetailEvent } from '@/services/event.service';
import { Event, EventsUploadFormDataTime } from '@/types/events';
import { useAppSelector } from '@/redux/hooks';
import EditEventModal from '@/components/modal/EditEventModal';
import Image from 'next/image';

const EventDetailPage: React.FC = () => {
  const router = useRouter();
  const { eventId } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    const fetchEvent = async () => {
        if (!eventId || typeof eventId !== 'string') return;

      try {
        const response = await getDetailEvent(eventId);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleUpdateEvent = async (updatedEvent: EventsUploadFormDataTime) => {
    if (!eventId || typeof eventId !== 'string') return;

    const hasChanges = Object.keys(updatedEvent).some(
        (key) => updatedEvent[key as keyof EventsUploadFormDataTime] !== event?.[key as keyof Event]
    );

    if (hasChanges) {
        try {
            const response = await getDetailEvent(eventId);
            setEvent(response.data); 
            console.log('Event updated successfully');
        } catch (error) {
            console.error('Error updating event:', error);
        }
    } else {
        console.log('No changes detected, not updating event.');
    }
  };

  const handleDelete = async () => {
    if (!eventId || typeof eventId !== 'string' || !shopId || !accessToken) return;

    try {
      // Gọi API xóa sự kiện
      await deleteEvents(shopId, accessToken, eventId);
      router.back(); 
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

    
  if (!event || !eventId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
        Event not found
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6 space-y-6 relative">
      <div className="absolute top-4 right-4 flex items-center gap-4 cursor-pointer">
          {/* Nút sửa */}
          <div
            className="flex items-center gap-2 cursor-pointer text-blue-600 hover:underline"
            onClick={() => handleEdit(event)}
          >
            <Edit className="w-5 h-5" /> {/* Icon chỉnh sửa */}
            <span className="text-sm">Chỉnh sửa</span>
          </div>

            {/* Nút xóa */}
          <div
            className="flex items-center gap-2 cursor-pointer text-red-600 hover:underline"
            onClick={handleDelete}
          >
            <Trash2 className="w-5 h-5" /> {/* Icon xóa */}
            <span className="text-sm">Xóa</span>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{event.EventName}</h1>
          <p className="text-sm text-gray-500">
            {new Date(event.EventStart).toLocaleString()} -{' '}
            {new Date(event.EventEnd).toLocaleString()}
          </p>
          <span
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
              event.EventActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {event.EventActive ? 'Đang hoạt động' : 'Không hoạt động'}
          </span>
        </div>

        <div
        className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:underline"
        onClick={() => setShowPopup(true)}
        role="button"
        aria-label="Xem hình ảnh đính kèm"
        >
            <Paperclip className="w-4 h-4" />
            <span>Hình ảnh đính kèm</span>
        </div>

        <p className="text-gray-700 text-base leading-relaxed">{event.EventDescription}</p>

        {/* Hiển thị ngày tạo và ngày cập nhật */}
        <div className="space-y-2 text-sm text-gray-500">
          <p>
            <strong>Ngày tạo: </strong>{' '}
            {new Date(event.CreatedAt).toLocaleString()}
          </p>
          <p>
            <strong>Ngày cập nhật: </strong>{' '}
            {new Date(event.UpdatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => router.back()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            ← Quay lại
          </button>
        </div>

        {/* Popup ảnh */}
        {showPopup && (
            <div 
                className="mt-8 fixed inset-0 z-[9999] bg-black/20 flex items-center justify-center cursor-pointer"
                onClick={() => setShowPopup(false)}
            >
                {/* Container ảnh - ngăn click lan ra ngoài */}
                <div 
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                >
                {/* <img
                    src={event.EventImageUrl}
                    alt="Ảnh sự kiện"
                    className="object-contain rounded-lg shadow-xl bg-white"
                    style={{
                    maxHeight: "80vh",
                    maxWidth: "80vw"
                    }}
                /> */}
                  <Image
                      src={event.EventImageUrl}
                      alt="Ảnh sự kiện"
                      width={800}
                      height={600}
                      className="object-contain rounded-lg shadow-xl bg-white"
                      style={{
                          maxHeight: "80vh",
                          maxWidth: "80vw"
                      }}
                  />
                </div>
            </div>
        )}
      </div>
      {selectedEvent && (
        <EditEventModal
          isOpen={isModalOpen}
          event={selectedEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUpdateEvent}
          shopId={shopId|| ""}
          accessToken={accessToken || ""}
        />
      )}
    </div>
  );
};

export default EventDetailPage;
