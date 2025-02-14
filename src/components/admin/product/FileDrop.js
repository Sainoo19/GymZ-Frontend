import { useState, useEffect } from "react";
import PictureFile from "../../../assets/images/pictureFile.png";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
// import { v4 as uuidv } from "uuid";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export function FileDrop({ setImages, images = [] }) {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState(images || []);
  const [uploadProgress, setUploadProgress] = useState({});
  const [completed, setCompleted] = useState({});
  const [ImgUrl, setImgURL] = useState("");

  useEffect(() => {
    if (images.length > 0) {
      setFiles(
        images.map((url) => ({
          url,
          name: decodeURIComponent(url.split("?")[0].split("/").pop().replace("product%2F", ""))
        }))
      );
    }
  }, [images]);

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

    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) {
      console.log("No file selected");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    try {
      const storageRef = firebase.storage().ref();
      const uploadedUrls = [];

      for (const file of selectedFiles) {
        const uniqueFileName = generateUniqueFileName(file.name);
        const fileRef = storageRef.child(`product/${uniqueFileName}`);

        const uploadTask = fileRef.put(file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prevProgress) => ({
              ...prevProgress,
              [file.name]: progress,
            }));
          },
          (error) => {
            console.error("Error uploading file:", error);
          },
          async () => {
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            uploadedUrls.push(downloadURL);

            // Cập nhật trạng thái hoàn thành
            setCompleted((prevCompleted) => ({
              ...prevCompleted,
              [file.name]: true,
            }));

            // Ẩn thanh tiến trình
            setUploadProgress((prevProgress) => {
              const updatedProgress = { ...prevProgress };
              delete updatedProgress[file.name];
              return updatedProgress;
            });

            setFiles((prevFiles) => [...prevFiles, downloadURL]);
            setImages((prevUrls) => [...prevUrls, downloadURL]);
            console.log("Uploaded:", file.name, downloadURL);
          }
        );
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const deleteFileFromFirebase = async (fileName) => {
    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`product/${fileName}`);

      await fileRef.delete(); // Xóa file trên Firebase
      console.log(`Deleted file: ${fileName}`);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const removeFileOnFirebase = async (index) => {
    const fileToRemove = files[index];

    if (!fileToRemove) return;

    if (typeof fileToRemove === "string") {
      const fileName = fileToRemove.split("/").pop(); // Lấy tên file từ URL
      await deleteFileFromFirebase(fileName);
    }
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImages((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const generateUniqueFileName = (originalName) => {
    const fileExtension = originalName.split(".").pop(); //lấy đuôi file
    const uniqueName = `${Date.now()}.${fileExtension}`;
    // const uniqueName = `${uuidv()}_${Date.now()}.${fileExtension}`;
    return uniqueName;
  };

  
  return (
    <div className="flex flex-col items-center">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`flex flex-col justify-center items-center h-32 w-80 border-2 border-dashed border-spacing-4 rounded-xl transition-colors cursor-pointer ${
          isOver ? "bg-gray-200" : "bg-white"
        }`}
      >
        <img src={PictureFile} className="w-10" alt="picture"></img>
        <input
          id="fileInput"
          type="file"
          multiple
          accept="image/*"
          className="hidden "
          onChange={handleFileUpload}
        />
        <div className="mt-3">
          {files.length === 0 ? (
            <p className="text-xs">Thả hình ảnh vào đây</p>
          ) : (
            <p className="text-xs">Uploaded {files.length} file(s)</p>
          )}
        </div>
      </div>
      <div className="mt-4 w-11/12  justify-center">
        {files.map((file, index) => (
          <div
            key={index}
            className={`flex flex-col items-center border rounded-lg shadow-sm mb-2 relative w-full transition-transform ${
              completed[file.name] ? "scale-110" : "scale-100"
            }`}
            onAnimationEnd={() =>
              setCompleted((prev) => ({ ...prev, [file.name]: false }))
            }
          >
            <div
              className={`flex items-center w-full p-1 rounded-lg ${
                !completed[file.name] ? "bg-gray-300" : ""
              }`}
            >
              <img
                src={file.url}
                alt={`Uploaded ${index}`}
                className={`w-14 h-14 object-cover border rounded transition-transform ${
                  completed[file.name] ? "scale-110 " : ""
                }`}
              />

              <p className="text-xs ml-4 break-all">
                {typeof file === "string" ? `Image ${index + 1}` : file.name}
              </p>
              <button
                onClick={() => removeFileOnFirebase(index)}
                className="ml-auto text-red-500 hover:text-red-700 text-lg font-bold px-2"
              >
                ×
              </button>
            </div>
            {uploadProgress[file.name] !== undefined && (
              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                  className="bg-blue-500 h-2 rounded transition-all"
                  style={{ width: `${uploadProgress[file.name]}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
