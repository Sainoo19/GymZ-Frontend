import { useEffect, useState } from "react";
import CartPackage from "./CardPackage";
import MembershipModal from "./MembershipModal";
import axios from "axios";

const HomePackage = () => {
    const [membershipPlans, setMembershipPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const URL_API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Fetch membership plans from API
        const fetchMembershipPlans = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${URL_API}home/membership-plans`);
                if (response.data && response.data.data) {
                    setMembershipPlans(response.data.data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching membership plans:", err);
                setError("Không thể tải thông tin gói hội viên");
                setLoading(false);
            }
        };

        fetchMembershipPlans();
    }, []);

    // In case we want to use static data for testing
    const staticPlans = [
        {
            type: 'BASIC',
            name: 'Gói Cơ Bản',
            description: 'Truy cập cơ bản vào phòng tập, không có PT',
            features: [
                'Sử dụng tất cả thiết bị tập luyện',
                'Truy cập phòng tập từ 8h-22h',
                'Không bao gồm các lớp tập theo nhóm'
            ],
            prices: { 1: 500000, 3: 1350000, 6: 2400000, 12: 4200000 }
        },
        {
            type: 'SILVER',
            name: 'Gói Bạc',
            description: 'Truy cập đầy đủ với 1 buổi PT mỗi tháng',
            features: [
                'Tất cả tính năng của gói Cơ Bản',
                '1 buổi PT mỗi tháng',
                'Tham gia các lớp tập theo nhóm'
            ],
            prices: { 1: 800000, 3: 2160000, 6: 3840000, 12: 6720000 }
        },
        {
            type: 'GOLD',
            name: 'Gói Vàng',
            description: 'Truy cập VIP với 2 buổi PT mỗi tháng',
            features: [
                'Tất cả tính năng của gói Bạc',
                '2 buổi PT mỗi tháng',
                'Ưu tiên đặt lịch các lớp tập',
                'Sử dụng phòng tắm VIP'
            ],
            prices: { 1: 1200000, 3: 3240000, 6: 5760000, 12: 10080000 }
        },
        {
            type: 'PLATINUM',
            name: 'Gói Bạch Kim',
            description: 'Truy cập cao cấp nhất với 4 buổi PT mỗi tháng',
            features: [
                'Tất cả tính năng của gói Vàng',
                '4 buổi PT mỗi tháng',
                'Phân tích thể chất chuyên sâu',
                'Tư vấn dinh dưỡng cá nhân hóa',
                'Thẻ khách mời hàng tháng'
            ],
            prices: { 1: 2000000, 3: 5400000, 6: 9600000, 12: 16800000 }
        }
    ];

    // Use fetched data or fallback to static data
    const plansToDisplay = membershipPlans.length > 0 ? membershipPlans : staticPlans;

    // Handle package registration request
    const handleRegisterPackage = (packageInfo) => {
        setSelectedPackage(packageInfo);
        setShowModal(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container mx-auto my-10 px-4">
            <div className="text-center mb-12">
                <p className="text-4xl font-bold text-secondary">CÁC GÓI TẬP TẠI GYMZ</p>
                <p className="text-4xl font-bold">GYM & FITNESS</p>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <p className="text-xl">Đang tải thông tin gói tập...</p>
                </div>
            ) : error ? (
                <div className="text-center py-10">
                    <p className="text-xl text-red-500">{error}</p>
                </div>
            ) : (
                <div className=" p-8 mx-auto my-8 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {plansToDisplay.map((plan) => (
                            <div key={plan.type} className="flex">
                                <CartPackage
                                    type={plan.type}
                                    name={plan.name}
                                    description={plan.description}
                                    features={plan.features}
                                    prices={plan.prices}
                                    onRegister={handleRegisterPackage}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Registration Modal */}
            <MembershipModal
                isOpen={showModal}
                onClose={handleCloseModal}
                packageInfo={selectedPackage}
            />
        </div>
    );
};

export default HomePackage;