import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

export function AvatarUploader({ onFileUpload }) {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [ImgUrl, setImgURL] = useState("");

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            uploadFile(selectedFile);
        }
    };

    const removeFile = () => {
        setFile(null);
        setImgURL("");
        setUploadProgress(0);
        const fileInput = document.getElementById("fileInput");
        if (fileInput) fileInput.value = "";
    };

    const uploadFile = async (selectedFile) => {
        if (!selectedFile) return;
        try {
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`users/${selectedFile.name}`);
            const uploadTask = fileRef.put(selectedFile);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => console.error("Lỗi khi tải file lên:", error),
                async () => {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    setImgURL(downloadURL);
                    if (onFileUpload) onFileUpload(downloadURL);
                }
            );
        } catch (error) {
            console.error("Lỗi khi tải file lên:", error);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            {!file ? (
                <label className="cursor-pointer">
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <div className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full font-semibold shadow-md hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 text-sm">
                        Chọn Ảnh
                    </div>
                </label>
            ) : (
                <div className="w-56 bg-white p-4 rounded-xl shadow-lg flex flex-col items-center transform transition-all duration-300 hover:-translate-y-1">
                    <div className="relative">
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Selected"
                            className="w-20 h-20 object-cover rounded-full border-2 border-yellow-400 shadow-md transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-700 font-medium mt-2 truncate w-full text-center">{file.name}</p>
                    <button
                        onClick={removeFile}
                        className="mt-3 px-4 py-1 bg-gradient-to-r from-black to-gray-800 text-yellow-400 rounded-full text-xs font-semibold shadow-md hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105"
                    >
                        Xóa ảnh
                    </button>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-2/3 mt-3 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}