import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

import Button from "../buttons/Button";
import { modalContainerVariants, modalItemVariants } from "../../libs/framer";
import { cls } from "../../libs/util";
import { useSearchParams } from "react-router-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  label: string;
  actionLabel?: string;
  secondActionLabel?: string;
  secondAction?: () => void;
  disabled?: boolean;
  body: React.ReactElement;
  big?: boolean;
  images?: string[];
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
  big = false,
}: ModalProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 모달의 위치 계산
  // const top = `calc( ${scrollPosition}px)`;
  const top = scrollPosition + "px";

  return (
    <AnimatePresence>
      {isOpen ? (
        // modal continaer
        <motion.div
          variants={modalContainerVariants}
          initial={modalContainerVariants.start}
          animate={modalContainerVariants.end}
          exit={modalContainerVariants.exit}
          className="absolute top-0 left-0 w-screen h-screen z-50 bg-black/50 flex items-center justify-center overflow-hidden"
          onClick={onClose}
        >
          {/* modal body */}
          <motion.div
            variants={modalItemVariants}
            initial={modalItemVariants.start}
            animate={modalItemVariants.end}
            exit={modalItemVariants.exit}
            className="max-w-xl h-full  sm:h-3/4 bg-white rounded flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            {/* modal head */}
            <div className="relative h-16 font-bold text-xl flex items-center justify-center">
              <div className="text-center">{label}</div>
              <div
                className="absolute cursor-pointer bg-slate-200  rounded-full p-2 right-4 flex items-center justify-center hover:opacity-50"
                onClick={onClose}
              >
                <AiOutlineClose />
              </div>
            </div>
            {/* modal body */}
            <div className="flex-1 px-6">{body}</div>
            {/* modal footer */}
            <div className="px-6 py-4 flex gap-6 items-center justify-end   ">
              {secondActionLabel && secondAction && (
                <Button
                  actionText={secondActionLabel}
                  onAction={secondAction}
                  canClick={true}
                  loading={disabled}
                />
              )}
              {actionLabel && onAction && (
                <Button
                  actionText={actionLabel}
                  onAction={onAction}
                  canClick={true}
                  loading={disabled}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
