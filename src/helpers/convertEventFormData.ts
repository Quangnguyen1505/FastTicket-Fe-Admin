import { EventsUploadFormDataTime } from "@/types/events";

export function convertEventFormData(event: EventsUploadFormDataTime): FormData {
  const formData = new FormData();

  if (event.file instanceof File) {
    formData.append('file', event.file);
  }
  formData.append("name", event.name);
  formData.append("description", event.description);
  formData.append("active", event.active.toString());
  formData.append("start", event.start.toString());
  formData.append("end", event.end.toString());

  return formData;
}
