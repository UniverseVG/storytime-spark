import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
      <div>
        <Image
          src="/login.png"
          alt="sign-in"
          width={700}
          height={1000}
          className="w-full h-screen mt-10 md:mt-0"
        />
      </div>
      <div className="flex items-center justify-center h-screen order-first md:order-last mt-10 md:mt-0">
        <SignUp afterSignUpUrl={"/dashboard"} />
      </div>
    </div>
  );
}
