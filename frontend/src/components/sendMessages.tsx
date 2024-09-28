import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageInfo } from "./Conversation";
import {
  sendMessages,
  useGetMemberShip,
} from "@/app/api/chatApi/chatApiFunctions";
import { io } from "socket.io-client";

interface sendMessagesProps {
  id: string;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  dataUser: any;
}

export const SendMessages: React.FC<sendMessagesProps> = ({
  id,
  message,
  setMessage,
  dataUser,
}) => {
  const { chatSocket } = useAuth();
  const [time, setTime] = useState(0);
  const mutation = useMutation({
    mutationFn: sendMessages,
    onSuccess: () => {
      setMessage("");
      chatSocket?.emit("sendMessage", { group_id: id });
    },
  });
  const handleSubmitNewMessage = () => {
    mutation.mutate({ groupId: Number(id), message: message });
  };
  const { data, isSuccess } = useGetMemberShip(id);
  useEffect(() => {
    const timeLoop = setInterval(() => {
      if (isSuccess)
        setTime(
          (new Date(data?.muted).getTime() - new Date().getTime()) / 1000
        );
    }, 1000);
    return () => {
      clearInterval(timeLoop);
    };
  }, [isSuccess, data]);
  return (
    <div className="w-full flex bottom-0 absolute ">
      <input
        value={message}
        onFocus={() => {}}
        onBlur={() => {
          chatSocket?.emit("stop typing", { group_id: id });
        }}
        onChange={(input) => {
          if (input.target.value.length)
            chatSocket?.emit("typing", {
              group_id: id,
              user: dataUser.nickname,
            });
          else chatSocket?.emit("stop typing", { group_id: id });
          setMessage(input.target.value);
        }}
        id="msg"
        placeholder="Type your message here..."
        className="border bg-gray-600 text-white rounded-3xl w-[85%] pl-4 shadow-black"
        type="text"
        required
        autoComplete="off"
        onKeyPress={(e) => {
          if (e.key === "Enter" && message.trim() !== "") {
            handleSubmitNewMessage();
          }
        }}
      />
      <label htmlFor="msg"></label>
      <button
        id="send"
        className={`pl-2.5 bg-[#45B9D1] text-white rounded-3xl shadow-black pr-2 py-1.5 ml-3 ${
          (!message || time > 0) && "cursor-not-allowed"
        }`}
        onClick={(e) => {
          if (message.trim() !== "") {
            handleSubmitNewMessage();
          }
        }}
      >
        {time > 0
          ? Math.floor(time / 60) + ":" + (Math.floor(time) % 60)
          : "Send"}
      </button>
    </div>
  );
};
