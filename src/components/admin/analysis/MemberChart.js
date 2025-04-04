import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";

const MemberChart = () => {
  const [data, setData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const API_URL = process.env.REACT_APP_API_URL;

  // Lấy danh sách chi nhánh
  useEffect(() => {
    axios
      .get(`${API_URL}analysis/getbranches`, { withCredentials: true })
      .then((res) => {
        setBranches(res.data);
      })
      .catch((err) => {
        console.error("Error fetching branches:", err);
      });
  }, []);

  // Gọi API theo branch đã chọn
  useEffect(() => {
    axios
      .get(`${API_URL}analysis/count-by-type`, {
        params: { branchID: selectedBranch },
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching member count:", err);
      });
  }, [selectedBranch]);

  const maxCount = Math.max(...data.map((item) => item.count), 0);

  return (
    <div className="p-4 bg-white shadow border items-center rounded-xl w-3/5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Số lượng hội viên theo từng gói
        </h2>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="border rounded px-1 py-1 text-sm"
        >
          <option value="ALL">Tất cả chi nhánh</option>
          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center items-center w-full h-full rounded-lg  ">
        <ResponsiveContainer height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis
              domain={[0, maxCount + 3]}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={36}
              margin={{ top: 5, left: 0, right: 0, bottom: 5 }}
              formatter={() => (
                <span className="text-purple-500">Số thành viên</span>
              )}
            />
            <Bar dataKey="count" fill="#8884d8" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MemberChart;
