"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg, EventContentArg } from "@fullcalendar/core";
import { createShowTime, getAllShowTimes } from "@/services/showtimes";
import { ShowTimeRequestData, ShowTimes } from "@/types/showtimes";
import { useAppSelector } from "@/redux/hooks";
import AddShowTimeModal from "../modal/AddShowTimeModal";
import EditShowTimeModal from "../modal/EditShowTimeModal";

interface CalendarEvent extends EventInput {
  movieId: string;
  extendedProps: {
    calendar: string;
    roomId?: string;
    showTimeId?: string;
  };
}


const CalendarV2: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [screenings, setScreenings] = useState<ShowTimes[]>([]);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: string; end: string } | null>(null);

  const [selectedShowtime, setSelectedShowtime] = useState<ShowTimes | null>(null);
  //Modal
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const fetchMoviesAllShowtimes = async () => {
      try {
        const resShowTimes = await getAllShowTimes({ user_id: shopId, accessToken });
        const movieScreenings: ShowTimes[] = resShowTimes.metadata || [];
        setScreenings(movieScreenings);
      } catch (error) {
        console.error("Error fetching showtimes", error);
      }
    };

    fetchMoviesAllShowtimes();
  }, [shopId, accessToken]);

  useEffect(() => {
    const uniqueScreeningsByDate = new Map<string, ShowTimes>();
  
    screenings.forEach((screening) => {
      const date = screening.show_date;
      // Nếu chưa có phim cho ngày này thì thêm vào Map
      if (!uniqueScreeningsByDate.has(date)) {
        uniqueScreeningsByDate.set(date, screening);
      }
    });
  
    const calendarEvents = Array.from(uniqueScreeningsByDate.values()).map((screening) => {
      const eventStart = `${screening.show_date}T${screening.start_time}`;
      const eventEnd = `${screening.show_date}T${screening.end_time}`;
      const now = new Date();
      const isPast = new Date(eventEnd) < now;
  
      return {
        id: `event-${screening.id}`,
        title: `${screening.Movie?.movie_title || ""}`,
        start: eventStart,
        end: eventEnd,
        movieId: screening.movie_id,
        extendedProps: {
          calendar: isPast ? "Warning" : "Success",
          roomId: screening.room_id,
          showTimeId: screening.id,
        },
      };
    });
  
    setEvents(calendarEvents);
  }, [screenings]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDateRange({
      start: selectInfo.startStr,
      end: selectInfo.endStr || selectInfo.startStr,
    });
    setSelectedEvent(null);
    setAddModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event as unknown as CalendarEvent;
    setSelectedEvent(event);
  
    const showTimeId = event.extendedProps.showTimeId;
    const showtime = screenings.find((s) => s.id === showTimeId);
    setSelectedShowtime(showtime || null);
  
    setEditModalOpen(true);
  };
  

  const handleAddEvent = async (data: ShowTimeRequestData) => {
    console.log("data", data);
    if(!shopId || !accessToken) return;
    const newShowtime = await createShowTime(shopId, accessToken, data);
    
    if(newShowtime.metadata) {
      const resShowTimes = await getAllShowTimes({ user_id: shopId, accessToken });
      const movieScreenings: ShowTimes[] = resShowTimes.metadata || [];
      setScreenings(movieScreenings);
      setAddModalOpen(false);
    }
  };

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    setEditModalOpen(false);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: " Thêm lịch chiếu +",
              click: () => {
                setSelectedEvent(null);
                setSelectedDateRange(null);
                setAddModalOpen(true);
              },
            },
          }}
        />
      </div>

      <AddShowTimeModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddEvent}
        initialStart={selectedDateRange?.start}
        initialEnd={selectedDateRange?.end}
      />

      <EditShowTimeModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        event={selectedEvent}
        showtime={selectedShowtime} 
        onUpdate={handleUpdateEvent}
      />
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase() || "default"}`;
  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
      <div className="fc-daygrid-event-dot"></div>
      {/* <div className="fc-event-time">{eventInfo.timeText}</div> */}
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default CalendarV2;
