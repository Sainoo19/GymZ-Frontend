import SidebarProfile from '../../../components/clients/layouts/SidebarProfile';
import PasswordChangeContent from '../../../components/clients/users/PasswordChangeContent';

function ChangePasswordPage() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <SidebarProfile />
            <PasswordChangeContent />
        </div>
    );
}

export default ChangePasswordPage;