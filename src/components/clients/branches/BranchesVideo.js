import React, { useState } from "react";

const BranchesVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = "CiCTr7CO_8k";
  const urlVideo ="";
  // Chuyển trạng thái khi bấm vào thumbnail
  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  // Quay lại chế độ thumbnail khi bấm ra ngoài video
  const handleCloseVideo = (e) => {
    if (e.target.id === "video-overlay") {
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex w-full p-8 space-x-8 py-24 bg-primary">
      {/* Phần 1: Các đoạn văn */}
      <div className="flex flex-col w-2/5 space-y-4 pl-28">
        <p className="text-6xl text-secondary" style={{width :"500px", fontFamily: 'Kanit'}}>Phòng tập gym GYMZ</p>
        <p className="text-lg text-white font-bold" style={{width :"500px", fontFamily: 'Kanit'}}>Phòng tập gym hiện đại chuẩn 5 sao</p>
        <p className="text-lg text-white "style={{width :"389px"}}>
        GymZ là một trong những thương hiệu phòng tập gym 5 sao 
        với hệ thống nhiều cơ sở nằm ở trung tâm TPHCM, Hà Nội. 
        Phòng tập gym GymZ được xây dựng với mục đích 
        mang lại một môi trường tập luyện chuyên nghiệp, 
        hiện đại và đầy đủ các dịch vụ cho người tập. 
        Với phương châm “Tập luyện – Sức khỏe – Niềm vui”.        </p>
        <p className="text-lg text-white" style={{width :"389px"}}>
        Phòng tập gym GymZ – Nơi kiến tạo vóc dáng hoàn hảo cho bạn. Hãy đến và cảm nhận sự khác biệt.</p>
      </div>

      {/* Phần 2: Video với hình ảnh chờ */}
      <div className="w-3/5 relative pr-28">
        {/* Khi video chưa phát */}
        {!isPlaying && (
          <div
            className="relative w-full h-full bg-cover bg-center rounded-3xl overflow-hidden"
            style={{
              backgroundImage: `url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')`, // Thay bằng thumbnail của video
            }}
          >
            <div
              onClick={handlePlayClick}
              className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                className="w-12 h-12 bg-black rounded-full p-3 "
              >
                <path
                  fill="none"
                  d="M8 5v14l11-7z"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Khi video đang phát */}
        {isPlaying && (
          <div
            id="video-overlay"
            onClick={handleCloseVideo}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            {/* <iframe
              className="w-4/5 h-4/5 rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" // Thay bằng link YouTube bạn muốn nhúng
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe> */}
            <iframe 
                className="w-4/5 h-4/5 rounded-lg" 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title=":: Vietsub ♪ Nguyệt Hạ · Bất Tài || 月下 · 不才 - OST Bạch Nguyệt Phạn Tinh 白月梵星" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen>
            </iframe>          
        </div>
        )}
      </div>
    </div>
  );
};

export default BranchesVideo;
