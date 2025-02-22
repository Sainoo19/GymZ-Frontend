
const CardNews = ({ image, date, title, time }) => {
    return (
      <div className="flex gap-3 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center rounded-tl-lg rounded-bl-lg bg-secondary">
          <img src={image} alt={title} className="w-35 h-20 object-cover rounded-tl-lg" />
          <p
            className="text-sm text-white py-1"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
          >
            {date}
          </p>
        </div>
        <div className="flex flex-col justify-center px-8 py-4 animate-marquee-container-homenews">
        <h3 className=" max-w-xs text-lg font-bold animate-marquee-text">{title}</h3>
        <p className="text-sm text-gray-600 pt-4">{time}</p>
        </div>
      </div>
    );
  };
  
  export default CardNews;
  