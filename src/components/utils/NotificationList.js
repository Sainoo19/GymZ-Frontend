import React from "react";
import useRealtimeNotifications from "../../hook/useRealtimeNotifications";

const NotificationList = () => {
  const notifications = useRealtimeNotifications();

  return (
    <div>
      <h2>🔔 Thông báo mới</h2>
      <ul>
        {notifications.map((noti) => (
          <li key={noti.id}>
            <strong>{noti.title}</strong>: {noti.body} -{" "}
            {new Date(noti.timestamp.toDate()).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
