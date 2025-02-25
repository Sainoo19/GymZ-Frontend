import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"

const AboutUs = () => {
    return (
        <div className="bg-gray-100">
            {/* Banner */}
            <div className="relative w-full h-[500px] bg-cover bg-center" >
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                >
                    <source src="https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/aboutus%2Fbanner-aboutUslan2.mp4?alt=media&token=b1ae20ca-66b3-495f-8f6d-35dbabc58676" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video
                </video>
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl font-extrabold text-white">Chào mừng đến với GYM-Z</h1>
                    <p className="text-lg text-white mt-2 w-3/4">
                        Nơi giúp bạn nâng cao sức khỏe, chinh phục giới hạn bản thân và tạo nên lối sống lành mạnh!
                    </p>
                </div>
            </div>

            {/* Câu chuyện thương hiệu */}
            <div className="max-w-6xl mx-auto py-16 px-6">
                <h2 className="text-4xl font-bold text-gray-800 text-center">Câu chuyện về GYM-Z</h2>
                <p className="text-gray-600 mt-4 text-lg text-center">
                    GYM-Z được thành lập với sứ mệnh giúp mọi người đạt được sức khỏe tối ưu và hình thể mong muốn.
                    Chúng tôi tin rằng tập luyện không chỉ là một thói quen, mà còn là một phong cách sống, giúp bạn mạnh mẽ hơn mỗi ngày!
                </p>
                <p className="text-gray-600 mt-4 text-lg text-center">
                    Với đội ngũ huấn luyện viên chuyên nghiệp và tận tâm, GYM-Z cam kết mang đến cho bạn những trải nghiệm tập luyện tốt nhất.
                    Chúng tôi không ngừng cải tiến và đổi mới để đáp ứng nhu cầu của khách hàng, từ các lớp học đa dạng đến trang thiết bị hiện đại.
                </p>
                <p className="text-gray-600 mt-4 text-lg text-center">
                    Hãy cùng chúng tôi xây dựng một cộng đồng khỏe mạnh, nơi mọi người đều có thể chinh phục giới hạn bản thân và đạt được mục tiêu sức khỏe của mình!
                </p>
            </div>

            {/* Lịch sử phát triển */}
            <section>
                <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">🏆 Lịch Sử Hình Thành & Phát Triển</h2>
                <div className="max-w-6xl mx-auto">
                    <ul className="list-disc list-inside space-y-4">
                        <li className="flex items-center">
                            <span className="text-yellow-500 mr-2">📅</span>
                            <strong>2015</strong> - Thành lập phòng tập đầu tiên tại TP.HCM.
                        </li>
                        <li className="flex items-center">
                            <span className="text-yellow-500 mr-2">📅</span>
                            <strong>2017</strong> - Mở rộng hệ thống lên 3 chi nhánh.
                        </li>
                        <li className="flex items-center">
                            <span className="text-yellow-500 mr-2">📅</span>
                            <strong>2019</strong> - Ra mắt lớp Yoga & Zumba chuyên sâu.
                        </li>
                        <li className="flex items-center">
                            <span className="text-yellow-500 mr-2">📅</span>
                            <strong>2022</strong> - Phát triển hệ thống 10 phòng tập trên toàn quốc.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Sứ mệnh & giá trị cốt lõi */}
            <div className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h3 className="text-3xl font-semibold text-gray-800 text-center">Sứ mệnh & Giá trị cốt lõi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        <div className="p-6 bg-gray-100 shadow-lg rounded-lg text-center">
                            <h4 className="text-xl font-bold text-yellow-500">🔥 Truyền cảm hứng</h4>
                            <p className="text-gray-600 mt-2">Chúng tôi giúp bạn duy trì động lực và đạt được mục tiêu tập luyện.</p>
                        </div>
                        <div className="p-6 bg-gray-100 shadow-lg rounded-lg text-center">
                            <h4 className="text-xl font-bold text-yellow-500">💪 Chất lượng hàng đầu</h4>
                            <p className="text-gray-600 mt-2">Thiết bị hiện đại, không gian rộng rãi và tiện nghi vượt trội.</p>
                        </div>
                        <div className="p-6 bg-gray-100 shadow-lg rounded-lg text-center">
                            <h4 className="text-xl font-bold text-yellow-500">🤝 Cộng đồng mạnh mẽ</h4>
                            <p className="text-gray-600 mt-2">Tạo môi trường tập luyện tích cực và hỗ trợ lẫn nhau.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dịch vụ & tiện ích */}
            {/* Dịch vụ & tiện ích */}
            <div className="max-w-6xl mx-auto py-16 px-6">
                <h3 className="text-3xl font-semibold text-gray-800 text-center">Dịch vụ & Tiện ích</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <h4 className="text-xl font-bold text-yellow-500">🏋️‍♂️ Phòng tập hiện đại</h4>
                        <p className="text-gray-600 mt-2">Trang bị đầy đủ máy tập cardio, tạ đơn, tạ đòn...</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <h4 className="text-xl font-bold text-yellow-500">🧘 Lớp học Yoga & Group</h4>
                        <p className="text-gray-600 mt-2">Thư giãn cơ thể và cải thiện sức khỏe với các lớp chuyên sâu.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <h4 className="text-xl font-bold text-yellow-500">🏆 Các giải đấu hấp dẫn</h4>
                        <p className="text-gray-600 mt-2">Chúng tôi tổ chức nhiều giải đấu thể thao dành cho hội viên mỗi năm.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <h4 className="text-xl font-bold text-yellow-500">💆‍♀️ Khu vực thư giãn & spa</h4>
                        <p className="text-gray-600 mt-2">Thư giãn sau buổi tập với dịch vụ massage, xông hơi và chăm sóc da chuyên nghiệp.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <h4 className="text-xl font-bold text-yellow-500">🥗 Dịch vụ tư vấn dinh dưỡng</h4>
                        <p className="text-gray-600 mt-2">Được chuyên gia dinh dưỡng tư vấn chế độ ăn uống phù hợp với mục tiêu tập luyện.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <h4 className="text-xl font-bold text-yellow-500">🎟️ Gói hội viên VIP</h4>
                        <p className="text-gray-600 mt-2">Trải nghiệm dịch vụ đẳng cấp với huấn luyện viên riêng, phòng tập riêng và nhiều ưu đãi đặc biệt.</p>
                    </div>
                </div>
            </div>

            {/* Cam kết chất lượng */}
            <section className="bg-gray-100">
                <h2 className="text-3xl font-bold text-green-600 mb-4 text-center">💎 Cam Kết Chất Lượng</h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <span className="text-4xl text-yellow-500">🏋️‍♂️</span>
                        <p className="mt-2">Thiết bị tập luyện tối tân, nhập khẩu hiện đại.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <span className="text-4xl text-yellow-500">🏢</span>
                        <p className="mt-2">Không gian rộng rãi, sạch sẽ, an toàn.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <span className="text-4xl text-yellow-500">👨‍🏫</span>
                        <p className="mt-2">Đội ngũ huấn luyện viên chuyên nghiệp.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <span className="text-4xl text-yellow-500">🏆</span>
                        <p className="mt-2">Đa dạng bộ môn: Gym, Yoga, Kickboxing...</p>
                    </div>
                </div>
            </section>

            {/* Đội ngũ huấn luyện viên */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h3 className="text-3xl font-semibold text-gray-800 text-center">Đội ngũ huấn luyện viên</h3>
                    <p className="text-gray-600 mt-2 text-center">Đội ngũ PT chuyên nghiệp, tận tâm và giàu kinh nghiệm.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="text-center">
                            <img className="w-40 h-40 object-cover rounded-full mx-auto" src="https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/aboutus%2Fpersonal-trainer-and-fitness.png?alt=media&token=48931f1a-7be0-492d-825b-7ce5329117c7" alt="Chuyên gia thể hình" />
                            <h4 className="text-lg font-bold text-gray-800 mt-4">Nguyễn Văn A</h4>
                            <p className="text-gray-600">Chuyên gia thể hình</p>
                        </div>
                        <div className="text-center">
                            <img className="w-40 h-40 object-cover rounded-full mx-auto" src="https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/aboutus%2Fyoga-meditacion-deportes.png?alt=media&token=44933268-c711-4460-ab33-04bdf4dd6b04" alt="Huấn luyện viên yoga" />
                            <h4 className="text-lg font-bold text-gray-800 mt-4">Trần B</h4>
                            <p className="text-gray-600">Huấn luyện viên yoga</p>
                        </div>
                        <div className="text-center">
                            <img className="w-40 h-40 object-cover rounded-full mx-auto" src="https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/aboutus%2Fdancer.png?alt=media&token=51be46e7-c2d2-4478-a995-1a51835a9ed1" alt="HLV GroupX" />
                            <h4 className="text-lg font-bold text-gray-800 mt-4">Lê C</h4>
                            <p className="text-gray-600">Huấn luyện viên các lớp GroupX</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback */}
            <section className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-yellow-500 mb-6 text-center">⭐ Feedback & Testimonials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <p className="font-semibold">🎤 Nguyễn Hoàng Nam – Doanh nhân</p>
                        <p className="text-gray-600 mt-2">"Tôi tập tại GYM-Z đã hơn 3 năm. Máy móc hiện đại, không gian rộng rãi!"</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <p className="font-semibold">🎤 Trần Thảo Vy – Nhân viên văn phòng</p>
                        <p className="text-gray-600 mt-2">"Sau giờ làm, tôi luôn chọn GYM-Z vì không khí thoải mái và các lớp Yoga!"</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <p className="font-semibold">🎤 Lê Minh Phát – Vận động viên</p>
                        <p className="text-gray-600 mt-2">"Huấn luyện viên chuyên nghiệp, hỗ trợ nhiệt tình, giúp tôi nâng cao thành tích tập luyện!"</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                        <p className="font-semibold">🎤 Trương Thị Huyền Thư – Nhân viên văn phòng</p>
                        <p className="text-gray-600 mt-2">"Không gian sạch sẽ, tiện nghi đầy đủ, dịch vụ chăm sóc khách hàng rất tốt!"</p>
                    </div>
                </div>
            </section>

            {/* FAQ – Câu Hỏi Thường Gặp */}
            <section className="max-w-6xl mx-auto pt-16">
                <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">❓ FAQ – Câu Hỏi Thường Gặp</h2>
                <div className="space-y-4">
                    <details className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <summary className="font-semibold cursor-pointer">Tôi có thể đăng ký tập thử miễn phí không?</summary>
                        <p className="mt-2">✔️ Có! Bạn có thể đăng ký buổi tập thử miễn phí 1 ngày tại quầy lễ tân.</p>
                    </details>
                    <details className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <summary className="font-semibold cursor-pointer">GYM-Z có hỗ trợ huấn luyện viên cá nhân (PT) không?</summary>
                        <p className="mt-2">✔️ Có! Bạn có thể chọn PT theo nhu cầu và tư vấn lộ trình riêng biệt.</p>
                    </details>
                    <details className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <summary className="font-semibold cursor-pointer">Tôi có thể nâng cấp gói hội viên không?</summary>
                        <p className="mt-2">✔️ Hoàn toàn có thể! Bạn có thể nâng cấp lên gói VIP để nhận nhiều ưu đãi hơn.</p>
                    </details>
                    <details className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <summary className="font-semibold cursor-pointer">GYM-Z có hỗ trợ tư vấn dinh dưỡng không?</summary>
                        <p className="mt-2">✔️ Có! Chúng tôi có chuyên gia dinh dưỡng giúp bạn xây dựng thực đơn phù hợp.</p>
                    </details>
                </div>
            </section>

            {/* Liên hệ */}
            <div className="text-center py-16">
                <h3 className="text-3xl font-semibold text-gray-800">Liên hệ với chúng tôi</h3>
                <p className="text-gray-600 mt-2">📍 Địa chỉ: 123 Đường Lê Lợi, TP.HCM</p>
                <p className="text-gray-600 mt-1">📞 Hotline: 0987 654 321</p>
            </div>
        </div>
    );
};

export default AboutUs;
