import React from 'react';
import SidebarProfile from '../../../components/clients/layouts/SidebarProfile';
import MembershipContent from '../../../components/clients/users/MembershipContent';

function MembershipPage() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <SidebarProfile />
            <MembershipContent />
        </div>
    );
}

export default MembershipPage;