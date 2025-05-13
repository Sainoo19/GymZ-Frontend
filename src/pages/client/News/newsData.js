export const newsCategories = [
    { id: "workout", name: "Tập luyện" },
    { id: "nutrition", name: "Dinh dưỡng" },
    { id: "lifestyle", name: "Lối sống" },
    { id: "equipment", name: "Thiết bị" },
    { id: "events", name: "Sự kiện" }
];

export const newsArticles = [
    {
        id: 1,
        slug: "5-bai-tap-hieu-qua-cho-nguoi-moi-bat-dau",
        title: "5 Bài tập hiệu quả cho người mới bắt đầu",
        short_description: "Bắt đầu hành trình tập luyện với những bài tập cơ bản nhưng hiệu quả cao, phù hợp cho người mới, dễ thực hiện và mang lại kết quả tốt.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1470&q=80",
        date: "2023-05-12",
        author: "Minh Tuấn",
        category: "workout",
        tags: ["tập luyện", "người mới", "cơ bản", "hiệu quả"],
        featured: true,
        readTime: 5,
        views: 1200,
        contentType: "guide",
        content: [
            {
                type: "paragraph",
                content: "Khi mới bắt đầu tập gym, việc chọn những bài tập phù hợp là vô cùng quan trọng. Không chỉ giúp bạn xây dựng nền tảng thể lực vững chắc mà còn tránh được chấn thương do kỹ thuật sai. Dưới đây là 5 bài tập cơ bản nhưng cực kỳ hiệu quả dành cho người mới."
            },
            {
                type: "heading",
                content: "1. Squat - Bài tập vua cho chân"
            },
            {
                type: "paragraph",
                content: "Squat là bài tập toàn thân tuyệt vời, tập trung vào nhóm cơ đùi, mông và cơ lõi. Đây là nền tảng cho hầu hết các bài tập chân và giúp tăng cường sức mạnh tổng thể."
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=1470&q=80",
                caption: "Kỹ thuật squat chuẩn với tư thế thẳng lưng"
            },
            {
                type: "paragraph",
                content: "Khi thực hiện squat, hãy đảm bảo giữ lưng thẳng, đầu gối không vượt quá mũi chân. Bắt đầu với bodyweight squat trước khi thêm tạ đòn hoặc kettlebell."
            },
            {
                type: "heading",
                content: "2. Push-up - Phát triển cơ ngực và vai"
            },
            {
                type: "paragraph",
                content: "Push-up không chỉ tập trung vào ngực mà còn kích hoạt cơ vai, tay sau và cơ lõi. Đây là bài tập đẩy cơ bản nhất mà bạn có thể thực hiện ở bất kỳ đâu."
            },
            {
                type: "list",
                items: [
                    "Bắt đầu với push-up trên tường nếu bạn chưa đủ sức",
                    "Tiến lên push-up trên đầu gối khi đã quen",
                    "Cuối cùng là push-up tiêu chuẩn và các biến thể nâng cao"
                ]
            },
            {
                type: "heading",
                content: "3. Deadlift - Bài tập toàn thân"
            },
            {
                type: "paragraph",
                content: "Deadlift kích hoạt gần như toàn bộ các nhóm cơ lớn trong cơ thể, đặc biệt là lưng dưới, chân và cơ lõi. Tuy nhiên, đây cũng là bài tập đòi hỏi kỹ thuật chuẩn để tránh chấn thương."
            },
            {
                type: "paragraph",
                content: "Khi mới bắt đầu, hãy nhờ huấn luyện viên hướng dẫn kỹ thuật và sử dụng trọng lượng nhẹ để làm quen với động tác. Tập trung vào việc giữ lưng thẳng và sử dụng sức mạnh chân để nâng tạ."
            },
            {
                type: "heading",
                content: "4. Plank - Củng cố cơ lõi"
            },
            {
                type: "paragraph",
                content: "Cơ lõi khỏe mạnh là nền tảng cho mọi bài tập và plank là cách tuyệt vời để rèn luyện sức mạnh cơ lõi. Bài tập này giúp cải thiện tư thế và ngăn ngừa chấn thương lưng dưới."
            },
            {
                type: "paragraph",
                content: "Bắt đầu với 20-30 giây và dần tăng thời gian khi cơ thể quen dần. Đảm bảo giữ cơ thể thẳng từ đầu đến chân, không để hông chúc xuống hoặc đẩy lên quá cao."
            },
            {
                type: "heading",
                content: "5. Bent-over Row - Phát triển lưng"
            },
            {
                type: "paragraph",
                content: "Bent-over row là bài tập cơ bản cho lưng, giúp phát triển sức mạnh kéo và cân bằng với các bài tập đẩy như push-up. Bài tập này còn tăng cường sức mạnh cầm nắm và cải thiện tư thế."
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=1471&q=80",
                caption: "Kỹ thuật bent-over row với tạ đòn"
            },
            {
                type: "paragraph",
                content: "Lời khuyên cuối cùng: hãy tập trung vào kỹ thuật đúng trước khi tăng trọng lượng. Kiên nhẫn với quá trình và lắng nghe cơ thể của bạn. Hãy nhờ huấn luyện viên hướng dẫn nếu bạn không chắc chắn về kỹ thuật của mình. Chúc bạn có hành trình tập luyện hiệu quả!"
            }
        ]
    },
    {
        id: 2,
        slug: "dinh-duong-cho-nguoi-tap-gym-nhung-dieu-can-biet",
        title: "Dinh dưỡng cho người tập gym: Những điều cần biết",
        short_description: "Xây dựng chế độ ăn khoa học là chìa khóa để đạt được kết quả tối ưu khi tập luyện. Bài viết này sẽ giúp bạn nắm được những nguyên tắc cơ bản về dinh dưỡng.",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1470&q=80",
        date: "2023-05-05",
        author: "Ngọc Lan",
        category: "nutrition",
        tags: ["dinh dưỡng", "protein", "carbs", "chế độ ăn"],
        featured: false,
        readTime: 7,
        views: 850,
        contentType: "guide",
        content: [
            {
                type: "paragraph",
                content: "Dinh dưỡng đóng vai trò quyết định trong việc đạt được mục tiêu tập luyện, dù đó là giảm cân, tăng cơ hay cải thiện sức khỏe tổng thể. Nhiều người tập gym thường chỉ tập trung vào bài tập mà bỏ qua tầm quan trọng của chế độ ăn uống, dẫn đến kết quả không như mong đợi."
            },
            {
                type: "heading",
                content: "Nhu cầu protein - Xây dựng và phục hồi cơ bắp"
            },
            {
                type: "paragraph",
                content: "Protein là dưỡng chất thiết yếu cho quá trình xây dựng và phục hồi cơ bắp sau khi tập luyện. Đối với người tập gym, lượng protein cần thiết thường cao hơn người bình thường, khoảng 1.6-2g/kg cân nặng mỗi ngày."
            },
            {
                type: "list",
                items: [
                    "Nguồn protein chất lượng cao: thịt nạc, cá, trứng, đậu phụ, sữa chua Hy Lạp",
                    "Protein whey: bổ sung nhanh chóng, đặc biệt hữu ích sau tập luyện",
                    "Phân bố protein đều trong ngày để tối ưu hóa tổng hợp protein cơ"
                ]
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1470&q=80",
                caption: "Các nguồn protein chất lượng cao cho người tập gym"
            },
            {
                type: "heading",
                content: "Carbohydrate - Nhiên liệu cho tập luyện"
            },
            {
                type: "paragraph",
                content: "Carbs thường bị hiểu lầm là kẻ thù của việc giảm cân, nhưng chúng thực sự là nguồn nhiên liệu chính cho các buổi tập cường độ cao. Chọn đúng loại carbs và thời điểm tiêu thụ là chìa khóa."
            },
            {
                type: "paragraph",
                content: "Ưu tiên carbs phức hợp như yến mạch, gạo lứt, khoai lang có chỉ số đường huyết thấp, giải phóng năng lượng từ từ. Sau tập luyện, carbs đơn giản như trái cây lại có lợi vì giúp nạp glycogen nhanh chóng."
            },
            {
                type: "heading",
                content: "Chất béo lành mạnh - Không thể thiếu"
            },
            {
                type: "paragraph",
                content: "Chất béo không phải là kẻ thù như nhiều người vẫn nghĩ. Chúng đóng vai trò quan trọng trong việc sản xuất hormone, trong đó có testosterone - hormone quan trọng cho việc phát triển cơ bắp."
            },
            {
                type: "list",
                items: [
                    "Omega-3 từ cá béo, hạt chia, hạt lanh giúp giảm viêm",
                    "Chất béo không bão hòa đơn từ dầu oliu, bơ, quả bơ hỗ trợ sức khỏe tim mạch",
                    "Hạn chế chất béo trans và chất béo bão hòa từ thực phẩm chế biến sẵn"
                ]
            },
            {
                type: "heading",
                content: "Thời điểm ăn - Tối ưu hóa hiệu quả tập luyện"
            },
            {
                type: "paragraph",
                content: "Thời điểm ăn quan trọng không kém gì việc ăn gì. Bữa ăn trước tập nên cách tập khoảng 2-3 giờ, chứa carbs và protein vừa phải, ít chất béo và chất xơ để tránh khó tiêu."
            },
            {
                type: "paragraph",
                content: "Bữa ăn sau tập nên được tiêu thụ trong vòng 45-60 phút sau khi kết thúc, tập trung vào protein chất lượng cao và carbs để tối ưu phục hồi và tăng cơ."
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1470&q=80",
                caption: "Bữa ăn sau tập với sự kết hợp giữa protein và carbs"
            },
            {
                type: "paragraph",
                content: "Kết luận: Một chế độ dinh dưỡng cân bằng kết hợp với tập luyện đúng cách là chìa khóa để đạt được mục tiêu thể hình. Hãy lắng nghe cơ thể và điều chỉnh cho phù hợp."
            }
        ]
    },
    {
        id: 3,
        slug: "5-dau-hieu-ban-dang-tap-gym-sai-cach",
        title: "5 Dấu hiệu bạn đang tập gym sai cách",
        short_description: "Tránh những sai lầm phổ biến trong quá trình tập luyện để đạt hiệu quả tối ưu và phòng ngừa chấn thương. Nhận biết 5 dấu hiệu cảnh báo bạn đang tập sai cách.",
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1470&q=80",
        date: "2023-04-28",
        author: "Hoàng Nam",
        category: "workout",
        tags: ["kỹ thuật tập", "chấn thương", "hiệu quả tập luyện"],
        featured: false,
        readTime: 6,
        views: 600,
        contentType: "guide",
        content: [
            {
                type: "paragraph",
                content: "Tập gym không chỉ là việc đến phòng tập và nâng tạ. Nó đòi hỏi kiến thức, kỹ thuật đúng và sự kiên nhẫn. Nhiều người tập luyện sai cách trong thời gian dài mà không nhận ra, dẫn đến kết quả kém và thậm chí là chấn thương."
            },
            {
                type: "heading",
                content: "1. Đau nhức kéo dài và không đúng chỗ"
            },
            {
                type: "paragraph",
                content: "Đau cơ nhẹ sau tập (DOMS) là bình thường, nhưng đau nhói ở khớp, cảm giác nóng rát hoặc đau tê ở vùng không phải nhóm cơ đang tập là dấu hiệu của vấn đề."
            },
            {
                type: "paragraph",
                content: "Đau nhức kéo dài hơn 72 giờ cũng là dấu hiệu của luyện tập quá mức hoặc kỹ thuật sai. Hãy ghi nhớ: đau nhẹ ở cơ bắp là bình thường, đau ở khớp là không bình thường."
            },
            {
                type: "heading",
                content: "2. Không thấy tiến bộ sau thời gian dài"
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=1470&q=80",
                caption: "Theo dõi tiến độ là cách tốt để đánh giá hiệu quả tập luyện"
            },
            {
                type: "paragraph",
                content: "Nếu bạn đã tập gym 3-4 buổi/tuần trong hơn 3 tháng mà không thấy tiến bộ về sức mạnh, sức bền hoặc vóc dáng, có khả năng bạn đang tập sai cách."
            },
            {
                type: "list",
                items: [
                    "Kiểm tra lại khối lượng, số lần lặp lại và cường độ tập",
                    "Đảm bảo chế độ dinh dưỡng hỗ trợ mục tiêu tập luyện",
                    "Xem xét lại chất lượng giấc ngủ và mức độ stress"
                ]
            },
            {
                type: "heading",
                content: "3. Chỉ tập các bài và nhóm cơ yêu thích"
            },
            {
                type: "paragraph",
                content: "Nhiều người chỉ tập những bài họ giỏi hoặc cảm thấy thoải mái, dẫn đến sự mất cân đối trong cơ thể, tư thế xấu và nguy cơ chấn thương cao."
            },
            {
                type: "paragraph",
                content: "Hãy áp dụng nguyên tắc tập toàn thân và cân đối, đảm bảo mọi nhóm cơ chính đều được kích thích đều đặn."
            },
            {
                type: "heading",
                content: "4. Tập quá nhanh hoặc quá chậm"
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=1470&q=80",
                caption: "Kiểm soát tốc độ tập là yếu tố quan trọng"
            },
            {
                type: "paragraph",
                content: "Tập quá nhanh làm giảm stress cơ học trên cơ bắp, trong khi tập quá chậm có thể dẫn đến mệt mỏi sớm. Hạ tạ chậm (2-3 giây), nâng tạ với tốc độ kiểm soát (1-2 giây)."
            },
            {
                type: "heading",
                content: "5. Không có kế hoạch tập luyện cụ thể"
            },
            {
                type: "paragraph",
                content: "Thiếu một chương trình tập có cấu trúc là nguyên nhân phổ biến nhất của việc không đạt kết quả. Một chương trình tập hiệu quả phải có sự tiến bộ dần dần và phù hợp với mục tiêu cá nhân."
            },
            {
                type: "paragraph",
                content: "Kết luận: Tập gym đúng cách đòi hỏi sự hiểu biết, kiên nhẫn và kỷ luật. Nếu nhận thấy bất kỳ dấu hiệu nào kể trên, hãy điều chỉnh phương pháp tập luyện hoặc tìm kiếm sự hướng dẫn từ huấn luyện viên chuyên nghiệp."
            }
        ]
    },
    {
        id: 4,
        slug: "lam-the-nao-de-giu-dong-luc-tap-luyen-moi-ngay",
        title: "Làm thế nào để giữ động lực tập luyện mỗi ngày",
        short_description: "Giữ động lực tập luyện lâu dài là thách thức lớn. Tìm hiểu các mẹo thực tế để duy trì thói quen tập gym đều đặn.",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1470&q=80",
        date: "2023-06-15",
        author: "Thảo Linh",
        category: "lifestyle",
        tags: ["động lực", "thói quen", "tập luyện", "lối sống"],
        featured: true,
        readTime: 4,
        views: 950,
        contentType: "guide",
        content: [
            {
                type: "paragraph",
                content: "Tập luyện đều đặn đòi hỏi không chỉ sức mạnh thể chất mà còn cả ý chí mạnh mẽ. Dưới đây là các mẹo giúp bạn duy trì động lực tập gym mỗi ngày."
            },
            {
                type: "heading",
                content: "1. Đặt mục tiêu cụ thể và khả thi"
            },
            {
                type: "paragraph",
                content: "Mục tiêu như 'tăng 5kg cơ bắp trong 6 tháng' rõ ràng hơn 'trở nên khỏe mạnh'. Hãy chia nhỏ mục tiêu để dễ theo dõi tiến độ."
            },
            {
                type: "heading",
                content: "2. Tạo thói quen cố định"
            },
            {
                type: "paragraph",
                content: "Tập luyện cùng giờ mỗi ngày giúp cơ thể hình thành thói quen. Chọn thời điểm phù hợp với lịch trình cá nhân, như sáng sớm hoặc sau giờ làm."
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1470&q=80",
                caption: "Tập luyện đều đặn giúp hình thành thói quen"
            },
            {
                type: "heading",
                content: "3. Tìm niềm vui trong tập luyện"
            },
            {
                type: "paragraph",
                content: "Chọn bài tập bạn yêu thích, nghe nhạc hoặc tập cùng bạn bè để tăng hứng thú. Sự đa dạng trong bài tập cũng giúp tránh nhàm chán."
            },
            {
                type: "list",
                items: [
                    "Thử các lớp yoga, Zumba hoặc CrossFit",
                    "Đổi lịch tập mỗi 4-6 tuần",
                    "Ghi lại cảm giác sau mỗi buổi tập để nhắc nhở bản thân"
                ]
            },
            {
                type: "paragraph",
                content: "Kết luận: Động lực không phải lúc nào cũng tự nhiên. Hãy xây dựng kỷ luật, tìm niềm vui và đặt mục tiêu rõ ràng để duy trì thói quen tập luyện lâu dài."
            }
        ]
    },
    {
        id: 5,
        slug: "chon-thiet-bi-tap-gym-tai-nha-phu-hop",
        title: "Chọn thiết bị tập gym tại nhà phù hợp",
        short_description: "Hướng dẫn chọn thiết bị tập gym tại nhà phù hợp với ngân sách, không gian và mục tiêu tập luyện của bạn.",
        image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1470&q=80",
        date: "2023-07-02",
        author: "Quang Huy",
        category: "equipment",
        tags: ["thiết bị", "gym tại nhà", "tạ", "máy chạy"],
        featured: false,
        readTime: 5,
        views: 700,
        contentType: "guide",
        content: [
            {
                type: "paragraph",
                content: "Tập gym tại nhà ngày càng phổ biến, nhưng việc chọn thiết bị phù hợp có thể khó khăn. Bài viết này giúp bạn đưa ra quyết định đúng đắn."
            },
            {
                type: "heading",
                content: "1. Xác định mục tiêu tập luyện"
            },
            {
                type: "paragraph",
                content: "Bạn muốn tăng cơ, giảm cân hay cải thiện sức bền? Mục tiêu sẽ quyết định thiết bị cần thiết, như tạ cho tăng cơ hoặc máy chạy bộ cho cardio."
            },
            {
                type: "heading",
                content: "2. Đánh giá không gian và ngân sách"
            },
            {
                type: "paragraph",
                content: "Đo không gian trước khi mua. Với không gian nhỏ, tạ điều chỉnh hoặc dây kháng lực là lựa chọn tốt. Đặt ngân sách rõ ràng để tránh mua thiết bị không cần thiết."
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1470&q=80",
                caption: "Thiết bị nhỏ gọn phù hợp cho không gian hạn chế"
            },
            {
                type: "heading",
                content: "3. Gợi ý thiết bị cơ bản"
            },
            {
                type: "list",
                items: [
                    "Tạ tay hoặc tạ điều chỉnh: Phù hợp mọi bài tập",
                    "Thảm yoga: Hỗ trợ plank, yoga, stretching",
                    "Dây kháng lực: Nhỏ gọn, đa năng",
                    "Máy chạy bộ: Lý tưởng cho cardio"
                ]
            },
            {
                type: "paragraph",
                content: "Kết luận: Chọn thiết bị dựa trên mục tiêu, không gian và ngân sách sẽ giúp bạn xây dựng phòng gym tại nhà hiệu quả và tiết kiệm."
            }
        ]
    },
    {
        id: 6,
        slug: "su-kien-marathon-2023-hanh-trinh-chinh-phuc",
        title: "Sự kiện Marathon 2023: Hành trình chinh phục",
        short_description: "Tham gia Marathon 2023 để thử thách bản thân và trải nghiệm tinh thần thể thao. Tìm hiểu thông tin chi tiết về sự kiện.",
        image: "https://images.unsplash.com/photo-1594882645126-140497817331?auto=format&fit=crop&w=1470&q=80",
        date: "2023-08-10",
        author: "Mai Anh",
        category: "events",
        tags: ["marathon", "sự kiện", "chạy bộ", "thể thao"],
        featured: true,
        readTime: 3,
        views: 1100,
        contentType: "news",
        content: [
            {
                type: "paragraph",
                content: "Marathon 2023 là sự kiện thể thao lớn, thu hút hàng ngàn vận động viên. Đây là cơ hội để bạn chinh phục giới hạn bản thân."
            },
            {
                type: "heading",
                content: "Thông tin sự kiện"
            },
            {
                type: "paragraph",
                content: "Thời gian: 15/10/2023. Địa điểm: Công viên trung tâm. Cự ly: 5km, 10km, 21km. Đăng ký trước 30/9/2023 để nhận ưu đãi."
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1543333995-a4146f709852?auto=format&fit=crop&w=1470&q=80",
                caption: "Không khí sôi động tại Marathon"
            },
            {
                type: "heading",
                content: "Lợi ích khi tham gia"
            },
            {
                type: "list",
                items: [
                    "Cải thiện sức khỏe tim mạch và sức bền",
                    "Kết nối với cộng đồng yêu thể thao",
                    "Nhận huy chương và quà tặng hoàn thành"
                ]
            },
            {
                type: "paragraph",
                content: "Kết luận: Đừng bỏ lỡ Marathon 2023! Đăng ký ngay để trải nghiệm hành trình đầy cảm hứng và thử thách."
            }
        ]
    },
    {
        id: 7,
        slug: "5-meo-giam-stress-cho-nguoi-ban-ron",
        title: "5 Mẹo giảm stress cho người bận rộn",
        short_description: "Khám phá 5 mẹo đơn giản nhưng hiệu quả để giảm stress, giúp bạn cân bằng cuộc sống bận rộn.",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1470&q=80",
        date: "2023-09-01",
        author: "Hà My",
        category: "lifestyle",
        tags: ["stress", "lối sống", "cân bằng", "sức khỏe tinh thần"],
        featured: false,
        readTime: 4,
        views: 800,
        contentType: "guide",
        content: [
            {
                type: "paragraph",
                content: "Cuộc sống bận rộn dễ khiến bạn căng thẳng. Dưới đây là 5 mẹo đơn giản để giảm stress mà không mất nhiều thời gian."
            },
            {
                type: "heading",
                content: "1. Thở sâu 5 phút mỗi ngày"
            },
            {
                type: "paragraph",
                content: "Thở sâu giúp làm dịu hệ thần kinh. Thực hiện 5 phút mỗi sáng hoặc khi cảm thấy căng thẳng."
            },
            {
                type: "heading",
                content: "2. Đi bộ ngắn"
            },
            {
                type: "paragraph",
                content: "Đi bộ 10-15 phút trong giờ nghỉ trưa giúp giải phóng endorphin, cải thiện tâm trạng."
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=1470&q=80",
                caption: "Đi bộ ngoài trời giúp giảm stress"
            },
            {
                type: "heading",
                content: "3. Viết nhật ký cảm xúc"
            },
            {
                type: "paragraph",
                content: "Ghi lại suy nghĩ và cảm xúc mỗi ngày giúp bạn giải tỏa áp lực và hiểu rõ bản thân hơn."
            },
            {
                type: "list",
                items: [
                    "Dành 5 phút viết trước khi đi ngủ",
                    "Tập trung vào điều tích cực trong ngày",
                    "Không cần viết dài, chỉ cần chân thành"
                ]
            },
            {
                type: "paragraph",
                content: "Kết luận: Giảm stress không cần phức tạp. Áp dụng các mẹo nhỏ này để cải thiện sức khỏe tinh thần và sống tích cực hơn."
            }
        ]
    },
    {
        id: 8,
        slug: "tap-hiit-lieu-phap-dot-chay-mo-hieu-qua",
        title: "Tập HIIT: Liệu pháp đốt cháy mỡ hiệu quả",
        short_description: "Tìm hiểu về HIIT - phương pháp tập luyện cường độ cao ngắt quãng giúp đốt mỡ nhanh và cải thiện sức khỏe.",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1470&q=80",
        date: "2023-10-05",
        author: "Đức Anh",
        category: "workout",
        tags: ["HIIT", "đốt mỡ", "tập luyện", "cường độ cao"],
        featured: true,
        readTime: 4,
        views: 900,
        contentType: "guide",
        content: [
            {
                type: "paragraph",
                content: "HIIT (High-Intensity Interval Training) là phương pháp tập luyện hiệu quả, phù hợp với người bận rộn muốn đốt mỡ và tăng sức bền."
            },
            {
                type: "heading",
                content: "1. HIIT là gì?"
            },
            {
                type: "paragraph",
                content: "HIIT kết hợp các đợt tập cường độ cao (như chạy nước rút) với thời gian nghỉ ngắn. Một buổi HIIT chỉ kéo dài 15-20 phút nhưng đốt calo hiệu quả."
            },
            {
                type: "heading",
                content: "2. Lợi ích của HIIT"
            },
            {
                type: "list",
                items: [
                    "Đốt mỡ nhanh, ngay cả sau khi tập",
                    "Cải thiện sức khỏe tim mạch",
                    "Không cần thiết bị, tập mọi nơi"
                ]
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1470&q=80",
                caption: "HIIT với các bài tập cường độ cao"
            },
            {
                type: "heading",
                content: "3. Mẫu bài tập HIIT cơ bản"
            },
            {
                type: "paragraph",
                content: "Thực hiện 4 vòng: 30 giây Burpees, 30 giây Squat Jump, 30 giây nghỉ. Bắt đầu chậm và tăng dần cường độ."
            },
            {
                type: "paragraph",
                content: "Kết luận: HIIT là lựa chọn tuyệt vời để đốt mỡ và cải thiện sức khỏe. Hãy thử ngay để cảm nhận sự khác biệt!"
            }
        ]
    },
    {
        id: 9,
        slug: "thuc-pham-giup-phuc-hoi-co-bap-nhanh-chong",
        title: "Thực phẩm giúp phục hồi cơ bắp nhanh chóng",
        short_description: "Khám phá các thực phẩm hỗ trợ phục hồi cơ bắp sau tập luyện, giúp bạn tối ưu hóa kết quả tập gym.",
        image: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=1470&q=80",
        date: "2023-11-12",
        author: "Ngọc Ánh",
        category: "nutrition",
        tags: ["phục hồi", "thực phẩm", "protein", "dinh dưỡng"],
        featured: false,
        readTime: 5,
        views: 750,
        contentType: "guide",
        content: [
            {
                type: "paragraph",
                content: "Phục hồi cơ bắp là yếu tố quan trọng để tăng cơ và cải thiện hiệu suất. Dưới đây là các thực phẩm giúp bạn phục hồi nhanh hơn."
            },
            {
                type: "heading",
                content: "1. Thực phẩm giàu protein"
            },
            {
                type: "paragraph",
                content: "Protein sửa chữa cơ bắp bị tổn thương. Ưu tiên trứng, cá hồi, ức gà hoặc protein whey sau tập."
            },
            {
                type: "heading",
                content: "2. Carbohydrate để nạp năng lượng"
            },
            {
                type: "paragraph",
                content: "Khoai lang, gạo lứt hoặc chuối giúp bổ sung glycogen, cung cấp năng lượng cho cơ bắp."
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1470&q=80",
                caption: "Bữa ăn giàu protein và carbs hỗ trợ phục hồi"
            },
            {
                type: "heading",
                content: "3. Thực phẩm chống viêm"
            },
            {
                type: "list",
                items: [
                    "Quả anh đào: Giảm đau nhức cơ",
                    "Hạt óc chó: Chứa omega-3 chống viêm",
                    "Nước dừa: Bổ sung điện giải"
                ]
            },
            {
                type: "paragraph",
                content: "Kết luận: Kết hợp protein, carbs và thực phẩm chống viêm sẽ giúp cơ bắp phục hồi nhanh, sẵn sàng cho buổi tập tiếp theo."
            }
        ]
    },
    {
        id: 10,
        slug: "cai-thien-giac-ngu-de-tap-luyen-hieu-qua",
        title: "Cải thiện giấc ngủ để tập luyện hiệu quả",
        short_description: "Giấc ngủ ảnh hưởng lớn đến hiệu suất tập luyện. Tìm hiểu cách cải thiện chất lượng giấc ngủ để tối ưu hóa kết quả.",
        image: "https://images.unsplash.com/photo-1512207702400-4b7dcbe667c6?auto=format&fit=crop&w=1470&q=80",
        date: "2023-12-01",
        author: "Minh Đức",
        category: "lifestyle",
        tags: ["giấc ngủ", "tập luyện", "phục hồi", "lối sống"],
        featured: false,
        readTime: 4,
        views: 650,
        contentType: "guide",
        content: [
            {
                type: "paragraph",
                content: "Giấc ngủ chất lượng giúp cơ bắp phục hồi và tăng hiệu suất tập luyện. Dưới đây là các mẹo để cải thiện giấc ngủ."
            },
            {
                type: "heading",
                content: "1. Duy trì giờ ngủ cố định"
            },
            {
                type: "paragraph",
                content: "Đi ngủ và thức dậy cùng giờ mỗi ngày giúp đồng hồ sinh học ổn định, cải thiện chất lượng giấc ngủ."
            },
            {
                type: "heading",
                content: "2. Tạo môi trường ngủ lý tưởng"
            },
            {
                type: "paragraph",
                content: "Giữ phòng tối, yên tĩnh và mát mẻ. Sử dụng rèm cản sáng và tránh ánh sáng xanh từ điện thoại trước khi ngủ."
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1524804054287-69e9096f9f96?auto=format&fit=crop&w=1470&q=80",
                caption: "Phòng ngủ thoải mái hỗ trợ giấc ngủ sâu"
            },
            {
                type: "heading",
                content: "3. Hạn chế caffeine và tập nặng buổi tối"
            },
            {
                type: "list",
                items: [
                    "Tránh cà phê sau 2 giờ chiều",
                    "Tập nhẹ như yoga thay vì HIIT trước giờ ngủ",
                    "Thiền 5-10 phút để thư giãn"
                ]
            },
            {
                type: "paragraph",
                content: "Kết luận: Giấc ngủ tốt là nền tảng cho tập luyện hiệu quả. Áp dụng các mẹo này để tối ưu hóa sức khỏe và hiệu suất."
            }
        ]
    }
];