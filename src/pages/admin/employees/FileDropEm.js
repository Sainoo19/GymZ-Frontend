import { useState } from "react";
import PictureFile from "../../../assets/images/pictureFile.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase";

export function FileDrop({ onFileUpload }) {
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
      // Create a unique filename to avoid conflicts
      const timestamp = new Date().getTime();
      const fileExtension = selectedFile.name.split('.').pop();
      const safeFileName = `${removeVietnameseTones(selectedFile.name.split('.')[0])}_${timestamp}.${fileExtension}`;

      // Create storage reference
      const storageRef = ref(storage, `employee/${safeFileName}`);

      // Start the upload
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      // Listen for state changes
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate progress percentage
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Lỗi khi tải file lên:", error);
        },
        async () => {
          // Handle successful uploads
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
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

  return (
    <div className="flex flex-col items-center">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
        className={`flex flex-col justify-center items-center h-32 w-80 border-2 border-dashed border-spacing-4 rounded-lg cursor-pointer ${isOver ? "bg-gray-200" : "bg-white"
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