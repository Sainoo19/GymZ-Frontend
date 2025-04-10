import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"
import { FaCheck, FaDumbbell, FaUsers, FaCalendarAlt, FaStar, FaQuestion, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const AboutUs = () => {
    return (
        <div className="bg-gray-50">
            {/* Banner Video - Giữ nguyên */}
            <div className="relative w-full h-[600px] bg-cover bg-center" >
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                >
                    <source src="https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/aboutus%2Fbanner-aboutUslan2.mp4?alt=media&token=b1ae20ca-66b3-495f-8f6d-35dbabc58676" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video
                </video>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">Chào mừng đến với <span className="text-secondary">GYM-Z</span></h1>
                    <p className="text-xl text-white mt-4 max-w-3xl mx-auto px-6">
                        Nơi giúp bạn nâng cao sức khỏe, chinh phục giới hạn bản thân và tạo nên lối sống lành mạnh!
                    </p>
                    <button className="mt-8 px-8 py-3 bg-secondary text-primary font-bold rounded-full hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Tham gia ngay
                    </button>
                </div>
            </div>

            {/* Câu chuyện thương hiệu */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-primary text-4xl font-bold relative">
                            Câu chuyện về GYM-Z
                            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-secondary"></span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                GYM-Z được thành lập với <strong>sứ mệnh giúp mọi người đạt được sức khỏe tối ưu</strong> và hình thể mong muốn.
                                Chúng tôi tin rằng tập luyện không chỉ là một thói quen, mà còn là một phong cách sống.
                            </p>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Với đội ngũ huấn luyện viên chuyên nghiệp và tận tâm, GYM-Z cam kết mang đến cho bạn những trải nghiệm tập luyện tốt nhất.
                                Hãy cùng chúng tôi xây dựng một cộng đồng khỏe mạnh, nơi mọi người đều có thể chinh phục giới hạn bản thân!
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg relative">
                            <div className="absolute -top-4 -left-4 bg-secondary text-primary text-lg font-bold py-2 px-4 rounded">
                                Thành lập 2015
                            </div>
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/aboutus%2Fpersonal-trainer-and-fitness.png?alt=media&token=48931f1a-7be0-492d-825b-7ce5329117c7"
                                alt="GYM-Z Story"
                                className="w-full h-64 object-cover rounded-lg mb-4"
                            />
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <h3 className="text-3xl font-bold text-primary">10+</h3>
                                    <p className="text-gray-600">Chi nhánh</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-primary">5000+</h3>
                                    <p className="text-gray-600">Hội viên</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-primary">50+</h3>
                                    <p className="text-gray-600">HLV chuyên nghiệp</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-primary">8+</h3>
                                    <p className="text-gray-600">Năm kinh nghiệm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Giá trị cốt lõi - Card nổi bật */}
            <section className="bg-primary py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-white text-4xl font-bold relative">
                            Giá trị cốt lõi
                            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-secondary"></span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:-translate-y-2 text-center">
                            <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
                                <FaDumbbell className="text-primary text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-3">Chất lượng hàng đầu</h3>
                            <p className="text-gray-600">Thiết bị hiện đại, không gian rộng rãi và tiện nghi vượt trội cho trải nghiệm tập luyện tốt nhất.</p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:-translate-y-2 text-center">
                            <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
                                <FaUsers className="text-primary text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-3">Cộng đồng mạnh mẽ</h3>
                            <p className="text-gray-600">Tạo môi trường tập luyện tích cực, đoàn kết và hỗ trợ lẫn nhau để cùng tiến bộ.</p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:-translate-y-2 text-center">
                            <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
                                <FaCalendarAlt className="text-primary text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-3">Linh hoạt & Đa dạng</h3>
                            <p className="text-gray-600">Đa dạng bộ môn và lịch tập linh hoạt, phù hợp với mọi lịch trình và nhu cầu.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dịch vụ nổi bật */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-primary text-4xl font-bold relative">
                            Dịch vụ & Tiện ích
                            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-secondary"></span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Phòng tập hiện đại",
                                description: "Trang bị đầy đủ máy tập cardio, tạ đơn, tạ đòn và không gian thoáng đãng.",
                                icon: "💪"
                            },
                            {
                                title: "Lớp Yoga & Group X",
                                description: "Thư giãn cơ thể và cải thiện sức khỏe với các lớp học chuyên sâu.",
                                icon: "🧘"
                            },
                            {
                                title: "Huấn luyện viên riêng",
                                description: "Đội ngũ PT chuyên nghiệp, tư vấn lộ trình tập luyện phù hợp.",
                                icon: "👨‍🏫"
                            },
                            {
                                title: "Khu vực thư giãn & spa",
                                description: "Thư giãn sau buổi tập với dịch vụ massage và chăm sóc chuyên nghiệp.",
                                icon: "💆‍♀️"
                            },
                            {
                                title: "Tư vấn dinh dưỡng",
                                description: "Tư vấn chế độ ăn phù hợp với mục tiêu tập luyện của bạn.",
                                icon: "🥗"
                            },
                            {
                                title: "Gói hội viên VIP",
                                description: "Trải nghiệm dịch vụ đẳng cấp với nhiều ưu đãi đặc biệt.",
                                icon: "🏆"
                            }
                        ].map((service, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group">
                                <div className="h-2 bg-secondary"></div>
                                <div className="p-6">
                                    <div className="text-3xl mb-4">{service.icon}</div>
                                    <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">{service.title}</h3>
                                    <p className="text-gray-600">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Đội ngũ huấn luyện viên */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-primary text-4xl font-bold relative">
                            Đội ngũ chuyên gia
                            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-secondary"></span>
                        </h2>
                        <p className="text-gray-600 mt-6 text-center max-w-3xl">
                            Đội ngũ huấn luyện viên chuyên nghiệp, tận tâm và giàu kinh nghiệm
                            sẽ đồng hành cùng bạn trong hành trình chinh phục mục tiêu.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Nguyễn Văn A",
                                position: "Chuyên gia thể hình",
                                image: "https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/aboutus%2Fpersonal-trainer-and-fitness.png?alt=media&token=48931f1a-7be0-492d-825b-7ce5329117c7"
                            },
                            {
                                name: "Trần B",
                                position: "Huấn luyện viên yoga",
                                image: "https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/aboutus%2Fyoga-meditacion-deportes.png?alt=media&token=44933268-c711-4460-ab33-04bdf4dd6b04"
                            },
                            {
                                name: "Lê C",
                                position: "Huấn luyện viên Group X",
                                image: "https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/aboutus%2Fdancer.png?alt=media&token=51be46e7-c2d2-4478-a995-1a51835a9ed1"
                            }
                        ].map((trainer, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md group">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={trainer.image}
                                        alt={trainer.name}
                                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-bold text-primary">{trainer.name}</h3>
                                    <p className="text-gray-600 mt-1">{trainer.position}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials - Phần Feedback */}
            <section className="py-20 px-6 bg-primary">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-white text-4xl font-bold relative">
                            Nhận xét từ hội viên
                            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-secondary"></span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                name: "Nguyễn Hoàng Nam",
                                position: "Doanh nhân",
                                content: "Tôi tập tại GYM-Z đã hơn 3 năm. Máy móc hiện đại, không gian rộng rãi và đội ngũ nhân viên luôn nhiệt tình hỗ trợ."
                            },
                            {
                                name: "Trần Thảo Vy",
                                position: "Nhân viên văn phòng",
                                content: "Sau giờ làm việc, tôi luôn chọn GYM-Z vì không khí thoải mái, đội ngũ PT chuyên nghiệp và các lớp Yoga tuyệt vời."
                            },
                            {
                                name: "Lê Minh Phát",
                                position: "Vận động viên",
                                content: "Huấn luyện viên chuyên nghiệp, hỗ trợ nhiệt tình, giúp tôi nâng cao thành tích tập luyện. GYM-Z là lựa chọn hàng đầu!"
                            },
                            {
                                name: "Trương Thị Huyền Thư",
                                position: "Nhân viên văn phòng",
                                content: "Không gian sạch sẽ, tiện nghi đầy đủ, dịch vụ chăm sóc khách hàng rất tốt. Tôi rất hài lòng khi là hội viên tại đây."
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg relative">
                                <div className="flex items-center mb-4">
                                    <div className="bg-secondary w-12 h-12 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-bold text-primary">{testimonial.name}</h3>
                                        <p className="text-gray-500 text-sm">{testimonial.position}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                                <div className="text-yellow-500 mt-3 flex">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                                <div className="absolute -top-2 -right-2 text-3xl">❝</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ - Accordion Style */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-primary text-4xl font-bold relative">
                            Câu hỏi thường gặp
                            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-secondary"></span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                question: "Tôi có thể đăng ký tập thử miễn phí không?",
                                answer: "Có! Bạn có thể đăng ký buổi tập thử miễn phí 1 ngày tại quầy lễ tân hoặc đăng ký online trên website của chúng tôi."
                            },
                            {
                                question: "GYM-Z có hỗ trợ huấn luyện viên cá nhân (PT) không?",
                                answer: "Có! Chúng tôi có đội ngũ PT chuyên nghiệp, bạn có thể chọn PT theo nhu cầu và tư vấn lộ trình riêng biệt phù hợp với mục tiêu của bạn."
                            },
                            {
                                question: "Tôi có thể nâng cấp gói hội viên không?",
                                answer: "Hoàn toàn có thể! Bạn có thể nâng cấp lên gói VIP bất cứ lúc nào để nhận nhiều ưu đãi hơn như: sử dụng phòng tập riêng, có PT riêng và nhiều đặc quyền khác."
                            },
                            {
                                question: "GYM-Z có hỗ trợ tư vấn dinh dưỡng không?",
                                answer: "Có! Chúng tôi có chuyên gia dinh dưỡng giúp bạn xây dựng thực đơn phù hợp với mục tiêu tập luyện, tình trạng sức khỏe và nhu cầu cá nhân của bạn."
                            }
                        ].map((faq, index) => (
                            <details key={index} className="bg-white p-6 rounded-lg shadow-md group">
                                <summary className="flex justify-between items-center font-semibold text-lg cursor-pointer focus:outline-none">
                                    <span>{faq.question}</span>
                                    <span className="transition-transform duration-300 group-open:rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </summary>
                                <div className="mt-4 text-gray-600 border-t pt-4">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-primary text-4xl font-bold relative">
                            Liên hệ với chúng tôi
                            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-secondary"></span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaMapMarkerAlt className="text-secondary text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2">Địa chỉ</h3>
                            <p className="text-gray-600">123 Đường Lê Lợi, Quận 1, TP.HCM</p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaPhone className="text-secondary text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2">Hotline</h3>
                            <p className="text-gray-600">0987 654 321</p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaEnvelope className="text-secondary text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2">Email</h3>
                            <p className="text-gray-600">info@gymz.com</p>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <button className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-secondary hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Đăng ký tư vấn
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;