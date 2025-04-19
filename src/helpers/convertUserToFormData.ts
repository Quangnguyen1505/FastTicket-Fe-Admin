import { UserRequestUpdate } from "@/types/users";

export function convertUserToFormData(user: UserRequestUpdate): FormData {
  const formData = new FormData();

  if (user.file instanceof File) {
    formData.append('file', user.file);
  }
  formData.append("role_name", user.role_name);
  formData.append("usr_address", user.usr_address);
  formData.append("usr_date_of_birth", user.usr_date_of_birth.toString());
  formData.append("usr_first_name", user.usr_first_name);
  formData.append("usr_last_name", user.usr_last_name);
  formData.append("usr_phone", user.usr_phone);
  formData.append("usr_sex", user.usr_sex);
  formData.append("usr_status", user.usr_status.toString());

  return formData;
}
