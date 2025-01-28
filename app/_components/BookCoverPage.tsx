import Image from "next/image";
import React from "react";

const BookCoverPage = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div>
      <Image src={imageUrl} alt="Book Cover" width={500} height={500} />
    </div>
  );
};

export default BookCoverPage;
