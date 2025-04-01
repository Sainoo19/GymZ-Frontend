importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAfBwK1Ql-hoLh9P1yEdBP1bsqlhuNSUgc",
    authDomain: "gymz-image.firebaseapp.com",
    projectId: "gymz-image",
    storageBucket: "gymz-image.firebasestorage.app",
    messagingSenderId: "806728501409",
    appId: "1:806728501409:web:6ce5d335924fc3954d48e0",
    measurementId: "G-XZVSCDMH9V"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Lắng nghe thông báo khi ứng dụng đóng
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Nhận thông báo trong nền:", payload);

  // Gửi sự kiện đến trang React
  self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
          client.postMessage({
              type: "NEW_NOTIFICATION",
              payload: payload.notification
          });
      });
  });

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon || "https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/FCMImages%2Ffauget-removebg-preview%202.png?alt=media&token=c5f4b3ba-a44d-4230-8b11-9494676acbd8", // Thay bằng icon của bạn
  });
});
