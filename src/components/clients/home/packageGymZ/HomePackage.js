import CartPackage from "./CardPackage";

const HomePackage = () => {
    return(
        <div>
            <div className="w-full px-4 ml-16">
                <p className="text-4xl font-bold text-secondary">CÁC GÓI TẬP TẠI GYMZ</p>
                <p className="text-4xl font-bold">GYM & FITNESS</p>
            </div>

            <div className="border-2 border-accent p-8 mx-48 my-8">
                <div className="flex justify-center gap-1">
                    <CartPackage 
                        name="GÓI STANDARD" 
                        price="299.000 VND" 
                        features={[
                            "Tập toàn hệ thống không phụ thu phí",
                            "Gửi xe miễn phí",
                            "Nước uống, khăn, máy lạnh miễn phí",
                            "Tập luyện không giới hạn thời gian"
                        ]}
                    />

                    <CartPackage 
                        name="GÓI VIP" 
                        price="599.000 VND" 
                        features={[
                            "Tập toàn hệ thống không phụ thu phí",
                            "Gửi xe miễn phí",
                            "Nước uống, khăn, máy lạnh miễn phí",
                            "Tập luyện không giới hạn thời gian"
                        ]}
                    />

                    <CartPackage 
                        name="GÓI SVIP" 
                        price="1.299.000 VND" 
                        features={[
                            "Tập toàn hệ thống không phụ thu phí",
                            "Gửi xe miễn phí",
                            "Nước uống, khăn, máy lạnh miễn phí",
                            "Tập luyện không giới hạn thời gian"
                        ]}
                    />
                </div>
            </div>
        </div>
        
    );
};

export default HomePackage;