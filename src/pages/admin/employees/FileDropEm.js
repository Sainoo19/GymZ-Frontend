import { useState } from "react";
import PictureFile from "../../../assets/images/pictureFile.png";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"


export function FileDrop({onFileUpload}) {
  const [isOver, setIsOver] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewURL, setPreviewURL] = useState("");
  const [imgUrl, setImgURL] = useState("");



  const handleDragOver = (event) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsOver(false);
  };


const handleDrop = (event) => {
    event.preventDefault();
    setIsOver(false);
    
    const droppedFile = event.dataTransfer.files[0]; // 🔹 Chỉ lấy 1 file duy nhất
    if (droppedFile) {
      setFile(droppedFile);
      setPreviewURL(URL.createObjectURL(droppedFile));
      uploadFile(droppedFile);
    }
  };

const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]; // 🔹 Chỉ lấy 1 file duy nhất
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewURL(URL.createObjectURL(selectedFile));
      uploadFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewURL("");
    setUploadProgress(0);
    onFileUpload(null);
  
    // Reset giá trị input file
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = ""; // 🔹 Reset để chọn lại cùng file
    }
  };

  const removeVietnameseTones = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
        .replace(/đ/g, "d").replace(/Đ/g, "D") // Chuyển đ -> d, Đ -> D
        .replace(/[^a-zA-Z0-9]/g, "_") // Thay ký tự đặc biệt thành _
        .toLowerCase(); // Chuyển thành chữ thường
};
  


const uploadFile = async (selectedFile) => {
  if (!selectedFile) return;

  try {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`employee/${selectedFile.name}`); // Giữ nguyên tên file

    // Tải lên file
    const uploadTask = fileRef.put(selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Cập nhật tiến trình tải lên
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Lỗi khi tải file lên:", error);
      },
      async () => {
        // Lấy URL khi hoàn thành
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        console.log("File đã tải lên thành công:", downloadURL);
        setImgURL(downloadURL);

        if (onFileUpload) {
          onFileUpload(downloadURL); // 🔹 Trả trực tiếp URL về CreateEmployee
        }
      }
    );
  } catch (error) {
    console.error("Lỗi khi tải file lên:", error);
  }
};


// đừng xóa cái return này!!!!
// return (
//     <div className="flex flex-col items-center">
//       <div
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         onClick={() => document.getElementById("fileInput").click()}
//         className={`flex flex-col justify-center items-center h-32 w-80 border-2 border-dashed border-spacing-4 rounded-lg cursor-pointer ${
//           isOver ? "bg-gray-200" : "bg-white"
//         }`}
//       >
//         <img src={PictureFile} className="w-10" alt="picture"></img>
//         <input
//           id="fileInput"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleFileChange}
//         />
//         <div className="mt-3">
//           {!file ? <p className="text-xs">Thả 1 hình ảnh vào đây</p> : <p className="text-xs">{file.name}</p>}
//         </div>
//       </div>

//       {previewURL && (
//         <div className="mt-4 w-11/12 flex flex-col items-center border rounded-lg shadow-sm p-2 relative">
//           <img
//             src={previewURL}
//             alt="Selected"
//             className="w-24 h-24 object-cover border rounded"
//           />
//           <button
//             onClick={removeFile}
//             className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
//           >
//             Xóa ảnh
//           </button>
//           {uploadProgress > 0 && uploadProgress < 100 && (
//             <div className="w-full bg-gray-200 h-2 rounded mt-2">
//               <div
//                 className="bg-blue-500 h-2 rounded"
//                 style={{ width: `${uploadProgress}%` }}
//               ></div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );

return (
    <div className="flex flex-col items-center">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
        className={`flex flex-col justify-center items-center h-32 w-80 border-2 border-dashed border-spacing-4 rounded-lg cursor-pointer ${
          isOver ? "bg-gray-200" : "bg-white"
        }`}
      >
        {previewURL ? (
          // 🔹 Hiển thị ảnh nếu đã chọn
          <img src={previewURL} className="w-24 h-24 object-cover border rounded" alt="Selected" />
        ) : (
          // 🔹 Hiển thị icon tải lên nếu chưa có ảnh
          <>
            <img src={PictureFile} className="w-10" alt="Upload" />
            <p className="text-xs mt-3">Thả 1 hình ảnh vào đây</p>
          </>
        )}
  
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
  
      {/* 🔹 Nút xóa ảnh */}
      {previewURL && (
        <button
          onClick={removeFile}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
        >
          Xóa ảnh
        </button>
      )}
  
      {/* 🔹 Thanh hiển thị tiến trình tải lên */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-80 bg-gray-200 h-2 rounded mt-2">
          <div className="bg-blue-500 h-2 rounded" style={{ width: `${uploadProgress}%` }}></div>
        </div>
      )}
    </div>
  );
  
}
