"use client";
import React from "react";
import { User } from "@/types/users";

interface UserMetaCardProps {
  user: User;
}

const UserInfoCard: React.FC<UserMetaCardProps> = ({ user }) => {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Thông tin cá nhân
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Họ
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.usr_first_name || "chưa cập nhập ..."}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tên
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.usr_last_name || "chưa cập nhập ..."}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.usr_email || "chưa cập nhập"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Số điện thoại
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.usr_phone || "chưa cập nhập..."}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Vai trò
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                { user.Role?.role_name ||"admin" }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfoCard;