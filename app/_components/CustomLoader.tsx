/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/modal";
import Image from "next/image";

const CustomLoader = ({ isLoading }: { isLoading: boolean }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    onOpen();
  }, []);
  return (
    <div>
      {isLoading && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {() => (
              <>
                <ModalBody className="p-10 flex w-full items-center justify-center">
                  <Image
                    src="/loader.gif"
                    alt="loader"
                    width={300}
                    height={300}
                    className="w-[200px] h-[200px]"
                  />
                  <h2 className="text-2xl font-bold text-primary text-center">
                    Generating your story... Please wait.
                  </h2>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default CustomLoader;
