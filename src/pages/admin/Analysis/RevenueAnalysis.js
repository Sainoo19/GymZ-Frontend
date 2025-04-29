import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import OpenAI from "openai";
import formatCurrency from "../../../components/utils/formatCurrency";

const RevenueAnalysis = () => {
  const [chartData, setChartData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
  const URL_API = process.env.REACT_APP_API_URL;
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
  const [revenueChange, setRevenueChange] = useState(0);
  const [currentRevenue, setCurrentRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Gọi API lấy dữ liệu doanh thu
        const response = await axios.get(`${URL_API}analysis/revenue`,  {withCredentials: true});
        if (response.data.revenueByMonth && response.data.revenueByMonth.length > 0) {
          const revenueData = response.data.revenueByMonth.filter(item => item.revenue > 0);
          setChartData(revenueData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
      }
    };

    const fetchRevenueSuggestions = async () => {
      try {
        // Gọi API phân tích doanh thu & gợi ý chiến lược
        const response = await axios.get(`${URL_API}analysis/revenue-suggestions`,  {withCredentials: true});
        if (response.data.success) {
          setCurrentRevenue(response.data.currentRevenue);
          setLastMonthRevenue(response.data.lastMonthRevenue);
          setRevenueChange(response.data.revenueChange);
          setSuggestions(response.data.suggestions);
        }
      } catch (error) {
        console.error("Lỗi khi lấy gợi ý chiến lược:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
    fetchRevenueSuggestions();
  }, []);
 
  


  return (
    <div className="mt-20 border rounded-lg">
      <h2 className="text-xl font-semibold mx-4 my-6 ">Phân tích doanh thu</h2>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <>
            {/* Biểu đồ doanh thu */}
            <ResponsiveContainer width="100%" height={400}>
              {chartData.length > 0 ? (
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickFormatter={(tick) => `Tháng ${tick}`} />
                  <YAxis orientation="left" tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />
                </LineChart>
              ) : (
                <p className="text-center text-gray-500">Không có dữ liệu doanh thu.</p>
              )}
            </ResponsiveContainer>

            {/* Hiển thị số liệu doanh thu */}
            <div className="mt-6 p-4 bg-gray-50 border rounded">
              <p><strong>Doanh thu tháng này:</strong> {formatCurrency(currentRevenue)} VNĐ</p>
              <p><strong>Doanh thu tháng trước:</strong> {formatCurrency(lastMonthRevenue)} VNĐ</p>
              <p><strong>Thay đổi doanh thu:</strong> {formatCurrency(revenueChange)} VNĐ</p>
            </div>

            {/* Hiển thị gợi ý chiến lược */}
            <div className="mt-6 p-4 bg-gray-100 border-l-4 border-blue-500 rounded">
              <h3 className="font-semibold mb-3">Gợi ý chiến lược:</h3>
              <ul className="list-disc list-inside">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)
                ) : (
                  <p className="text-sm text-gray-500">Không có gợi ý.</p>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default RevenueAnalysis;
