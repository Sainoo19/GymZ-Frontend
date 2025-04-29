import React from 'react';

const DeleteSessionModal = ({ isOpen, onClose, onDelete, sessionId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Xác Nhận Xóa Phiên Tập</h2>
                <p>Bạn có chắc chắn muốn xóa phiên tập luyện với ID: {sessionId} không?</p>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-all"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
                        onClick={() => onDelete(sessionId)}
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSessionModal;