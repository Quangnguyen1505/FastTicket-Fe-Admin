"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { User, UserRequestUpdate } from "@/types/users";
import { getAllRoles } from "@/services/roles.service";
import toast from "react-hot-toast";
import Image from "next/image";

interface Role {
  id: string;
  role_name: string;
}

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: UserRequestUpdate) => void;
  shopId: string;
  accessToken: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  shopId,
  accessToken,
}) => {
  const [step, setStep] = useState(1);
  const [editedUser, setEditedUser] = useState<UserRequestUpdate>({
    file: null,
    usr_avatar_url: user.usr_avatar_url || "",
    usr_first_name: "",
    usr_last_name: "",
    usr_password: "",
    usr_email: "",
    usr_phone: "",
    usr_sex: "",
    usr_date_of_birth: new Date(),
    usr_address: "",
    role_name: "",
    usr_status: 1,
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await getAllRoles(shopId, accessToken);
      setRoles(res.metadata || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách vai trò:", error);
    }
  }, [shopId, accessToken]);

  useEffect(() => {
    if (user) {
      setEditedUser({
        file: null,
        usr_avatar_url: user.usr_avatar_url || "",
        usr_first_name: user.usr_first_name || "",
        usr_last_name: user.usr_last_name || "",
        usr_password: "",
        usr_email: user.usr_email || "",
        usr_phone: user.usr_phone != null ? user.usr_phone.toString() : "",
        usr_sex: user.usr_sex != null ? user.usr_sex.toString() : "0",
        usr_date_of_birth: user.usr_date_of_birth ? new Date(user.usr_date_of_birth) : new Date(),
        usr_address: user.usr_address || "",
        role_name: user.Role?.role_name || "",
        usr_status: user.usr_status ?? 1,
      });
    }

    if (isOpen) {
      fetchRoles();
    }
  }, [user, isOpen, fetchRoles]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | number = value;

    if (type === "number") {
      newValue = value === "" ? "" : Number(value);
    }

    setEditedUser((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSave = () => {
    if (!editedUser.usr_first_name || !editedUser.usr_last_name || !editedUser.usr_email) {
      toast.error("Vui lòng nhập đầy đủ họ, tên và email."); 
      return;
    }

    onSave(editedUser);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="w-full rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-10">
        <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Chỉnh sửa thông tin người dùng
        </h4>
        <form className="flex flex-col gap-4">
            {step === 1 && (
                <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                    <Label>Họ</Label>
                    <Input name="usr_first_name" defaultValue={editedUser.usr_first_name} onChange={handleChange} />
                    </div>
                    <div>
                    <Label>Tên</Label>
                    <Input name="usr_last_name" defaultValue={editedUser.usr_last_name} onChange={handleChange} />
                    </div>
                </div>

                <div>
                    <Label>Email</Label>
                    <Input name="usr_email" defaultValue={editedUser.usr_email} disabled className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
                </div>

                <div>
                    <Label>Số điện thoại</Label>
                    <Input name="usr_phone" defaultValue={editedUser.usr_phone} onChange={handleChange} />
                </div>

                <div>
                    <Label>Giới tính</Label>
                    <select
                    name="usr_sex"
                    value={editedUser.usr_sex}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    >
                    <option value="0">Không xác định</option>
                    <option value="1">Nam</option>
                    <option value="2">Nữ</option>
                    </select>
                </div>

                <div>
                    <Label>Ngày sinh</Label>
                    <Input
                    type="date"
                    name="usr_date_of_birth"
                    defaultValue={
                        editedUser.usr_date_of_birth instanceof Date && !isNaN(editedUser.usr_date_of_birth.getTime())
                        ? editedUser.usr_date_of_birth.toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                        setEditedUser((prev) => ({
                        ...prev,
                        usr_date_of_birth: new Date(e.target.value),
                        }))
                    }
                    />
                </div>

                <div>
                    <Label>Địa chỉ</Label>
                    <Input name="usr_address" defaultValue={editedUser.usr_address} onChange={handleChange} />
                </div>
                </>
            )}

            {step === 2 && (
                <>
                <div>
                    <Label>Ảnh đại diện</Label>
                    {(previewUrl || user.usr_avatar_url) && (
                      // <img
                      //     src={previewUrl || user.usr_avatar_url || "/images/user/profile.png"}
                      //     alt="Poster"
                      //     className="h-40 rounded-md object-cover mb-2"
                      // />
                      <Image
                        src={previewUrl || user.usr_avatar_url || "/images/user/profile.png"}
                        alt="Poster"
                        width={160}
                        height={160}
                        className="h-40 rounded-md object-cover mb-2"
                      />
                    )}
                    <input
                    type="file"
                    name="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) setPreviewUrl(URL.createObjectURL(file));
                        else setPreviewUrl(null);
                        setEditedUser((prev) => ({
                        ...prev,
                        file,
                        }));
                    }}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div>
                    <Label>Vai trò</Label>
                    <select
                    name="role_name"
                    value={editedUser.role_name}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    >
                    <option value="">Chọn vai trò</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.role_name}>
                        {role.role_name}
                        </option>
                    ))}
                    </select>
                </div>

                <div>
                    <Label>Trạng thái</Label>
                    <select
                    name="usr_status"
                    value={editedUser.usr_status}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    >
                    <option value="1">Đang hoạt động</option>
                    <option value="0">Bị khóa</option>
                    </select>
                </div>
                </>
            )}

            {/* Nút chuyển bước */}
            <div className="flex justify-between items-center mt-6">
                {step > 1 && (
                <Button size="sm" variant="outline" onClick={() => setStep((prev) => prev - 1)}>
                    Quay lại
                </Button>
                )}
                {step < 2 ? (
                <Button size="sm" onClick={() => setStep((prev) => prev + 1)}>
                    Tiếp tục
                </Button>
                ) : (
                <div className="flex gap-3 ml-auto">
                    <Button size="sm" variant="outline" onClick={onClose}>
                    Hủy
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                    Lưu
                    </Button>
                </div>
                )}
            </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditUserModal;
