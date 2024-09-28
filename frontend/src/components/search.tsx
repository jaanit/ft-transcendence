import React from "react";
export const Search = () => {
  return (
    <div className="flex py-2 items-center justify-center ">
      <input
        placeholder="Search"
        className="  bg-black bg-opacity-40 p-3 w-[45%] text-white pl-5 rounded-3xl shadow-black"
        type="text"
        required
        autoComplete="off"
        id="name"
      />
      {/* <label htmlFor="name"> </label> */}
      {/* <button className="pl-3.5 w-12 h-[36%] bg-black bg-opacity-40 hover:bg-slate-400 text-white rounded-3xl   shadow-black  pr-4 py-2 ml-2">
        <svg
          className="text-white  search__icon h-7 w-5 fill-current text-b4b4b4"
          aria-hidden="true"
          viewBox="0 0 24 24">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
          </g>
        </svg>
      </button> */}
    </div>
  );
};
