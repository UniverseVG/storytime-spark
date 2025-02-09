"use client";
import { Pricing } from "@/types";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const PricingPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const options: Pricing[] = [
    {
      id: 1,
      price: 199,
      credits: 10,
      isPopular: true,
    },
    {
      id: 2,
      price: 399,
      credits: 30,
      isPopular: false,
    },
    {
      id: 3,
      price: 699,
      credits: 50,
      isPopular: false,
    },
    {
      id: 4,
      price: 999,
      credits: 100,
      isPopular: false,
    },
  ];

  const [selectedOption, setSelectedOption] = useState<Pricing>({
    id: 0,
    price: 0,
    credits: 0,
    isPopular: false,
  });
  const handleButtonClick = (option: Pricing) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const query = new URLSearchParams({
      id: option.id.toString(),
      price: option.price.toString(),
      credits: option.credits.toString(),
    }).toString();
    router.push(`/buy-credits?${query}`);
  };

  return (
    <div className="min-h-screen py-20 px-5 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-primary bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-primary max-w-2xl mx-auto">
            Unlock the full potential of AI story generation with flexible
            credit packages. Get{" "}
            <span className="font-semibold">3 free credits</span> on signup!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {options.map((option) => (
            <div
              key={option.id}
              className={`
              relative group p-8 rounded-2xl cursor-pointer
              transition-all duration-300 ease-out
              border border-gray-200
              backdrop-blur-lg
              hover:scale-[1.02] hover:shadow-xl
              ${
                selectedOption.id === option.id
                  ? "bg-gradient-to-br from-blue-50/80 to-purple-50/80 border-blue-300 shadow-lg scale-[1.02] ring-2 ring-blue-200"
                  : "bg-white/80 hover:bg-white/90"
              }
            `}
              onClick={() => {
                setSelectedOption(option);
                handleButtonClick(option);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 -z-10" />

              <div className="absolute inset-0 opacity-0 hover:opacity-30 transition-opacity bg-gradient-to-r from-transparent via-blue-50/40 to-transparent" />

              {option.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div className="relative flex flex-col items-center justify-center space-y-6 text-center">
                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-800">
                  {option.credits} Credits
                </h2>

                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-3xl text-blue-600">₹</span>
                  <span className="text-5xl font-bold text-gray-900">
                    {option.price}
                  </span>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-blue-100/50 rounded-lg backdrop-blur-sm">
                      <Image
                        src="/coin.png"
                        alt="Credits"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                    <span>{option.credits} AI Generations</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-purple-100/50 rounded-lg backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <span>{option.credits} Stories</span>
                  </div>
                </div>

                <button
                  className={`
                    w-full max-w-[200px] py-3 rounded-lg font-semibold transition-all border
                    ${
                      selectedOption.id === option.id
                        ? "bg-gradient-to-r from-[#5253A3] to-[#6D6DB5] text-white shadow-md border-transparent"
                        : "bg-gray-100/50 text-gray-700 hover:bg-gray-200/50 backdrop-blur-sm border-gray-300"
                    }
                  `}
                  onClick={() => handleButtonClick(option)}
                >
                  {selectedOption.id === option.id ? "Selected" : "Choose Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-600">
            Need help choosing?{" "}
            <Link href="/contact-us">
              <span className="text-blue-600 cursor-pointer hover:underline">
                Contact Us
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
