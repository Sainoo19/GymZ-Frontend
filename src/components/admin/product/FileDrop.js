import { useState, useEffect } from "react";
import PictureFile from "../../../assets/images/pictureFile.png";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
// import { v4 as uuidv } from "uuid";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export function FileDrop({
  setImages,
  images = [],
  selectedAvatar,
  setSelectedAvatar,
}) {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState(images || []);
  const [uploadProgress, setUploadProgress] = useState({});
  const [completed, setCompleted] = useState({});
  const [ImgUrl, setImgURL] = useState("");
  const [previewImages, setPreviewImages] = useState([]); // Lưu danh sách ảnh preview
  const [croppedImages, setCroppedImages] = useState([]); // Lưu danh sách ảnh đã cắt
  const [showCropper, setShowCropper] = useState(false);
  const [cropper, setCropper] = useState(null);


  useEffect(() => {
    if (images.length > 0) {
      setFiles(
        images.map((url) => ({
          url,
          name: decodeURIComponent(
            url.split("?")[0].split("/").pop().replace("product%2F", "")
          ),
        }))
      );
    }
  }, [images]);

  const handleCrop = () => {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob(async (blob) => {
          const croppedUrl = URL.createObjectURL(blob);
          setCroppedImages((prev) => [...prev, blob]); // Lưu blob để upload

          // Upload ngay lập tức
          await uploadImageToFirebase(blob);

          setPreviewImages((prev) => prev.slice(1)); // Xóa ảnh đã crop khỏi danh sách preview
          if (previewImages.length === 1) {
            setShowCropper(false); // Nếu crop ảnh cuối cùng thì ẩn cropper
          }
        }, "image/jpeg");
      }
    }
  };
  const uploadImageToFirebase = async (image) => {
    try {
      const storageRef = firebase.storage().ref();
      const uniqueFileName = generateUniqueFileName("cropped.jpg");
      const fileRef = storageRef.child(`product/${uniqueFileName}`);

      const uploadTask = fileRef.put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [uniqueFileName]: progress }));
        },
        (error) => console.error("Error uploading file:", error),
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          setFiles((prevFiles) => [...prevFiles, { url: downloadURL, name: uniqueFileName }]);
          setImages((prevUrls) => [...prevUrls, downloadURL]);
          setUploadProgress((prev) => {
            const updatedProgress = { ...prev };
            delete updatedProgress[uniqueFileName];
            return updatedProgress;
          });
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };




  const handleFileUpload = async () => {
    if (croppedImages.length === 0) return;

    try {
      const storageRef = firebase.storage().ref();
      for (const image of croppedImages) {
        const uniqueFileName = generateUniqueFileName("cropped.jpg");
        const fileRef = storageRef.child(`product/${uniqueFileName}`);

        const uploadTask = fileRef.put(image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prev) => ({ ...prev, [uniqueFileName]: progress }));
          },
          (error) => console.error("Error uploading file:", error),
          async () => {
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            setFiles((prevFiles) => [...prevFiles, { url: downloadURL, name: uniqueFileName }]);
            setImages((prevUrls) => [...prevUrls, downloadURL]);
            setUploadProgress((prev) => {
              const updatedProgress = { ...prev };
              delete updatedProgress[uniqueFileName];
              return updatedProgress;
            });
          }
        );
      }
      setCroppedImages([]); // Xóa danh sách ảnh đã crop sau khi upload
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };



  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setShowCropper(true);
  };







  const handleSelectAvatar = (url) => {
    console.log("Avatar selected in FileDrop:", url);
    setSelectedAvatar(url);
  };

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

  const handleCancelCrop = () => {
    setPreviewImages((prev) => prev.slice(1));
    if (previewImages.length === 1) {
      setShowCropper(false);
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
      <p className="font-semibold text-base mt-6 ">Hình đại diện sản phẩm</p>
      <div className=" block mt-4 bg-gray-300 w-11/12 h-72  rounded-2xl">
        {selectedAvatar ? (
          <img
            src={selectedAvatar}
            alt="Selected Avatar"
            className="h-full w-full max-w-full p-3 object-contain rounded-2xl"
          />
        ) : (
          <p className="text-gray-500">Chọn một ảnh để hiển thị</p>
        )}
      </div>

      <p className="font-semibold text-base mt-6 mb-3">Thư viện hình ảnh</p>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`flex flex-col justify-center items-center h-32 w-80 border-2 border-dashed border-spacing-4 rounded-xl transition-colors cursor-pointer ${isOver ? "bg-gray-200" : "bg-white"
          }`}
      >
        <img src={PictureFile} className="w-10" alt="picture"></img>
        <input
          id="fileInput"
          type="file"
          multiple
          accept="image/*"
          className="hidden "
          onChange={handleFileChange}
        />
        <div className="mt-3">
          {files.length === 0 ? (
            <p className="text-xs">Thả hình ảnh vào đây</p>
          ) : (
            <p className="text-xs">Uploaded {files.length} file(s)</p>
          )}
        </div>
      </div>
      {showCropper && previewImages.length > 0 && (
        <div className="mt-4 w-full flex flex-col items-center">
          <Cropper
            src={previewImages[0]}
            style={{ height: 300, width: "100%" }}
            aspectRatio={1}
            guides={false}
            viewMode={1}
            minCropBoxHeight={50}
            minCropBoxWidth={50}
            background={false}
            autoCropArea={1}
            onInitialized={(instance) => setCropper(instance)}
          />
          <div className="flex w-1/2 mt-2  justify-between">
          <button className=" px-4 py-2 bg-primary text-white rounded-lg" onClick={handleCrop}>
            Cắt ảnh
          </button>
          <button className="px-4 py-2 border border-red-600 text-primary rounded-lg" onClick={handleCancelCrop}>
              Hủy
            </button>
            </div>
         
        </div>
      )}

      {/* Hiển thị danh sách ảnh đã crop */}

      <div className="mt-4 w-11/12  justify-center">
        {files.map((file, index) => (
          <div
            key={index}
            className={`flex flex-col items-center border rounded-lg shadow-sm mb-2 relative w-full transition-transform ${completed[file.name] ? "scale-110" : "scale-100"
              }`}
            onAnimationEnd={() =>
              setCompleted((prev) => ({ ...prev, [file.name]: false }))
            }
          >
            <div
              className={`flex items-center w-full p-1 rounded-lg ${!completed[file.name] ? "bg-gray-300" : ""
                }`}
            >
              <input
                type="radio"
                name="avatar"
                value={file.url || ""}
                checked={selectedAvatar === file.url}
                onChange={() => handleSelectAvatar(file.url)}
                className="mr-2"
              />

              <img
                src={file.url}
                alt={`Uploaded ${index}`}
                className={`w-14 h-14 object-cover border rounded transition-transform ${completed[file.name] ? "scale-110 " : ""
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
