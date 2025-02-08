import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const getVisiblePages = () => {
        let startPage = Math.max(currentPage - 2, 1);
        let endPage = Math.min(startPage + 4, totalPages);

        if (endPage - startPage < 4) {
            startPage = Math.max(endPage - 4, 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex justify-center items-center space-x-2 mt-4">
            {currentPage > 1 && (
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                >
                    Previous
                </button>
            )}

            {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded ${currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    {page}
                </button>
            ))}

            {currentPage < totalPages && (
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                >
                    Next
                </button>
            )}
        </div>
    );
};

export default Pagination;