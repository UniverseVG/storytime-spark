/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { Pricing } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/react";
import Script from "next/script";
import React, { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "../_context/UserDetailContext";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BuyCredits = () => {
  const options: Pricing[] = [
    {
      id: 1,
      price: 199,
      credits: 10,
    },
    {
      id: 2,
      price: 399,
      credits: 30,
    },
    {
      id: 3,
      price: 699,
      credits: 50,
    },
    {
      id: 4,
      price: 999,
      credits: 100,
    },
  ];

  const [selectedOption, setSelectedOption] = useState<Pricing>({
    id: 0,
    price: 0,
    credits: 0,
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

  // const [currency, setCurrency] = useState("INR");
  // const [loading, setLoading] = useState(false);
  const createOrderId = async () => {
    try {
      const response = await fetch("/api/order-credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error("There was a problem with your fetch operation:", error);
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
            const response = await updateCredits();
            if (response?.[0]?.id) {
              notify("Credits added successfully");
              setUserDetail?.((prev: any) => {
                return {
                  ...prev,
                  credit: (prev?.credit as number) + selectedOption.credits,
                };
              });
              router.replace("/dashboard");
            } else {
              notifyError("Something went wrong");
            }
          } else {
            notifyError("Something went wrong");
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: "#3399cc",
        },
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

  if (user?.fullName) {
    return (
      <div className="min-h-screen text-center p-10 md:px-20 lg:px-40">
        <h2 className="text-4xl font-bold text-primary">Add More Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          <div>
            {options.map((option) => (
              <div
                key={option.id}
                className={`p-6 my-3 border  text-center rounded-lg text-white cursor-pointer hover:border-3 hover:bg-blue-400 hover:scale-105 transition-all
                  ${selectedOption.id === option.id ? "border-3 bg-blue-400" : "bg-primary"}`}
                onClick={() => setSelectedOption(option)}
              >
                <h2>
                  Get {option.credits} Credits = {option.credits} Story
                </h2>
                <h2 className="font-bold text-2xl">₹{option.price}</h2>
              </div>
            ))}
          </div>
          <div>
            <Script
              id="razorpay-checkout-js"
              src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <section className="min-h-[94vh] flex flex-col gap-6 h-14 mx-5 sm:mx-10 2xl:mx-auto 2xl:w-[1400px]">
              <form
                className="flex flex-col gap-6 w-full sm:w-80"
                onSubmit={processPayment}
              >
                <div className="space-y-1">
                  <Input
                    type="text"
                    required
                    value={name}
                    labelPlacement="outside"
                    label="Name"
                    placeholder="John Doe"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    type="email"
                    placeholder="user@gmail.com"
                    required
                    value={email}
                    labelPlacement="outside"
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    type="number"
                    required
                    value={String(selectedOption?.price)}
                    labelPlacement="outside"
                    isDisabled
                    label="Amount"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">₹</span>
                      </div>
                    }
                    placeholder="0"
                  />
                </div>

                <Button type="submit">Pay</Button>
              </form>
            </section>
          </div>
        </div>
      </div>
    );
  }
};

export default BuyCredits;
