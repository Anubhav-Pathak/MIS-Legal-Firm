import React, { useContext } from "react";
import Select from "./UI/Select";
import Button from "./UI/Button";
import DataContext from "@/contexts/DataContext";

const Filter = () => {
  const dataContext = useContext(DataContext);

  return (
    <section className="bg-neutral rounded shadow p-4 my-4 md:my-8">
      <h2 className="text-xl font-bold">Filter by -</h2>
      <div className="w-full flex flex-row items-center justify-evenly gap-4 my-4">
        <Select
          options={["10/05/23", "11/05/23", "12/05/23"]}
          label={"Date"}
          showButton={true}
          buttonLabel={"Reset"}
          onButtonClick={() =>
            dataContext.filterHandler({
              column: "Date",
              value: "",
              reset: true,
            })
          }
          resetSelect={true}
        />
        <Select
          options={["Type"]}
          label={"Type"}
          showButton={true}
          buttonLabel={"Reset"}
          onButtonClick={() =>
            dataContext.filterHandler({
              column: "Type",
              value: "",
              reset: true,
            })
          }
          resetSelect={true}
        />
        <Select
          options={["Pending", "Active", "Completed"]}
          label={"Status"}
          showButton={true}
          buttonLabel={"Reset"}
          onButtonClick={() =>
            dataContext.filterHandler({
              column: "Status",
              value: "",
              reset: true,
            })
          }
          resetSelect={true}
        />
        <Button
          type="button"
          clickHandler={() =>
            dataContext.filterHandler({
              column: "",
              value: "",
              reset: true,
            })
          }
          styles="btn btn-primary btn-outline"
        >
          reset all filters
        </Button>
      </div>
    </section>
  );
};

export default Filter;
