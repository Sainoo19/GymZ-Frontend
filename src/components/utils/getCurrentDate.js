export const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0"); // Định dạng thành 01, 02, ...
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };
  