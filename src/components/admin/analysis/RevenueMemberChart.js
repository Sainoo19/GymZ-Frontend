import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueMemberChart = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [cardTypes, setCardTypes] = useState(['BASIC', 'GOLD', 'SILVER', 'PLATINUM']);
    const [loading, setLoading] = useState(true);
    const URL_API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Fetch doanh thu từ API
        axios.get(`${URL_API}analysis/revenue-member-by-month`, { withCredentials: true })
            .then(response => {
                if (response.data.status === 'success') {
                    setRevenueData(response.data.data);
                    setLoading(false);
                } else {
                    console.error("Error fetching data");
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error("Error fetching data", error);
                setLoading(false);
            });
    }, []);

    // Hàm tạo màu ngẫu nhiên cho từng loại thẻ
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Chuyển dữ liệu từ API thành dữ liệu cho biểu đồ
    const chartData = {
        labels: revenueData.map(item => item.month), // Lấy tháng từ dữ liệu API
        datasets: cardTypes.map(type => ({
            label: type,
            data: revenueData.map(item => item.typeRevenue[type] || 0), // Doanh thu của từng loại thẻ
            fill: false,
            borderColor: getRandomColor(), // Chọn màu cho từng loại thẻ
            tension: 0.1
        }))
    };

    return (
        <div className="container mx-auto my-8">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Doanh thu theo các gói</h2>
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
};

export default RevenueMemberChart;
