//tạm thời chưa sử dụng đến 





// Kiểm tra email hợp lệ
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Email không hợp lệ";
};

// // Kiểm tra trường không được để trống
// export const validateRequired = (value) => {
//     return value.trim() ? "" : "Trường này không được để trống";
// };

// Kiểm tra số điện thoại (chỉ cho phép số)
export const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone) ? "" : "Số điện thoại không hợp lệ";
};

// Kiểm tra số lương hợp lệ (phải là số dương)
export const validateSalary = (salary) => {
    // Kiểm tra nếu lương trống
    if (salary === "" || salary === null || salary === undefined) {
        return "Lương không được để trống";
    }

    // Loại bỏ dấu phân cách (dấu ".") nếu có
    const numericSalary = salary.replace(/\./g, "");

    // Kiểm tra nếu giá trị sau khi loại bỏ dấu phân cách là một số và lớn hơn 0
    const salaryNumber = parseInt(numericSalary);

    if (isNaN(salaryNumber) || salaryNumber <= 0) {
        return "Lương phải là số dương và lớn hơn 0";
    }

    return ""; // Trả về chuỗi rỗng nếu không có lỗi
};



// Hàm tổng kiểm tra toàn bộ dữ liệu nhập vào
export const validateEmployeeData = (data) => {
    let errors = {};

    // Duyệt qua từng trường để kiểm tra lỗi
    Object.keys(data).forEach((key) => {
        switch (key) {
            case "email":
                errors.email = validateEmail(data.email);
                break;
            case "phone":
                errors.phone = validatePhone(data.phone);
                break;
            case "salary":
                errors.salary = validateSalary(data.salary);
                break;
            // default:
            //     errors[key] = validateRequired(data[key]);
        }
    });

    // Xóa các lỗi không có để tránh hiển thị thừa
    Object.keys(errors).forEach((key) => {
        if (!errors[key]) delete errors[key];
    });

    return errors;
};
