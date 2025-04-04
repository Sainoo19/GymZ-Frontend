import { useEffect, useState } from "react";
import axios from "axios";
import { ReactComponent as RevenueIcon } from "../../../assets/icons/RevenueIcon.svg";
import { ReactComponent as OrderStatsIcon } from "../../../assets/icons/orderStatsIcon.svg";
import { FaArrowUp, FaArrowDown } from "react-icons/fa"; // Import icon mũi tên
import { useNavigate } from "react-router-dom";

const AnalysisCard = () => {
  const [revenueData, setRevenueData] = useState(null);
  const URL_API = process.env.REACT_APP_API_URL;
  const [profitData, setProfitData] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [memberStats, setMemberStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${URL_API}analysis/revenue`, { withCredentials: true })
      .then((response) => {
        setRevenueData(response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy doanh thu:", error));

    axios
      .get(`${URL_API}analysis/profit`, { withCredentials: true })
      .then((response) => {
        setProfitData(response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy lợi nhuận:", error));

    axios
      .get(`${URL_API}analysis/orderStats`, { withCredentials: true })
      .then((response) => {
        setOrderStats(response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy lợi nhuận:", error));

    axios
      .get(`${URL_API}analysis/memberStats`, { withCredentials: true })
      .then((response) => {
        setMemberStats(response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy lợi nhuận:", error));
  }, []);

  const handleRevenueClick = () => {
    navigate("/admin/revenueAnalysis"); // Chuyển hướng đến trang phân tích doanh thu
  };

  return (
    <div className=" flex w-full mx-auto justify-center items-center">
      {revenueData && (
        <Card
          label="Doanh thu tháng này"
          date={`So với tháng ${revenueData.previousMonth.month} năm ${revenueData.previousMonth.year}`}
          percent={revenueData.growthRate}
          money={revenueData.currentMonth.revenue.toLocaleString()}
          unit="VND"
          icon={<RevenueIcon size={24} className="text-blue-500" />}
          onClick={handleRevenueClick}
        />
      )}
      {profitData && (
        <Card
          label="Lợi nhuận tháng này"
          date={`${profitData.comparisonText}`}
          percent={profitData.growthRate}
          money={profitData.currentMonth.profit.toLocaleString()}
          unit="VND"
          icon={<RevenueIcon size={24} className="text-blue-500" />}
        />
      )}
      {orderStats && (
        <Card
          label="Số đơn hàng tháng này"
          date={`${orderStats.comparisonText}`}
          percent={orderStats.growthRate}
          money={orderStats.currentMonth.totalOrders.toLocaleString()}
          unit="đơn hàng"
          icon={<OrderStatsIcon size={24} className="text-blue-500" />}
        />
      )}
      {memberStats && (
        <Card
          label="Số hội viên"
          date={`${memberStats.comparisonText}`}
          percent={memberStats.growthRate}
          money={memberStats.totalActiveMembers.toLocaleString()}
          unit="hội viên"
          icon={<OrderStatsIcon size={24} className="text-blue-500" />}
        />
      )}
    </div>
  );
};

const Card = ({ label, date, percent, money, unit, icon, onClick }) => {
  const isPositive = parseFloat(percent) > 0;

  return (
    <div
      onClick={onClick}
      className="border rounded-lg w-1/4 mx-2 shadow-md pl-4 pr-2 py-4"
    >
      <h2 className="font-bold text-sm">{label}</h2>
      <div className="flex items-center ">
        {icon && <span className="my-2">{icon}</span>}
        <div>
          <p className="ml-3 text-sm font-semibold">
            {money}
            <span className="text-xs"> {unit} </span>
          </p>
          <div className="">
            <div
              className={`ml-3 mt-1 flex items-center text-sm ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? <FaArrowUp /> : <FaArrowDown />}
              <p className="ml-1 text-xs">{percent}%</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xs w-full text-right pr-2">{date}</h3>
    </div>
  );
};

export default AnalysisCard;
