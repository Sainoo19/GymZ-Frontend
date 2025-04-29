import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import formatCurrency from "../../utils/formatCurrency";

const OrdersChart = () => {
  const [chartData, setChartData] = useState([]);
  const URL_API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${URL_API}analysis/profitOrders`);
        if (response.data.success) {
          const formattedData = response.data.data.map((item) => ({
            ...item,
            formattedRevenue: formatCurrency(item.totalRevenue),
          }));
          setChartData(formattedData);
        } else {
          console.error("Failed to fetch order statistics");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="w-full border h-96 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Thống kê đơn hàng theo tháng
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value, name) =>
              name === "Doanh thu" ? formatCurrency(value) : value
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalOrders"
            stroke="#8884d8"
            name="Số đơn hàng"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="#82ca9d"
            name="Doanh thu"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart;
