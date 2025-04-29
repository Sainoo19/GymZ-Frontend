import React from 'react';
import SidebarProfile from '../../../components/clients/layouts/SidebarProfile';
import OrdersHistoryContent from '../../../components/clients/users/OrdersHistoryContent';

function OrdersHistoryPage() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <SidebarProfile />
            <OrdersHistoryContent />
        </div>
    );
}

export default OrdersHistoryPage;