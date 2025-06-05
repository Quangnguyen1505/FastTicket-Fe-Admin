"use client";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { useAppSelector } from "@/redux/hooks";
import { getUsersProfile } from "@/services/auth.service";
import { User } from "@/types/users";
import React, { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchProfile = async () => {
        if (!shopId || !accessToken) return;
  
        try {
          const res = await getUsersProfile(shopId, accessToken);
          console.log(res)
          const data = res.data as { metadata: User };
          setProfile(data.metadata);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProfile();
    }, [shopId, accessToken]);

  if (loading) return <div>Đang tải...</div>;
  if (!profile) return <div>Không tìm thấy thông tin</div>;
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={profile} />
          <UserInfoCard user={profile} />
          <UserAddressCard user={profile} />
        </div>
      </div>
    </div>
  );
}
