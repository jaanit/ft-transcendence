"use client";
import { MouseEvent, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import About from "./about";
import Image from "next/image";
import emailjs from "@emailjs/browser";
import styles from "../app/styles.module.css";

export const close = (
  <svg
    aria-label="Close"
    className="text-gray-300 hover:text-white x1lliihq x1n2onr6 x5n08af"
    fill="none"
    height="21"
    role="img"
    viewBox="0 0 24 24"
    width="22"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 6 L5 18 M5 6 L19 18" />
  </svg>
);

const Toggle = () => {
  const [show, setShow] = useState(false);
  const [about, setAbout] = useState(false);
  const [contact, setContact] = useState(false);
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const aboutRef = useRef<HTMLDivElement>(null);

  const form = useRef<HTMLFormElement | null>(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const emailSecret = process.env.NEXT_PUBLIC_EMAIL_SECRET;
      const emailTemplate = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE;
      if (emailSecret && emailTemplate) {
        await emailjs.sendForm(
          "gmail",
          emailTemplate,
          form.current!,
          emailSecret
        );
      }
      setContact(false);
    } catch (error) {}
  };
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) setSubject(e.target.value);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 10) setName(e.target.value);
  };
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 50) setMessage(e.target.value);
  };
  const handleInputChange = () => {
    if (subject && name && message) {
      setIsButtonDisabled(
        !subject.valueOf || !name.valueOf || !message.valueOf
      );
    }
  };

  const handleAboutRef = (event: MouseEvent) => {
    if (aboutRef.current && !aboutRef.current.contains(event.target as Node)) {
      setAbout(false);
    }
  };
  const handleContactRef = (event: MouseEvent) => {
    if (form.current && !form.current.contains(event.target as Node)) {
      setContact(false);
    }
  };
  useEffect(() => {
    if (about) {
      document.addEventListener(
        "click",
        handleAboutRef as unknown as (event: Event) => void
      );
    } else {
      document.removeEventListener(
        "click",
        handleAboutRef as unknown as (event: Event) => void
      );
    }
    if (contact) {
      document.addEventListener(
        "click",
        handleContactRef as unknown as (event: Event) => void
      );
    } else {
      document.removeEventListener(
        "click",
        handleContactRef as unknown as (event: Event) => void
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleAboutRef as unknown as (event: Event) => void
      );
      document.removeEventListener(
        "click",
        handleContactRef as unknown as (event: Event) => void
      );
    };
  }, [about, contact]);
  return (
    <>
      <div>
        <div>
          <button
            onClick={() => {
              setShow(true);
            }}
            className="bg-black hover:bg-white flex justify-center md:hidden text-white hover:text-black w-24 p-2 "
          >
            Menu
          </button>
        </div>
        <div className="hidden md:flex gap-10 font-[Guji] text-md font-bold text-white">
          <button onClick={() => setAbout(true)} className="">
            About Us
          </button>
          <Link
            href={"https://discord.gg/YUXWWWJvJb"}
            target="blank"
            className=""
          >
            Discord
          </Link>
          <button onClick={() => setContact(true)} className="">
            Contact Us
          </button>
        </div>
      </div>
      {show && (
        <div className="absolute  top-0 left-0 bottom-0 right-0 z-50 backdrop-blur-sm ">
          <motion.div
            initial={{
              y: -100,
            }}
            animate={{
              y: 0,
            }}
            className="flex flex-col mx-5 mt-5 p-5 bg-black bg-opacity-80 gap-4 font-[Guji] text-md font-bold text-white rounded-2xl"
          >
            <div className="flex justify-between">
              <button
                onClick={() => setAbout(true)}
                className="flex hover:text-xl"
              >
                About Us
              </button>
              <button onClick={() => setShow(false)}>{close}</button>
            </div>
            <Link
              href={"https://discord.gg/YUXWWWJvJb"}
              target="blank"
              className="hover:text-xl"
            >
              Discord
            </Link>
            <button
              onClick={() => setContact(true)}
              className="flex hover:text-xl"
            >
              Contact Us
            </button>
          </motion.div>
        </div>
      )}
      {about && (
        <div className="absolute top-0 left-0 bottom-0 right-0 z-50 backdrop-blur-sm">
          <div
            ref={aboutRef}
            className="mx-5 mt-24 p-5  bg-opacity-80  font-[Guji] text-md font-bold text-white rounded-2xl bg-white"
          >
            <About />
          </div>
        </div>
      )}
      {contact && (
        <div className="absolute top-0 left-0 bottom-0 right-0 z-50 backdrop-blur-sm">
          <form
            ref={form}
            onSubmit={sendEmail}
            onChange={handleInputChange}
            className="mx-5 mt-24 p-5  bg-opacity-80    rounded-2xl bg-black text-white"
          >
            <div className="z-0 relative p-2 md:rounded-3xl overflow-y-scroll no-scrollbar">
              <div className="">
                <div className="py-5">
                  <div className="p-2 flex flex-col my-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <label className="py-1">Subject</label>
                      <span className="text-[12px]">{subject.length}/20</span>
                    </div>
                    <input
                      type="text"
                      name="subject"
                      className="focus:outline-none p-2 bg-[#fff0] bg-none border"
                      onChange={handleSubjectChange}
                      value={subject}
                    />
                  </div>
                  <div className="p-2 flex flex-col rounded-lg">
                    <div className="flex items-center justify-between">
                      <label className="py-1">Name</label>
                      <span className="text-[12px]">{name.length}/10</span>
                    </div>
                    <input
                      name="name"
                      value={name}
                      className="focus:outline-none p-2 bg-[#fff0] border"
                      onChange={handleNameChange}
                    />
                  </div>
                  <div className="p-2 my-2 flex flex-col rounded-lg">
                    <div className="flex items-center justify-between">
                      <label className="py-1">Message</label>
                      <span className="text-[12px]">{message.length}/50</span>
                    </div>
                    <textarea
                      rows={2}
                      className="focus:outline-none p-2 bg-[#fff0] text-[14px] border"
                      name="message"
                      onChange={handleMessageChange}
                      value={message}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className={`${styles.notch_button} my-12 h-2 md:col-span-2 mx-auto md:h-4 w-[80%] md:w-[400px] mt-10 relative flex justify-center items-center`}
                >
                  <div
                    className={`z-40 text-black md:text-lg lg:text-2xl font-mono absolute ${
                      isButtonDisabled
                        ? "cursor-not-allowed"
                        : "hover:animate-bounce"
                    }`}
                  >
                    Save
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Toggle;
