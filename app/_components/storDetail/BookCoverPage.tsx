import Image from "next/image";
import React from "react";

interface BookCoverPageProps {
  imageUrl: string;
}

const BookCoverPage = ({ imageUrl }: BookCoverPageProps) => {
  return (
    <div className="flex items-center justify-center bg-white rounded-lg shadow-lg overflow-hidden">
      <Image
        src={imageUrl}
        alt="Book Cover"
        width={500}
        height={500}
        className="object-cover"
      />
    </div>
  );
};

export default BookCoverPage;
