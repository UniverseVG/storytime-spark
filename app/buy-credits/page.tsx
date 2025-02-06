/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { Pricing } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/react";
import Script from "next/script";
import React, { useContext, useEffect, useState, Suspense } from "react";
import { UserDetailContext } from "../_context/UserDetailContext";
import { eq } from "drizzle-orm";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BuyCredits = () => {
  const options: Pricing[] = [
    { id: 1, price: 199, credits: 10, isPopular: true },
    { id: 2, price: 399, credits: 30, isPopular: false },
    { id: 3, price: 699, credits: 50, isPopular: false },
    { id: 4, price: 999, credits: 100, isPopular: false },
  ];

  const [selectedOption, setSelectedOption] = useState<Pricing>({
    id: 0,
    price: 0,
    credits: 0,
    isPopular: false,
  });
  const { user } = useUser();
  const context = useContext(UserDetailContext);
  const userDetail = context?.userDetail;
  const setUserDetail = context?.setUserDetail;
  const [name, setName] = useState(user?.fullName as string);
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress);
  const router = useRouter();

  const notify = (msg: string) => {
    toast(msg, {});
  };
  const notifyError = (msg: string) => {
    toast.error(msg);
  };

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [user]);

  const createOrderId = async () => {
    try {
      const response = await fetch("/api/order-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(String(selectedOption.price)) * 100,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const orderId: string = await createOrderId();
      const options = {
        key: process.env.key_id,
        amount: parseFloat(String(selectedOption.price)) * 100,
        currency: "INR",
        name: "name",
        description: "description",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };
          const result = await fetch("/api/verify-order", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.isOk) {
            const updateResult = await updateCredits();
            if (updateResult?.[0]?.id) {
              notify("Credits added successfully");
              setUserDetail?.((prev: any) => ({
                ...prev,
                credit: (prev?.credit as number) + selectedOption.credits,
              }));
              router.replace("/dashboard");
            } else {
              notifyError("Something went wrong");
            }
          } else {
            notifyError("Something went wrong");
          }
        },
        prefill: { name, email },
        theme: { color: "#3399cc" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.error(error);
    }
  };

  const updateCredits = async () => {
    try {
      const response = await db
        .update(Users)
        .set({
          credit: selectedOption.credits + (userDetail?.credit as number),
        })
        .where(
          eq(Users.userEmail, user?.primaryEmailAddress?.emailAddress as string)
        )
        .returning({ id: Users?.id });
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 text-center py-10">
      {/* Page Title */}
      <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-primary">
        Add More Credits
      </h2>

      <Suspense fallback={<div>Loading...</div>}>
        <PaymentSection
          options={options}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          name={name}
          email={email}
          setName={setName}
          setEmail={setEmail}
          processPayment={processPayment}
          selectedOptionPrice={selectedOption.price}
        />
      </Suspense>
    </div>
  );
};

const PaymentSection = ({
  options,
  selectedOption,
  setSelectedOption,
  name,
  email,
  setName,
  setEmail,
  processPayment,
  selectedOptionPrice,
}: {
  options: Pricing[];
  selectedOption: Pricing;
  setSelectedOption: (option: Pricing) => void;
  name: string;
  email: string | undefined;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  processPayment: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedOptionPrice: number;
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    const price = searchParams.get("price");
    const credits = searchParams.get("credits");

    if (id && price && credits) {
      const selected = options.find((option) => option.id === parseInt(id));
      if (selected) {
        setSelectedOption(selected);
      }
    }
  }, [searchParams]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
      {/* Left Side: Plan Selection */}
      <div className="space-y-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
          Choose Your Plan
        </h1>

        {options.map((option) => (
          <div
            key={option.id}
            className={`
              relative p-4 sm:p-6 rounded-xl cursor-pointer transition-all duration-300 ease-out border
              backdrop-blur-lg hover:scale-[1.02] hover:shadow-md
              ${
                selectedOption.id === option.id
                  ? "bg-gradient-to-br from-blue-50/80 to-purple-50/80 border-blue-300 shadow-lg ring-2 ring-blue-200"
                  : "bg-white/80 hover:bg-white/90 border-gray-200"
              }
            `}
            onClick={() => setSelectedOption(option)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 -z-10" />
            <div className="absolute inset-0 opacity-0 hover:opacity-30 transition-opacity bg-gradient-to-r from-transparent via-blue-50/40 to-transparent" />

            {option.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-md">
                Most Popular
              </div>
            )}

            <div className="relative flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {option.credits} AI Story Generations
              </h2>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-xl text-blue-600">₹</span>
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {option.price}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                <div className="p-1 bg-blue-100/50 rounded-lg backdrop-blur-sm">
                  <Image
                    src="/coin.png"
                    alt="Credits"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </div>
                <span>
                  {option.credits} AI Generations • {option.credits} Stories
                </span>
              </div>
              <button
                className={`
                  w-full max-w-[180px] py-2 rounded-lg font-semibold transition-all border
                  ${
                    selectedOption.id === option.id
                      ? "bg-gradient-to-r from-[#5253A3] to-[#6D6DB5] text-white shadow-md border-transparent"
                      : "bg-gray-100/50 text-gray-700 hover:bg-gray-200/50 backdrop-blur-sm border-gray-300"
                  }
                `}
              >
                {selectedOption.id === option.id ? "Selected" : "Choose Plan"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right Side: Payment Details */}
      <div>
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
        <section className="flex flex-col items-center gap-8 mx-4 sm:mx-6 md:mx-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
            Payment Details
          </h1>
          <form
            className="flex flex-col gap-6 w-full max-w-md p-6 sm:p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-lg"
            onSubmit={processPayment}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                required
                value={name}
                labelPlacement="outside"
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="user@gmail.com"
                required
                value={email}
                labelPlacement="outside"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Amount
              </label>
              <Input
                type="number"
                required
                value={String(selectedOptionPrice)}
                labelPlacement="outside"
                isDisabled
                placeholder="0"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-sm">₹</span>
                  </div>
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              color="primary"
              isDisabled={!selectedOptionPrice}
              className="w-full bg-gradient-to-r from-[#5253A3] to-[#6D6DB5] text-white font-semibold py-2 rounded-lg hover:bg-gradient-to-r hover:from-[#5253A3]/80 hover:to-[#6D6DB5]/80 transition-all"
            >
              Pay
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default BuyCredits;
