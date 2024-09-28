import axios from "axios";
import React, { useState } from "react";
import Settings from "./settings";
import Edit from "@/app/Edit/page";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

function Modal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  return (
    <>
      <button onClick={openModal}>
        <Settings />
      </button>
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={handleOverlayClick}>
          <Edit />
        </div>
      )}
    </>
  );
}
export default Modal;
