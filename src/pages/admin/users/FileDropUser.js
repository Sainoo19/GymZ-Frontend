import { useState } from "react";
import PictureFile from "../../../assets/images/pictureFile.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase";

export function FileDropUser({ onFileUpload }) {
  const [isOver, setIsOver] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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
      uploadFile(droppedFile);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]; // 🔹 Chỉ lấy 1 file duy nhất
    if (selectedFile) {
      setFile(selectedFile);
      uploadFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setImgURL("");
    setUploadProgress(0);

    // Pass null to parent component
    if (onFileUpload) {
      onFileUpload(null);
    }

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

      // Create reference to the storage location
      const storageRef = ref(storage, `users/${safeFileName}`);

      // Start the upload task
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      // Monitor upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate and update progress
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
            onFileUpload(downloadURL); // 🔹 Pass URL to parent component
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
        <img src={PictureFile} className="w-10" alt="picture"></img>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="mt-3">
          {!file ? <p className="text-xs">Thả 1 hình ảnh vào đây</p> : <p className="text-xs">{file.name}</p>}
        </div>
      </div>

      {file && (
        <div className="mt-4 w-11/12 flex flex-col items-center border rounded-lg shadow-sm p-2 relative">
          <img
            src={URL.createObjectURL(file)}
            alt="Selected"
            className="w-24 h-24 object-cover border rounded"
          />
          <button
            onClick={removeFile}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
          >
            Xóa ảnh
          </button>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}