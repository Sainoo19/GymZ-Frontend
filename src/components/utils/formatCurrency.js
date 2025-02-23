const formatCurrency = (value) => {
  if (typeof value !== "string") {
    value = String(value); // Chuyển về chuỗi nếu không phải
  }
  let number = value.replace(/\D/g, ""); // Xóa ký tự không phải số
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Thêm dấu ","
};
export default formatCurrency;
