import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button";
import { modalContainerVariants, modalItemVariants } from "../../libs/framer";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  label: string;
  actionLabel: string;
  secondActionLabel?: string;
  secondAction?: () => void;
  disabled?: boolean;
  body: React.ReactElement;
}

const Modal = ({
  isOpen,
  onClose,
  onAction,
  actionLabel,
  label,
  body,
  secondActionLabel,
  secondAction,
  disabled,
}: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen ? (
        // modal continaer
        <motion.div
          variants={modalContainerVariants}
          initial={modalContainerVariants.start}
          animate={modalContainerVariants.end}
          exit={modalContainerVariants.exit}
          className="fixed inset-0 flex items-center justify-center z-50 "
          // className="absolute top-0 left-0 w-screen h-screen z-10 bg-black/50 flex items-center justify-center overflow-hidden "
        >
          {/* modal body */}
          <motion.div
            variants={modalItemVariants}
            initial={modalItemVariants.start}
            animate={modalItemVariants.end}
            exit={modalItemVariants.exit}
            className="h-full  sm:h-2/3 w-full sm:w-2/3 lg:w-1/2 bg-white rounded flex flex-col "
          >
            {/* modal head */}
            <div className="relative h-16 font-bold text-xl flex items-center justify-center">
              <div className="text-center">{label}</div>
              <div
                className="absolute  h-full w-16 right-0 flex items-center justify-center hover:opacity-50"
                onClick={onClose}
              >
                ❌{/* <AiOutlineClose size={24} /> */}
              </div>
            </div>
            {/* modal body */}
            <div className="flex-1 px-6">{body}</div>
            {/* modal footer */}
            <div className="px-6 py-4 flex gap-6 ">
              {secondActionLabel && secondAction && (
                <Button
                  actionText={secondActionLabel}
                  onAction={secondAction}
                  canClick={true}
                  loading={disabled}
                />
              )}
              <Button
                actionText={actionLabel}
                onAction={onAction}
                canClick={true}
                loading={disabled}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
