import React, { useState } from "react";

const Carousel = ({ images }: { images: string }) => {
  console.log(images);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel relative">
      {currentIndex !== 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-500 text-white rounded-l focus:outline-none"
        >
          이전
        </button>
      )}
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        className="block w-full"
      />
      {currentIndex !== images.length - 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-500 text-white rounded-r focus:outline-none"
        >
          다음
        </button>
      )}
    </div>
  );
};

export default Carousel;
