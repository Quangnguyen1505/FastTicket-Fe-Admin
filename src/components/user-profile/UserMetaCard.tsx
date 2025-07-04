"use client";
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { User, UserRequestUpdate } from "@/types/users";
import { updateUsers } from "@/services/user.service";
import { useAppSelector } from "@/redux/hooks";
import { convertUserToFormData } from "@/helpers/convertUserToFormData";
import toast from "react-hot-toast";

interface UserMetaCardProps {
  user: User;
}

const UserMetaCard: React.FC<UserMetaCardProps> = ({ user }) => {
  console.log("user", user);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    file: null as File | null, 
    firstName: user.usr_first_name || "",
    lastName: user.usr_last_name || "",
    email: user.usr_email || "",
    phone: user.usr_phone || "",
    address: user.usr_address || "",
    sex: user.usr_sex?.toString() || "",
    dateOfBirth: user.usr_date_of_birth
      ? new Date(user.usr_date_of_birth).toISOString().split("T")[0]
      : "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Quan trọng: Ngăn reload trang
    
    if (!shopId || !accessToken) return;
    
    try {
      const userUpdateData: UserRequestUpdate = {
        file: formData.file,
        usr_first_name: formData.firstName,
        usr_last_name: formData.lastName,
        usr_email: formData.email,
        usr_phone: formData.phone?.toString(),
        usr_sex: formData.sex,
        usr_address: formData.address,
      };

      console.log("User update data:", userUpdateData);

      const formDataRes = convertUserToFormData(userUpdateData);
      const res = await updateUsers(shopId, accessToken, user.id, formDataRes); 
      
      console.log("Update response:", res);
      toast.success("Cập nhật thông tin thành công!");
      closeModal();

      // Có thể thêm logic cập nhật UI tại đây
    } catch (err) {
      console.error("Update failed:", err);
      let errorMessage = "Đã xảy ra lỗi không xác định";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(`Cập nhật thất bại: ${errorMessage}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({ ...prev, file }));
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={user.usr_avatar_url || "/images/user/owner.jpg"}
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.usr_first_name || "-"}{" "}
                {user.usr_last_name || "-"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.usr_sex === 0 ? "Nam" : user.usr_sex === 1 ? "Nữ" : "Giới tính chưa cập nhập ..."}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.usr_date_of_birth
                    ? user.usr_date_of_birth instanceof Date
                      ? user.usr_date_of_birth.toLocaleDateString()
                      : user.usr_date_of_birth
                    : "ngày sinh chưa cập nhập .."}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Chỉnh sửa thông tin cá nhân
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Cập nhật thông tin của bạn để giữ cho hồ sơ của bạn luôn được cập nhật.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Thông tin cá nhân
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Họ</Label>
                    <Input
                      name="firstName"
                      defaultValue={formData.firstName}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>
                  <div>
                    <Label>Tên</Label>
                    <Input
                      name="lastName"
                      defaultValue={formData.lastName}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      disabled
                      name="email"
                      defaultValue={formData.email}
                      onChange={handleChange}
                      type="email"
                    />
                  </div>
                  <div>
                    <Label>Địa chỉ</Label>
                    <Input
                      name="address"
                      defaultValue={formData.address}
                      onChange={handleChange}
                      type="email"
                    />
                  </div>
                  <div>
                    <Label>Số điện thoại</Label>
                    <Input
                      name="phone"
                      defaultValue={formData.phone}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>
                  <div>
                    <Label>Giới tính</Label>
                    <select
                      name="sex"
                      defaultValue={formData.sex}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="0">Nam</option>
                      <option value="1">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      name="dateOfBirth"
                      defaultValue={formData.dateOfBirth}
                      onChange={handleChange}
                      type="date"
                    />
                  </div>
                  <div>
                    <Label>Profile Picture</Label>
                    <Input
                      name="file"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {formData.file
                        ? `Selected file: ${formData.file.name}`
                        : "No file selected"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default UserMetaCard;
