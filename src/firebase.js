import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getStorage } from "firebase/storage";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

import axios from "axios";  

const URL_API = process.env.REACT_APP_API_URL;
const vapidKeyFirebase = process.env.REACT_APP_FIREBASE_VAPID_KEY;
const firebaseConfig = {
  apiKey: "AIzaSyAfBwK1Ql-hoLh9P1yEdBP1bsqlhuNSUgc",
  authDomain: "gymz-image.firebaseapp.com",
  projectId: "gymz-image",
  storageBucket: "gymz-image.firebasestorage.app",
  messagingSenderId: "806728501409",
  appId: "1:806728501409:web:6ce5d335924fc3954d48e0",
  measurementId: "G-XZVSCDMH9V"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app);

export const messaging = getMessaging(app);

export const saveNotificationToFirestore = async (notification) => {
  try {
    await addDoc(collection(db, "notifications"), {
      title: notification.title,
      body: notification.body,
      timestamp: new Date(),
      isRead: false, // 🔹 Thêm trạng thái chưa đọc
    });
    console.log("✅ Thông báo đã lưu vào Firestore!");
  } catch (error) {
    console.error("❌ Lỗi khi lưu thông báo:", error);
  }
};












// Hàm yêu cầu quyền thông báo từ người dùng
export const requestNotificationPermission = async () => {
  const permission = Notification.permission;

  if (permission === "granted") {
    console.log("✅ Quyền thông báo đã được cấp.");
    return true;
  } else if (permission === "denied") {
    console.warn("🚫 Người dùng đã từ chối quyền thông báo.");
    alert(
      "Bạn đã chặn thông báo! Hãy vào Cài đặt trình duyệt > Quyền > Thông báo > Cho phép để bật lại."
    );
    return false;
  }

  // Nếu người dùng chưa chọn, yêu cầu quyền
  const newPermission = await Notification.requestPermission();
  return newPermission === "granted";
};

// Hàm lấy FCM Token (Dùng để gửi thông báo)
export const getFCMToken = async () => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
    const token = await getToken(messaging, { vapidKey });

    if (token) {
      console.log("✅ FCM Token:", token);
      return token;
    } else {
      console.warn("⚠️ Không lấy được token.");
    }
  } catch (error) {
    console.error("❌ Lỗi lấy FCM Token:", error);
  }
};


// Lắng nghe thông báo khi ứng dụng đang mở
onMessage(messaging, (payload) => {
  console.log("📩 Nhận thông báo:", payload);

  // Gọi hàm lưu thông báo vào Firestore
  saveNotificationToFirestore(payload.notification);

  // Hiển thị thông báo trên trình duyệt
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: "https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/asset%2Ffauget-removebg-preview%202.png?alt=media&token=8e00da79-a598-4a90-bfe2-2885f2226836",
  });
});


// const openNotificationSettings = () => {
//   alert(
//     "Bạn đã tắt thông báo! Hãy vào Cài đặt trình duyệt > Quyền > Thông báo > Cho phép để bật lại."
//   );

//   // Tự động mở trang cài đặt nếu trình duyệt hỗ trợ
//   if (navigator.userAgent.includes("Chrome")) {
//     window.open("chrome://settings/content/notifications", "_blank");
//   } else if (navigator.userAgent.includes("Firefox")) {
//     window.open("about:preferences#privacy", "_blank");
//   } else if (navigator.userAgent.includes("Edge")) {
//     window.open("edge://settings/content/notifications", "_blank");
//   }
// };

