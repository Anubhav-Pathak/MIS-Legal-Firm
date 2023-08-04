import React, { useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";

import {dataActions, fetchData} from "@/redux/slices/dataSlice";
import Input from "./UI/Input";
import Button from "./UI/Button";


const Pagination = () => {
  const dispatch = useAppDispatch();
  const {data, pages, limit, currentTab, search} = useAppSelector((state) => state.dataReducer);

  const remainingData = data.remainingData;
  const totalData = data.results.length + remainingData;
  const maxPage = Math.ceil(totalData / limit);
  const maxLimit = Math.min(totalData, 100);

  const limitChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(dataActions.changeLimit(+e.target.value));
  };

  const pageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(dataActions.changePage(+e.target.value));
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchData(pages, limit, currentTab, search));
  };

  const previousPageHandler = () => {
    dispatch(dataActions.changePage(pages - 1));
    dispatch(fetchData(pages - 1, limit, currentTab, search));
  };

  const nextPageHandler = () => {
    dispatch(dataActions.changePage(pages + 1));
    dispatch(fetchData(pages + 1, limit, currentTab, search));
  };

  return (
    <section className="flex flex-wrap-reverse gap-4 justify-between place-items-end">
      <div>
        <Button clickHandler={previousPageHandler} styles="btn-primary rounded-none w-24" disabled={pages === 1} > Previous </Button>
        <Button clickHandler={nextPageHandler} styles="btn-primary rounded-none w-24" disabled={remainingData <= 0}> Next </Button>
      </div>
      <form onSubmit={submitHandler} className="flex items-start mb-8 gap-4 justify-center flex-col sm:flex-row" >
        <Input
          label="Go To Page - "
          input={{
            type: "number",
            min: 1,
            max: maxPage,
            value: pages,
            onChange: pageChangeHandler,
            className: "input input-primary w-20",
          }}
        />
        <Input
          label="Limit - "
          input={{
            type: "number",
            min: 1,
            max: maxLimit,
            value: limit,
            onChange: limitChangeHandler,
            className: "input input-primary w-20",
          }}
        />
        <Button type="submit" styles="btn-primary btn-bordered">Go</Button>
      </form>
    </section>
  );
};

export default Pagination;
