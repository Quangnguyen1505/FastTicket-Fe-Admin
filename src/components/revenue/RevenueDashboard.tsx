"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppSelector } from "@/redux/hooks";
import {
  getAllRevenue,
  getRevenueByEntity,
  getRevenueDetail,
} from "@/services/revenue";
import { AllRevenue } from "@/types/revueue";

interface EntityRevenue {
  entity_name: string;
  revenue: number;
  entity_id: string;
}

const RevenueDashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [groupBy, setGroupBy] = useState<"date" | "entity">("date");
  const [entityType, setEntityType] = useState<"movie" | "room">("movie");
  const [revenueData, setRevenueData] = useState<AllRevenue>({});
  const [entityData, setEntityData] = useState<EntityRevenue[]>([]);
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!shopId || !accessToken) return;
    fetchRevenueData();
  }, [startDate, endDate, groupBy, entityType]);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const fetchRevenueData = async () => {
    try {
      if (!shopId || !accessToken) return;
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append("from", formatDate(startDate));
      if (endDate) params.append("to", formatDate(endDate));

      if (groupBy === "date") {
        const response = await getAllRevenue(shopId, accessToken, params);
        setRevenueData(response.metadata);
      } else {
        params.append("type", entityType);
        const response = await getRevenueByEntity(shopId, accessToken, params);
        setEntityData(response.metadata || []);
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEntityClick = async (entityId: string) => {
    if (!shopId || !accessToken) return;
    const params = new URLSearchParams({
      type: entityType,
      id: entityId,
      groupBy: "date",
    });

    if (startDate) params.append("from", formatDate(startDate));
    if (endDate) params.append("to", formatDate(endDate));

    const response = await getRevenueDetail(shopId, accessToken, params);
    setDetailData(response.metadata);
  };

  const formatChartData = (data: AllRevenue) => {
    return Object.entries(data).map(([date, revenue]) => ({
      date,
      revenue: Number(revenue),
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white shadow-md rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            placeholderText="Từ ngày"
            className="border rounded px-3 py-2"
          />
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            placeholderText="Đến ngày"
            className="border rounded px-3 py-2"
          />
        </div>

        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as "date" | "entity")}
          className="border rounded px-3 py-2"
        >
          <option value="date">Theo ngày</option>
          <option value="entity">Theo đối tượng</option>
        </select>

        {groupBy === "entity" && (
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value as "movie" | "room")}
            className="border rounded px-3 py-2"
          >
            <option value="movie">Phim</option>
            <option value="room">Phòng chiếu</option>
          </select>
        )}
      </div>

      {loading ? (
        <div className="text-center text-lg font-medium py-10">Đang tải dữ liệu...</div>
      ) : (
        <>
          {groupBy === "date" ? (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Doanh thu theo ngày</h2>
              {revenueData.totalRevenue && (
                <p className="text-lg font-medium text-gray-700 mb-4">
                  Tổng doanh thu:{" "}
                  <span className="text-green-600">
                    {revenueData.totalRevenue.toLocaleString()} VNĐ
                  </span>
                </p>
              )}
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={formatChartData(revenueData)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Doanh thu theo {entityType === "movie" ? "phim" : "phòng chiếu"}
              </h2>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={entityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="entity_name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {entityData.map((entity) => (
                  <div
                    key={entity.entity_id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEntityClick(entity.entity_id)}
                  >
                    <h3 className="text-lg font-semibold">{entity.entity_name}</h3>
                    <p className="text-gray-600">
                      {entity.revenue.toLocaleString()} VNĐ
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detailData && (
            <div className="bg-white mt-6 p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Chi tiết doanh thu cho {detailData.entity}
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={formatChartData(detailData.revenueByDate)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#f97316" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RevenueDashboard;
