import { UserRequestUpdate } from "@/types/users";

export function convertUserToFormData(user: UserRequestUpdate): FormData {
  const formData = new FormData();

  if (user.file instanceof File) {
    formData.append('file', user.file);
  }
  if (user.role_name !== undefined) {
    formData.append("role_name", user.role_name);
  }
  if (user.usr_address !== undefined) {
    formData.append("usr_address", user.usr_address);
  }
  if (user.usr_date_of_birth !== undefined) {
    formData.append("usr_date_of_birth", user.usr_date_of_birth.toString());
  }
  if (user.usr_first_name !== undefined) {
    formData.append("usr_first_name", user.usr_first_name);
  }
  if (user.usr_last_name !== undefined) {
    formData.append("usr_last_name", user.usr_last_name);
  }
  if (user.usr_phone !== undefined) {
    formData.append("usr_phone", user.usr_phone);
  }
  if (user.usr_sex !== undefined) {
    formData.append("usr_sex", user.usr_sex);
  }
  if (user.usr_status !== undefined) {
    formData.append("usr_status", user.usr_status.toString());
  }

  return formData;
}
