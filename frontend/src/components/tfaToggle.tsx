import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
const TfaToggle = ({ isEnabled }: { isEnabled: boolean }) => {
  const [isTfaEnabled, setIsTfaEnabled] = useState(isEnabled);
  useEffect(() => {
    const fetchTfaStatus = async () => {
      try {
        const response: AxiosResponse = await API.get("user/tfaStatus");
        setIsTfaEnabled(response.data);
      } catch (error) {}
    };
    fetchTfaStatus();
  }, []);
  const handleToggleTfa = async () => {
    try {
      if (isTfaEnabled) {
        await API.post("user/disableTFA");
      } else {
        await API.post("user/enableTFA");
      }
      setIsTfaEnabled(!isTfaEnabled);
    } catch (error) {}
  };
  return (
    <div className="toggle flex flex-row items-center justify-center gap-20">
      <span className="text-center">enable/disable 2FA:</span>
      <label
        className={`relative inline-flex items-center cursor-pointer ${
          isTfaEnabled ? "text-blue-600" : "text-gray-900 dark:text-gray-300"
        }`}
        onClick={handleToggleTfa}
      >
        <input
          type="checkbox"
          defaultChecked={isTfaEnabled}
          value=""
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}
        ></div>
      </label>
    </div>
  );
};
export default TfaToggle;
