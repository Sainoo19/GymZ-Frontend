import React, { useState } from 'react';
import PasswordResetModal from './PasswordResetModal';

function ForgotPasswordPage() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100">
            <PasswordResetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default ForgotPasswordPage;