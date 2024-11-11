"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import Papa from "papaparse";
import { format } from "date-fns";

import { convertTimestampAdv } from "@/utils/dataConverter";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPenToSquare,
  faTrashCan,
  fas,
} from "@fortawesome/free-solid-svg-icons";
import { action, getCode } from "./action";
import { validateUser } from "@/utils/supabase/auth";

library.add(fas);

interface CsvData {
  [key: string]: any;
}

type HeaderMap = { [key: string]: string };

const expectedHeaders: HeaderMap = {
  createdAt: "Created At | 作成日",
  studentId: "Student ID | 学籍番号",
  chuoEmail: "Chuo Email | 全学メール",
  code: "Confirmation Code | 認証コード",
  valid: "Validation Status | 認証状況",
};

const mapHeaders = (row: CsvData, headerMap: HeaderMap): CsvData => {
  const mappedRow: CsvData = {};
  for (const key in headerMap) {
    if (row[headerMap[key]] !== undefined) {
      mappedRow[key] = row[headerMap[key]];
    } else {
      mappedRow[key] = "";
    }
  }
  return mappedRow;
};

const checkValid = (data: CsvData) => {
  // console.log(data);
  let message = [];
  if (!data.studentId || data.studentId == "") message.push("Student ID");
  if (!data.chuoEmail || data.chuoEmail == "") message.push("Chuo Email");

  if (message.length == 0) return { success: true, message };
  return { success: false, message };
};

export type Validation = {
  createdAt: Date;
  studentId: string;
  chuoEmail: string;
  code: string;
  valid: 'TRUE' | 'FALSE';
  type?: number;
};

const addPrefixToHeaders = (data: CsvData[]) => {
  return data.map((row) => {
    const newRow: CsvData = {};
    for (const header in row) {
      newRow[`csv-${header}`] = row[header];
    }
    return newRow;
  });
};

function BatchReservations() {
  const router = useRouter();

  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [popup, setPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [selectedData, setSelectedData] = useState<CsvData>({
    createdAt: "",
    studentId: "",
    chuoEmail: "",
    code: "",
    valid: "FALSE",
  });
  const [headerMapDialog, setHeaderMapDialog] = useState<boolean>(false);
  const [headerMap, setHeaderMap] = useState<HeaderMap>({});
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      Papa.parse<CsvData>(file, {
        header: true,
        complete: (result: any) => {
          const headers = result.meta.fields.map(
            (header: string) => `csv-${header}`
          );
          setCsvHeaders(headers);
          setHeaderMapDialog(true);
          // console.log(csvData);
          // const headers = result.meta.fields;
          // setCsvHeaders(headers);
          // setHeaderMapDialog(true);
        },
        error: (error: any) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };

  const handleHeaderMapChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    expectedHeader: string
  ) => {
    setHeaderMap((prevState) => ({
      ...prevState,
      [expectedHeader]: event.target.value,
    }));
  };

  const handleHeaderMapConfirm = () => {
    if (uploadedFile) {
      const fileExtension = uploadedFile.name.split(".").pop()?.toLowerCase();

      if (fileExtension === "csv") {
        Papa.parse<CsvData>(uploadedFile, {
          header: true,
          complete: (result: any) => {
            const dataWithPrefixedHeaders = addPrefixToHeaders(result.data);
            processParsedData(dataWithPrefixedHeaders);
          },
          error: (error: any) => {
            console.error("Error parsing CSV:", error);
          },
        });
      } else {
        console.error("Unsupported file type");
      }
    }
  };

  const processParsedData = async (data: CsvData[]) => {
    const tokyoOffset = 9 * 60;
    const current = new Date();
    current.setMinutes(current.getMinutes() + tokyoOffset);
    const finalDateTime = current.toISOString().slice(0, -1).substring(0, 16);

    const parsedData: CsvData[] = [];

    for (const row of data) {
      const code = await getCode();

      const mappedRow = mapHeaders(row, headerMap);
      let createdAt = finalDateTime;
      try {
        if (mappedRow.createdAt) {
          createdAt = convertTimestampAdv(mappedRow.createdAt);
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const dataObject = {
          ...mappedRow,
          createdAt,
          valid: mappedRow.valid == "TRUE" ? "TRUE" : "FALSE",
          code: mappedRow.code || code,
          selected: false,
        };
        parsedData.push(dataObject);
      } catch (err) {
        console.error(`Skip Row: ${err}`);
        setError((prevError) => prevError + `[Skip Row]`);
      }
    }

    setCsvData((prevData) => [...prevData, ...parsedData]);
    // setCsvData(parsedData as CsvData[]);
    setHeaderMapDialog(false);
  };

  const handleCheckboxChange = (rowIndex: number, isChecked: boolean) => {
    const updatedData = csvData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, selected: isChecked };
      }
      return row;
    });
    setCsvData(updatedData);
  };

  const handleCheckboxChangeAll = () => {
    const newSelectAll = !selectAll;
    const updatedData = csvData.map((row) => {
      return { ...row, selected: newSelectAll };
    });
    setSelectAll(newSelectAll);
    setCsvData(updatedData);
  };

  const editData = (index: number) => {
    setSelectedData({ ...csvData[index], index });
    setPopup(true);
  };

  const removeData = (index: number) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const removeDataMulti = () => {
    const newData = csvData.filter((row) => row.selected == false);
    setCsvData(newData);
  };

  const addData = async () => {
    const tokyoOffset = 9 * 60;
    const current = new Date();
    current.setMinutes(current.getMinutes() + tokyoOffset);
    const finalDateTime = current.toISOString().slice(0, -1).substring(0, 16);

    const code = await getCode();

    setSelectedData({
      index: csvData.length,
      createdAt: finalDateTime,
      studentId: "",
      chuoEmail: "",
      code: code,
      valid: "FALSE",
      selected: false,
    });
    setPopup(true);
  };

  const updateData = () => {
    if (selectedData) {
      const result = checkValid(selectedData);
      if (result.success) {
        const editItem = selectedData;
        const rowIndex = editItem.index as number;
        delete editItem.index;

        let updatedData = csvData;
        updatedData[rowIndex] = editItem;
        setCsvData(updatedData);

        // console.log(editItem);
        setError("");
        setPopup(false);
      } else {
        setPopupMessage(result.message.join(", "));
        setError("Some Fields are Empty");
      }
      // console.log(csvData);
    }
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSelectedData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const code = await getCode();
      const uploadData = csvData.map((row) => {
        return {
          index: csvData.length,
          createdAt: row.createdAt,
          studentId: row.studentId || "00F1101001A",
          chuoEmail: row.chuoEmail || "a00.xxxx@g.chuo-u.ac.jp",
          code: row.code || code,
          valid: row.valid,
          selected: false,
        };
      });
      if (csvData.some((item) => item.error == true)) {
        setError("Some Fields are Empty");
        setIsUploading(false);
        return;
      }
      setError("");
      // console.log(uploadData);

      const response = await action(uploadData);

      if (!response.ok) {
        if (response.existingData) {
          setCsvData(response.existingData);
        }
        alert(response.message);
        throw new Error(`Failed to upload data: ${response.message}`);
      }

      window.alert("Data upload successful! Reloading the page...");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading data:", error);
    }
    setIsUploading(false);
  };

  return (
    <>
      <div>
        <div className="mb-4">
          <label
            className="block mb-2 text-normal font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file (CSV): 最大２００件
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
          <p
            id="file_input_help"
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          >
            Required Fields: Title, Type, Room, Start Date&Time, End Date&Time
            (Optional: User, Description)
          </p>
        </div>
        {headerMapDialog && (
          <div className="z-50 px-15 py-auto">
            <div
              id="header-map-modal"
              className="fixed inset-0 z-50 flex justify-center items-center py-5"
            >
              <div className="relative p-4 w-full max-w-2xl h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-full overflow-hidden flex flex-col">
                  <div className="relative p-5 overflow-y-scroll">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      Map CSV Headers
                    </h3>
                    <div className="grid gap-6">
                      {Object.keys(expectedHeaders).map((expectedHeader) => (
                        <div key={expectedHeader}>
                          <label
                            htmlFor={expectedHeader}
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            {expectedHeaders[expectedHeader]}
                          </label>
                          <select
                            id={expectedHeader}
                            value={headerMap[expectedHeader] || ""}
                            onChange={(e) =>
                              handleHeaderMapChange(e, expectedHeader)
                            }
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="">Select Header</option>
                            {csvHeaders.map((header) => (
                              <option key={header} value={header}>
                                {header}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button
                      type="button"
                      className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      onClick={() => setHeaderMapDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={handleHeaderMapConfirm}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed inset-0 z-40 width-vw height-vh bg-black/50"></div>
          </div>
        )}
        {/* {csvData.length > 0 && ( */}
        <>
          <div className="border-b border-gray-300 my-6"></div>
          <div>
            <div className="flex col-row justify-between">
              <h3 className="mb-2">CSV Data:</h3>
              <div className="flex gap-2">
                <a
                  className={`${
                    !csvData.some((item) => item.selected) && "hidden"
                  } text-red-600 hover:text-red-500 underline`}
                  onClick={removeDataMulti}
                >
                  Remove Selected
                </a>
                <a
                  className={`text-blue-600 hover:text-blue-500 underline`}
                  onClick={addData}
                >
                  Add
                </a>
              </div>
            </div>
            <div className="mb-4 bg-white shadow rounded-lg overflow-y-scroll">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all-search"
                          type="checkbox"
                          checked={selectAll}
                          onChange={() => handleCheckboxChangeAll()}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checkbox-all-search"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </th>
                    <th className="px-3 py-1 whitespace-nowrap">Created At</th>
                    <th className="px-3 py-1 whitespace-nowrap">Student ID</th>
                    <th className="px-3 py-1 whitespace-nowrap">Chuo Email</th>
                    <th className="px-3 py-1 whitespace-nowrap">Code</th>
                    <th className="px-3 py-1 whitespace-nowrap">Valid</th>
                    <th className="px-3 py-1 whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 p-2">
                  {(csvData.length > 0 || selectedData) &&
                    csvData.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="border-gray-200 hover:bg-gray-100"
                      >
                        <td className="w-4 p-4">
                          <div className="flex items-center">
                            <input
                              id={`checkbox-table-search-${rowIndex}`}
                              type="checkbox"
                              checked={row.selected as boolean}
                              onChange={(e) =>
                                handleCheckboxChange(rowIndex, e.target.checked)
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor={`checkbox-table-search-${rowIndex}`}
                              className="sr-only"
                            >
                              checkbox
                            </label>
                          </div>
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {format(row.createdAt, "yyyy/MM/dd (EEE) HH:mm")}
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {row.studentId}
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {row.chuoEmail}
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {row.code}
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {row.valid}
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap text-lg">
                          <a
                            className="font-medium text-gray-400 hover:text-blue-500"
                            onClick={() => editData(rowIndex)}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </a>
                          <a
                            className="font-medium text-gray-400 hover:text-red-500 ms-4"
                            onClick={() => removeData(rowIndex)}
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="text-red-500 mb-2">{error}</div>
            {isUploading ? (
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </button>
            ) : (
              <button
                type="button"
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={handleUpload}
              >
                Upload Data
                <span className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                  {csvData.length}
                </span>
              </button>
            )}
          </div>
        </>
        {/* )} */}
      </div>
      {popup && selectedData && (
        <div className="z-50 px-15 py-auto">
          <div
            id="default-modal"
            className="fixed inset-0 z-50 flex justify-center items-center py-5"
          >
            <form className="relative p-4 w-full max-w-2xl h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-full overflow-hidden flex flex-col">
                <div className="relative p-5 overflow-y-scroll">
                  <div className="mb-6">
                    <div>
                      <label
                        htmlFor="createdAt"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Created At
                      </label>
                      <input
                        type="datetime-local"
                        id="createdAt"
                        value={selectedData.createdAt}
                        onChange={handleValueChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="studentId"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Student ID
                      </label>
                      <input
                        type="text"
                        pattern="[0-9]{2}F11[0-9]{5}[A-L]"
                        id="studentId"
                        value={(selectedData.studentId as string) || ""}
                        onChange={handleValueChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="00F1101001A"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="chuoEmail"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Chuo Email
                      </label>
                      <input
                        type="text"
                        pattern="[a-z][0-9]{2}\.[a-z0-9]{4}@g.chuo-u.ac.jp"
                        id="chuoEmail"
                        value={(selectedData.chuoEmail as string) || ""}
                        onChange={handleValueChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="a00.xxxx@g.chuo-u.ac.jp"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="code"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Code
                      </label>
                      <input
                        type="text"
                        pattern="[0-9]{6}"
                        id="code"
                        value={selectedData.code as string | ""}
                        onChange={handleValueChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Title of Schedule"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="valid"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Valid
                      </label>
                      <select
                        id="valid"
                        value={selectedData.valid as string | ""}
                        onChange={handleValueChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      >
                        <option value="TRUE">TRUE</option>
                        <option value="FALSE">FALSE</option>
                      </select>
                    </div>
                  </div>
                  {popupMessage != "" && (
                    <a className="text-red-500">{`Empty Field(s): ${popupMessage}`}</a>
                  )}
                </div>
                <div className="flex items-center justify-between p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    type="button"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={() => {
                      setPopup(false);
                      setPopupMessage("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => updateData()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="fixed inset-0 z-40 width-vw height-vh bg-black/50"></div>
        </div>
      )}
    </>
  );
}

export default function ManualValidationPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initialLoad = async () => {
    setIsLoading(true);
    await validateUser();
    setIsLoading(false);
  };

  useEffect(() => {
    initialLoad();
  }, []);

  return (
    <div id="app" className="h-screen bg-white text-black">
      <div className="container mx-auto py-10 flex flex-col">
        {!isLoading && (
          <>
            <p
              className="text-2xl font-medium cursor-pointer mb-4"
              onClick={() => router.push("/")}
            >
              GLOMAC Student Union
            </p>
            <BatchReservations />
          </>
        )}
      </div>
    </div>
  );
}
