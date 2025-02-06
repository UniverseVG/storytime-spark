"use client";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { MdTopic } from "react-icons/md";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const notify = (msg: string) => {
    toast(msg, {});
  };

  const notifyError = (msg: string) => {
    toast.error(msg);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_PUBLIC_KEY!
      )
      .then(
        (result) => {
          console.info(result.text);
          notify("Message sent successfully");
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        },
        (error) => {
          console.error(error.text);
          notifyError("Error sending message");
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        }
      );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 sm:p-10">
      <form
        className="flex flex-col gap-6 w-full max-w-2xl p-8 rounded-2xl bg-gradient-to-br from-blue-50/80 to-purple-50/80 border border-gray-200 shadow-lg hover:shadow-xl transition-all"
        onSubmit={handleSubmit}
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#5253A3] to-[#6D6DB5] bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="text-gray-600 text-lg">We&apos;re here to help you!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            isRequired
            type="text"
            label="Full Name"
            labelPlacement="outside"
            placeholder="John Doe"
            startContent={
              <FaRegUser className="text-xl text-[#5253A3]/80 mr-2" />
            }
            classNames={{
              base: "col-span-2 md:col-span-1",
              inputWrapper:
                "bg-gray-50 border-gray-200 hover:bg-gray-100 group-data-[focus=true]:bg-gray-100",
              input: "text-gray-900 placeholder:text-gray-400",
              label: "text-gray-700 font-medium",
            }}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            isRequired
            type="email"
            label="Email Address"
            labelPlacement="outside"
            placeholder="john@example.com"
            startContent={<CiMail className="text-xl text-[#5253A3]/80 mr-2" />}
            classNames={{
              base: "col-span-2 md:col-span-1",
              inputWrapper:
                "bg-gray-50 border-gray-200 hover:bg-gray-100 group-data-[focus=true]:bg-gray-100",
              input: "text-gray-900 placeholder:text-gray-400",
              label: "text-gray-700 font-medium",
            }}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <Select
          label="Subject"
          labelPlacement="outside"
          placeholder="Select a subject"
          classNames={{
            trigger:
              "bg-gray-50 border-gray-200 hover:bg-gray-100 data-[focus=true]:bg-gray-100",
            value: "text-gray-900",
            label: "text-gray-700 font-medium",
            popoverContent: "bg-white border-gray-200",
          }}
          startContent={<MdTopic className="text-xl text-[#5253A3]/80 mr-2" />}
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
        >
          <SelectItem
            key="General Inquiry"
            className="text-gray-900 hover:bg-gray-100"
            value={"General Inquiry"}
          >
            General Inquiry
          </SelectItem>
          <SelectItem
            key="Technical Support"
            className="text-gray-900 hover:bg-gray-100"
            value={"Technical Support"}
          >
            Technical Support
          </SelectItem>
          <SelectItem
            key="Product Feedback"
            className="text-gray-900 hover:bg-gray-100"
            value={"Product Feedback"}
          >
            Product Feedback
          </SelectItem>
        </Select>

        <Textarea
          isRequired
          label="Message"
          labelPlacement="outside"
          placeholder="Write your message here..."
          minRows={5}
          classNames={{
            inputWrapper:
              "bg-gray-50 border-gray-200 hover:bg-gray-100 group-data-[focus=true]:bg-gray-100",
            input: "text-gray-900 placeholder:text-gray-400",
            label: "text-gray-700 font-medium",
          }}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#5253A3] to-[#6D6DB5] text-white font-semibold py-6 text-lg rounded-xl 
                    hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          Send Message
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          We will get back to you within 24 hours.
        </p>
      </form>
    </div>
  );
};

export default Contact;
