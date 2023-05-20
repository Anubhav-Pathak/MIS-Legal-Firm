import React from "react";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Select from "../../components/UI/Select";
import FileUploadModal from "../../components/UI/FileUploadModal";
import Table from "../../components/UI/Table";

const Dashboard = () => {
  //dummy data, ignore ts errors
  //@ts-ignore
  const columns = [...Array(15).keys()].map((e) => `Column ${e + 1}`);
  //@ts-ignore
  const data = [...Array(15).keys()].map((e) => [...Array(15).keys()].map((e) => `Row ${e + 1}`));

  return (
    <main className="flex flex-col min-h-screen bg-gray-200">
      <Navbar />
      <div className="p-8 flex flex-col gap-y-8">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col justify-center items-center">
            <div className="text-2xl text-black">Meta Data about the File:</div>
            <ul className="text-xl text-black list-decimal">
              {[
                "File Name",
                "File Type",
                "File Size",
                "File Uploaded By",
                "File Uploaded On",
              ].map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
          <a
            href="#upload-modal"
            className="btn btn-primary text-white flex flex-col text-[24px] p-10 items-center justify-center gap-3"
          >
            Upload Datasheet +
          </a>
        </div>
        <div className="flex flex-col">
          <div className="text-2xl text-black font-bold mb-2">Search Case:</div>
          <div className="flex flex-row">
            <input
              type="text"
              className="input input-bordered rounded-3xl rounded-r-none w-full max-w-lg focus:outline-none text-black text-[24px]"
              placeholder="Case Number"
            />
            <button className="btn btn-primary rounded-3xl rounded-l-none">
              <Image
                src="/search.svg"
                width={50}
                height={50}
                alt="search"
                className="h-10 w-10"
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col bg-white p-5 shadow-sm gap-4">
          <div className="text-2xl text-black font-bold">Filter By-</div>
          <div className="flex flex-row justify-between">
            <Select options={[{ value: "Date" }]} title="Date -" />
            <Select options={[{ value: "Type" }]} title="Type - " />
            <Select options={[{ value: "foo" }]} />
            <Select options={[{ value: "bar" }]} />
          </div>
        </div>

        <Table columns={columns} data={data} />

        <div>
          <div className="flex flex-row items-center justify-center gap-2">
            <Image
              src="/left-arrow.svg"
              width={50}
              height={50}
              alt="previous"
              className="h-10 w-10 cursor-pointer"
            />
            <div className="text-red-800 text-[24px]">Page</div>
            <div className="text-red-800 text-[24px]">1</div>
            <div className="text-red-800 text-[24px]">of</div>
            <div className="text-red-800 text-[24px]">2</div>
            <Image
              src="/right-arrow.svg"
              width={50}
              height={50}
              alt="next"
              className="h-10 w-10 cursor-pointer"
            />
          </div>
        </div>
      </div>
      <FileUploadModal />
    </main>
  );
};

export default Dashboard;
