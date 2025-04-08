import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const MemberDistributionChart = () => {
  const [chartData, setChartData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}analysis/getbranches`)
      .then((res) => {
        setBranches(res.data);
      })
      .catch((err) => {
        console.error('Error fetching branches:', err);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedBranch
      ? `${API_URL}analysis/member-distribution?branchID=${selectedBranch}`
      : `${API_URL}analysis/member-distribution`;

    axios.get(url)
      .then((res) => {
        const members = res.data.data || res.data;

        const total = members.reduce((sum, item) => sum + item.value, 0);

        setChartData({
          labels: members.map(item => item.label),
          datasets: [
            {
              data: members.map(item => item.value),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }
          ],
          total
        });
      })
      .catch((err) => {
        console.error('Error fetching member distribution:', err);
      })
      .finally(() => setLoading(false));
  }, [selectedBranch]);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            const percent = ((value / chartData.total) * 100).toFixed(1);
            return `${tooltipItem.label}: ${value} (${percent}%)`;
          }
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl w-1/3 shadow-md border mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Tỷ lệ phân bố gói hội viên</h2>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">Chọn chi nhánh:</label>
        <select
          className="w-full border border-gray-300 rounded-md p-2"
          onChange={(e) => setSelectedBranch(e.target.value)}
          value={selectedBranch}
        >
          <option value="">-- Toàn bộ chi nhánh --</option>
          {branches.map(branch => (
            <option key={branch._id} value={branch._id}>{branch.name}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}

      {!loading && chartData && chartData.labels.length > 0 && (
        <Pie data={chartData} options={options} />
      )}

      {!loading && chartData && chartData.labels.length === 0 && (
        <p className="text-center text-gray-500">Không có dữ liệu để hiển thị</p>
      )}
    </div>
  );
};

export default MemberDistributionChart;
