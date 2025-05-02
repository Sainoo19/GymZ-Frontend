import React from 'react';
import ProfileLayout from '../../../components/clients/wrapper/ProfileLayout';
import OrdersHistoryContent from '../../../components/clients/users/OrdersHistoryContent';

function OrdersHistoryPage() {
    return (
        <ProfileLayout>
            <OrdersHistoryContent />
        </ProfileLayout>
    );
}

export default OrdersHistoryPage;