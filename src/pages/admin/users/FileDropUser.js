import { useState } from "react";
import PictureFile from "../../../assets/images/pictureFile.png";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"


export function FileDropUser({onFileUpload}) {
  const [isOver, setIsOver] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
//   const [completed, setCompleted] = useState({});
  const [ImgUrl, setImgURL] = useState("");

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
  
    // Reset giá trị input file
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = ""; // 🔹 Reset để chọn lại cùng file
    }
  };
  
  const uploadFile = async (selectedFile) => {
    if (!selectedFile) return;

    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`users/${selectedFile.name}`); // Giữ nguyên tên file

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
            onFileUpload(downloadURL); // 🔹 Trả trực tiếp URL về adduseradduser
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
        className={`flex flex-col justify-center items-center h-32 w-80 border-2 border-dashed border-spacing-4 rounded-lg cursor-pointer ${
          isOver ? "bg-gray-200" : "bg-white"
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
