import React from 'react';
import SidebarProfile from '../../../components/clients/layouts/SidebarProfile';
import TrainScheduleContent from '../../../components/clients/users/TrainScheduleContent';

function TrainSchedulePage() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <SidebarProfile />
            <TrainScheduleContent />
        </div>
    );
}

export default TrainSchedulePage;