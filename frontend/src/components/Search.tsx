"use client";
import React from "react";

import { useAppDispatch } from "@/redux/hooks";

import Image from "next/image";
import Input from "./UI/Input";
import Button from "./UI/Button";
import { dataActions } from "@/redux/slices/dataSlice";

const Search = () => {
  const dispatch = useAppDispatch();
  const searchRef = React.useRef<HTMLInputElement>(null);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(dataActions.search(searchRef.current?.value.trim() as string));
  };

  return (
    <form onSubmit={submitHandler} className="flex border-primary border-2 rounded">
      <Input
        ref={searchRef}
        input={{
          type: "text",
          placeholder: "Search...",
          className: "input focus:outline-none"
        }}
      />
      <Button
        type="submit"
        styles="btn-primary rounded-none"
      >
        <Image src="/search.svg" width="30" height="30" alt="Search" />
      </Button>
    </form>
  );
};

export default Search;
