import Image from "next/image";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export const NoStoriesIllustration = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
      <Image
        src="/no-data.png"
        alt="No stories illustration"
        width={300}
        height={200}
        className="opacity-80"
      />
      <p className="text-lg text-gray-600">No stories created by you yet.</p>
      <Button
        color="primary"
        onPress={() => router.push("/create")}
        className="px-8 py-6 text-lg font-medium"
      >
        Create Your First Story
      </Button>
    </div>
  );
};
