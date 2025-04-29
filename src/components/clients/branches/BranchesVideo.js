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
    <div className="flex justify-center bg-primary py-10 md:py-24 px-4 md:px-8">
      <div className="flex flex-col lg:flex-row w-full max-w-[1280px] items-center lg:items-center">
        
        {/* Phần 1: Các đoạn văn */}
        <div className="flex flex-col w-full lg:w-2/5 space-y-4 text-center lg:pl-16 lg:text-left ">
          <p className="text-3xl md:text-5xl text-secondary font-bold">
            Phòng tập gym GYMZ
          </p>
          <p className="text-base md:text-lg text-white font-bold">
            Phòng tập gym hiện đại chuẩn 5 sao
          </p>
          <p className="text-sm md:text-base text-white mx-auto lg:mx-0 max-w-sm md:max-w-md">
            GymZ là một trong những thương hiệu phòng tập gym 5 sao 
            với hệ thống nhiều cơ sở nằm ở trung tâm TPHCM, Hà Nội. 
            Phòng tập gym GymZ được xây dựng với mục đích 
            mang lại một môi trường tập luyện chuyên nghiệp, 
            hiện đại và đầy đủ các dịch vụ cho người tập. 
            Với phương châm “Tập luyện – Sức khỏe – Niềm vui”.
          </p>
          <p className="text-sm md:text-base text-white mx-auto lg:mx-0 max-w-sm md:max-w-md">
            Phòng tập gym GymZ – Nơi kiến tạo vóc dáng hoàn hảo cho bạn. Hãy đến và cảm nhận sự khác biệt.
          </p>
        </div>
  
        {/* Phần 2: Video với hình ảnh chờ */}
        <div className="w-full lg:w-3/5 relative mt-6 lg:mt-0 px-0 lg:px-10">
          {!isPlaying && (
            <div
              className="relative w-full h-80 md:h-[400px] lg:h-[480px] bg-cover bg-center rounded-3xl overflow-hidden"
              style={{
                backgroundImage: `url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')`,
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
                  className="w-12 h-12 bg-black rounded-full p-3"
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
  
          {isPlaying && (
            <div
              id="video-overlay"
              onClick={handleCloseVideo}
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
              <iframe 
                className="w-11/12 md:w-4/5 h-64 md:h-4/5 rounded-lg" 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen>
              </iframe>          
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  
};

export default BranchesVideo;
