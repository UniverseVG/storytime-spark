import Image from "next/image";
import React from "react";

interface BookCoverPageProps {
  imageUrl: string;
  title?: string;
  height?: string;
}

const BookCoverPage = ({
  imageUrl,
  title,
  height = "h-[600px]",
}: BookCoverPageProps) => {
  return (
    <div
      className={`relative bg-primary-50 p-8 md:p-12 border-4 border-primary-900 
                transform perspective-1000 rotate-y-0 ${height}
                before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJnIiBjeD0iNTAwJSIgY3k9IjUwMCUiIHI9IjYwMCUiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC41LDAuNSkgcm90YXRlKDApIHNjYWxlKDAuNSwxKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0icmdiYSgyNTUsMjQxLDIwNiwwLjQpIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJyZ2JhKDI1NSwyNDEsMjA2LDAuMikiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4=')] 
                before:opacity-20 before:pointer-events-none
                after:absolute after:inset-0 after:border-2 after:border-primary-700 after:opacity-30
                shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] transition-shadow
                scrollbar-thin scrollbar-thumb-primary-800 scrollbar-track-primary-100
                group/codex`}
    >
      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-primary-800" />
      <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-primary-800" />
      <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-primary-800" />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-primary-800" />

      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[90%] bg-gradient-to-r from-primary-800 to-primary-900
                shadow-[4px_0_8px_rgba(0,0,0,0.3)] rounded-r-lg"
      />

      <div
        className="absolute right-0 top-0 h-full w-2 bg-gradient-to-r from-primary-400/30 to-transparent
                shadow-[-4px_0_8px_rgba(0,0,0,0.2)]"
      />

      <div className="absolute bottom-4 right-4 opacity-10 w-16 h-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAgMTIuNUwzNi44IDQwLjZMMCA0NS44bDI1IDI0LjctNi4zIDM0LjdMNTAgODIuNWwyOS4zIDIxLjdMNzMgNzAuNSA5OCA0NS44IDYzLjIgNDAuNnoiIGZpbGw9IiM1MjUzQTMiLz48L3N2Zw==')]" />

      <div className="relative w-full h-[70%] mb-8 overflow-hidden">
        <Image
          src={imageUrl}
          alt="Book Cover"
          layout="fill"
          objectFit="cover"
          className="shadow-lg"
        />
      </div>

      {title && (
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 text-center tracking-wider">
          {title}
        </h1>
      )}
    </div>
  );
};

export default BookCoverPage;
