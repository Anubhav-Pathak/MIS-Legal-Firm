import React, { useContext, useState } from "react";
import Image from "next/image";
import Input from "./UI/Input";
import Button from "./UI/Button";
import DataContext from "@/contexts/DataContext";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const dataContext = useContext(DataContext);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dataContext.searchHandler(searchValue.trim());
    setSearchValue("");
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <form onSubmit={submitHandler} className="flex">
      <Input
        style="md:w-96"
        input={{
          value: searchValue,
          onChange: changeHandler,
          type: "text",
          placeholder: "Search...",
          className:
            "rounded-l-full focus:outline-none input w-full bg-white text-black",
        }}
      />
      <Button
        type="submit"
        styles="btn btn-primary rounded-r-full"
        disabled={searchValue.trim() === ""}
      >
        <Image src="/search.svg" width="30" height="30" alt="Search" />
      </Button>
    </form>
  );
};

export default Search;
