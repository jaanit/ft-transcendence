import Router from "next/navigation";
import React, { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  UsegetGroups,
  creatGroup,
  upload,
  updateGroup,
} from "@/app/api/chatApi/chatApiFunctions";
import { set } from "react-hook-form";
import Toggle from "./toggle";
import { stringify } from "querystring";
import { group } from "console";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { m } from "framer-motion";
import { TbPhotoEdit } from "react-icons/tb";
import { API } from "@/app/api/checkAuthentication";
interface CreatGroupProps {
  group: any; // Assuming newGroup is a string, you can adjust the type as needed
  setNewGroup: React.Dispatch<React.SetStateAction<boolean>>; // Assuming setNewGroup is a React state setter for a string
}
export const UpdateChannel: React.FC<CreatGroupProps> = ({
  group,
  setNewGroup,
}) => {
  const [typegroup, setTypeGroup] = useState(group.privacy);
  const [GroupName, setGroupName] = useState(group.name);
  const [GroupPassword, setGroupPassword] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [message, setmessage] = useState("");
  const [isError, setIsErro] = useState(false);
  const [avatar, setAvatar] = useState(group.picture);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateGroup,
    onSuccess: () => {
      setIsCreated(true);
      queryClient.invalidateQueries(["getMessages"]);
      queryClient.invalidateQueries(["dataGroups"]);
    },
    onError: () => setIsErro(true),
  });

  const handleGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };
  const handleGroupPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupPassword(e.target.value);
  };
  const handleGroupType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeGroup(e.target.value);
  };
  const handelCreatGroup = () => {
    mutation.mutate({
      group_id: group.id,
      name: GroupName,
      password: GroupPassword,
      privacy: typegroup,
      picture: avatar,
    });
  };

  function isStrongPassword(password: string) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasUppercase && hasLowercase && hasNumber;
  }

  function checkInfoCreatGroup() {
    if (
      GroupName.length < 3 ||
      (typegroup == "protected" &&
        GroupPassword.length < 3 &&
        !isStrongPassword(GroupPassword))
    ) {
      return false;
    }
    return true;
  }

  const uploadMutation = useMutation({
    mutationFn: upload,
  });

  useEffect(() => {
    if (uploadMutation.isSuccess) setAvatar(uploadMutation.data?.path);
  }, [uploadMutation.isSuccess, avatar, uploadMutation.data?.path]);

  const [filePreview, setFilePreview] = useState<string | undefined>(undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePreview(URL.createObjectURL(file));
      uploadPicture(file);
    }
  };

  const uploadPicture = async (picture: File) => {
    const formData = new FormData();
    formData.append("file", picture);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="absolute z-50  opacity-100   top-[10%] w-full bg-blue-950  rounded-2xl">
      <button onClick={() => setNewGroup(false)} className="m-4 ">
        <svg
          fill="#ffffff"
          height="16px"
          width="16px"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 460.775 460.775"
          xmlSpace="preserve"
          stroke="#ffffff">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path>
          </g>
        </svg>
      </button>
      <div className="flex justify-center ">
        <header className="m-2">
          <p className="text-center text-2xl  text-white   font-mono leading-normal">
            Update your Channel
          </p>
        </header>
      </div>

      {!isCreated && (
        <div className="mt-6 ">
          <div className="relative m-4">
            <div className="w-32 h-32 z-10 mx-auto">
              {filePreview ? (
                <div
                  className="h-32 w-32 rounded-full bg-cover"
                  style={{ backgroundImage: `url(${filePreview})` }}></div>
              ) : (
                <div
                  className="h-32 w-32 rounded-full bg-cover"
                  style={{ backgroundImage: `url(${avatar})` }}></div>
              )}
            </div>
            <div className="absolute left-[56%] top-[85px]  bg-[#ffff]   text-[#000000] rounded-full p-1">
              <label htmlFor="image-upload" className="">
                <TbPhotoEdit
                  className="  cursor-pointer"
                  size={25}></TbPhotoEdit>
              </label>
              <input
                className="hidden"
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={GroupName}
              onChange={handleGroupName}
              name="text"
              maxLength={parseInt("13")}
              className="font-mono w-[78%]   px-3 py-3 mt-1 border bg-blue-950 border-gray-300 rounded focus:outline-none text-white text-sm"
              pattern="\d+"
              placeholder="Group Name"></input>
          </div>
          <div className="flex justify-center">
            <select
              onChange={handleGroupType}
              name="text"
              className="font-mono w-[78%]  px-3  py-3 mt-1 border bg-blue-950 border-gray-300 rounded focus:outline-none text-white"
              defaultValue={group.privacy}
              placeholder="Group Name">
              <option value="public"> public </option>
              <option value="private"> private </option>
              <option value="protected"> protected </option>
            </select>
          </div>
          {typegroup == "protected" && (
            <div className="flex justify-center">
              <input
                type="password"
                onChange={(input) => setGroupPassword(input.target.value)}
                name="text"
                className="font-mono w-[78%]  px-3  py-3 mt-6 border bg-blue-950 border-gray-300 rounded focus:outline-none text-white"
                pattern="\d+"
                placeholder="Password"></input>
            </div>
          )}
          <div className=" w-[100%] flex justify-center mt-8  mb-8">
            {checkInfoCreatGroup() && (
              <button
                onClick={handelCreatGroup}
                className="flex justify-center items-center p-2 gap-2 h-8 w-32 bg-white  rounded-full hover:bg-white focus:outline-none cursor-pointer">
                <span className=" text-xl leading-6 text-black font-mono">
                  Update
                </span>
              </button>
            )}
            {!checkInfoCreatGroup() && (
              <button className="flex justify-center items-center p-2 gap-2 h-8 w-32 bg-gray-400  rounded-full cursor-not-allowed">
                <span className=" text-xl leading-6 text-black font-mono ">
                  Update
                </span>
              </button>
            )}
          </div>
        </div>
      )}
      {isCreated && (
        <div className="flex justify-center items-center  mt-14 mb-8">
          <h1 className="text-2xl text-white  font-mono">
            Group Updated successfully
          </h1>
        </div>
      )}
    </div>
  );
};
