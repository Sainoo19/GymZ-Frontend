import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaGem, FaBuilding, FaDumbbell } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const HomeBranches = () => {
  const [branches, setBranches] = useState([]);
  const [branchCount, setBranchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const URL_API = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch branches
        const branchesResponse = await axios.get(
          `${URL_API}branchesClient/all/nopagination`
        );
        setBranches(branchesResponse.data.data);

        // Fetch branch count - assuming there's an endpoint for this
        // If there isn't, we can use the length of the branches array
        try {
          const countResponse = await axios.get(
            `${URL_API}branchesClient/count`
          );
          setBranchCount(countResponse.data.count);
        } catch (countError) {
          // Fallback: use the length of branches array if count API fails
          setBranchCount(branchesResponse.data.data.length);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-xl font-medium text-secondary tracking-wide uppercase">
            Hệ thống chi nhánh
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">
            GymZ – Hệ Thống Phòng Gym{" "}
            <span className="text-secondary">Hiện Đại Số 1</span>
          </h1>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            {loading
              ? "Đang tải thông tin chi nhánh..."
              : `Với ${branchCount} chi nhánh trải dài khắp Việt Nam, chúng tôi luôn sẵn sàng phục vụ nhu cầu tập luyện của bạn`}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Side - Key Figure */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white p-10 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center">
                <div className="mr-6 relative">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-24 w-24 rounded-lg"></div>
                  ) : (
                    <>
                      <span className="text-7xl font-bold text-secondary">
                        {branchCount}
                      </span>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full animate-pulse"></div>
                    </>
                  )}
                </div>
                <div className="border-l-4 border-secondary pl-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    Chi nhánh trải dài
                  </h3>
                  <p className="text-gray-600">khắp Việt Nam</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Tọa lạc tại các vị trí đắc địa, dễ dàng di chuyển từ mọi khu
                    vực
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <Link
              to="/branches"
              className="mt-8 md:mx-auto md:container xs:container xs:mx-auto xs:w-full xs:border-red-600  inline-flex items-center justify-center bg-secondary text-white px-8 py-3 rounded-lg shadow-lg hover:bg-secondary/90 transition-all duration-300 group"
            >
              <FaMapMarkerAlt className="mr-2 group-hover:animate-bounce" />
              <span className="font-bold ">Tìm chi nhánh gần nhất</span>
              <svg
                className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </Link>
          </div>

          {/* Right Side - Features */}
          <div className="w-full lg:w-3/5  space-y-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 border-1  rounded-xl shadow-md flex hover:shadow-lg transition-shadow duration-300">
              <div className="flex-shrink-0 mr-4">
                <div className="bg-secondary text-white w-14 h-14 rounded-lg flex items-center justify-center">
                  <FaBuilding className="text-2xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Không gian chuẩn quốc tế
                </h3>
                <p className="text-gray-600">
                  Mỗi chi nhánh sở hữu diện tích trung bình hơn 3.000m², mang
                  đến trải nghiệm tập luyện thoải mái và đẳng cấp.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md flex hover:shadow-lg transition-shadow duration-300">
              <div className="flex-shrink-0 mr-4">
                <div className="bg-secondary text-white w-14 h-14 rounded-lg flex items-center justify-center">
                  <FaGem className="text-2xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Phong cách riêng biệt
                </h3>
                <p className="text-gray-600">
                  Từ không gian tối giản hiện đại đến kiến trúc thể thao năng
                  động, mỗi phòng tập đều tạo cảm hứng và khẳng định đẳng cấp.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md flex hover:shadow-lg transition-shadow duration-300">
              <div className="flex-shrink-0 mr-4">
                <div className="bg-secondary text-white w-14 h-14 rounded-lg flex items-center justify-center">
                  <FaDumbbell className="text-2xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Trang thiết bị tiên tiến
                </h3>
                <p className="text-gray-600">
                  Kết hợp cùng đội ngũ huấn luyện viên chuyên nghiệp, giúp bạn
                  đạt được mục tiêu thể hình nhanh chóng và hiệu quả.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBranches;
