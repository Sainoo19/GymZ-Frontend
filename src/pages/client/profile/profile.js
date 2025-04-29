import SidebarProfile from '../../../components/clients/layouts/SidebarProfile';
import ProfileContent from '../../../components/clients/users/ProfileContent';

function ProfilePage() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <SidebarProfile />
            <ProfileContent />
        </div>
    );
}

export default ProfilePage;