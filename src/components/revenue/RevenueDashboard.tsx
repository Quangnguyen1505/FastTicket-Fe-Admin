"use client";

import { useState, useEffect, useCallback } from "react";
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
import { AllRevenue, EntityRevenue, RevenueDetails } from "@/types/revueue";
import { format, subDays } from "date-fns";
import type { TooltipProps } from "recharts";

const RevenueDashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [groupBy, setGroupBy] = useState<"date" | "entity">("date");
  const [entityType, setEntityType] = useState<"movie" | "room">("movie");
  const [revenueData, setRevenueData] = useState<AllRevenue | null>(null);
  const [entityData, setEntityData] = useState<EntityRevenue[] | null>(null);
  const [detailData, setDetailData] = useState<RevenueDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  const fetchRevenueData = useCallback(async () => {
    try {
      if (!shopId || !accessToken) return;
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append("from", formatDate(startDate));
      if (endDate) params.append("to", formatDate(endDate));
      if (groupBy) params.append("groupBy", groupBy);

      if (groupBy === "date") {
        console.log("params:", params);
        const response = await getAllRevenue(shopId, accessToken, params);
        console.log("Revenue data:", response);
        setRevenueData(response.metadata);
      } else {
        params.append("type", entityType);
        const response = await getRevenueByEntity(shopId, accessToken, params);
        console.log("Entity Revenue Response:", response);
        setEntityData(response.metadata || []);
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
    } finally {
      setLoading(false);
    }
  }, [shopId, accessToken, startDate, endDate, groupBy, entityType]);

  useEffect(() => {
    if (!shopId || !accessToken) return;
    fetchRevenueData();
  }, [startDate, endDate, groupBy, entityType, fetchRevenueData, shopId, accessToken]);

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

  const formatChartData = (data: Record<string, number>) => {
    return Object.entries(data).map(([date, revenue]) => ({
      date,
      revenue: Number(revenue) || 0, // Đảm bảo luôn là số
    }));
  };

  const safeRevenueDisplay = (value: number | undefined) => {
    return ((value !== undefined && !isNaN(value)) ? value : 0).toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-md shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            {payload[0].value?.toLocaleString()} VNĐ
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white shadow-md rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              if (date && endDate && date > endDate) {
                setEndDate(date);
              }
              setStartDate(date);
            }}
            maxDate={endDate || new Date()}
            placeholderText="Từ ngày"
            className="border rounded px-3 py-2"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              if (date && startDate && date < startDate) {
                setStartDate(date);
              }
              setEndDate(date);
            }}
            minDate={startDate ?? undefined}
            maxDate={new Date()}
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
              {revenueData && revenueData.totalRevenue && (
                <p className="text-lg font-medium text-gray-700 mb-4">
                  Tổng doanh thu:{" "}
                  <span className="text-green-600">
                    {safeRevenueDisplay(revenueData?.totalRevenue)} VNĐ
                  </span>
                </p>
              )}
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={
                    revenueData?.totalRevenueByDate
                      ? formatChartData(revenueData.totalRevenueByDate)
                      : []
                  }
                  margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => value.toLocaleString()} 
                  />
                  <Tooltip content={<CustomTooltip />} />
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
                <BarChart 
                  data={entityData || []}
                  margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="entity_name" />
                  <YAxis 
                    width={80}
                    tick={{ fontSize: 13, dx: -4 }}
                    tickFormatter={(value) => value.toLocaleString()} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {entityData && entityData.map((entity) => {
                  const entityId = entity?.Movie?.id || entity?.Room?.id;
                  return (
                    <div
                      key={entityId}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        if (entityId) handleEntityClick(entityId);
                      }}
                    >
                      <h3 className="text-lg font-semibold">{entity.entity_name}</h3>
                      <p className="text-gray-600">
                        {safeRevenueDisplay(entity.revenue)} VNĐ
                      </p>
                    </div>
                  );
                })}
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
                  <YAxis 
                    tickFormatter={(value) => value.toLocaleString()} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#f97316" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
      {!revenueData?.totalRevenueByDate && !loading && (
        <div className="text-center py-10 text-gray-500">
          Không có dữ liệu doanh thu trong khoảng thời gian này
        </div>
      )}
    </div>
  );
};

export default RevenueDashboard;
