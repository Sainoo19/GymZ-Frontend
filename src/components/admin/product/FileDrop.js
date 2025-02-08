import { useState } from "react";
import PictureFile from "../../../assets/images/pictureFile.png";




export function FileDrop() {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [completed, setCompleted] = useState({});

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
    simulateUpload(droppedFiles);
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    simulateUpload(selectedFiles);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const simulateUpload = (files) => {
    files.forEach((file) => {
      setUploadProgress((prevProgress) => ({
        ...prevProgress,
        [file.name]: 0,
      }));
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        [file.name]: false,
      }));

      const interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = { ...prevProgress };
          if (newProgress[file.name] < 100) {
            newProgress[file.name] += 10;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setCompleted((prevCompleted) => ({
                ...prevCompleted,
                [file.name]: true,
              }));
              setUploadProgress((prevProgress) => {
                const updatedProgress = { ...prevProgress };
                delete updatedProgress[file.name];
                return updatedProgress;
              });
            }, 100);
          }
          return newProgress;
        });
      }, 300);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`flex flex-col justify-center items-center h-32 w-80 border-2 border-dashed border-spacing-4 rounded-lg transition-colors cursor-pointer ${
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
              className={`flex items-center w-full p-1 ${
                !completed[file.name] ? "bg-gray-300" : ""
              }`}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className={`w-14 h-14 object-cover border rounded transition-transform ${
                  completed[file.name] ? "scale-110 " : ""
                }`}
              />
              <p className="text-xs ml-4 break-all ">{file.name}</p>
              <button
                onClick={() => removeFile(index)}
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
