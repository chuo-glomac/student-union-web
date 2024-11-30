"use client";

import { generateRandomId } from "@/utils/generateRandomId";
import { createClient } from "@supabase/supabase-js";
import Papa from "papaparse";

import { useEffect, useState } from "react";
import { updateMember, updateStudent, userMap, writeMappingToFile } from "./action";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
const adminAuthClient = supabase.auth.admin;

export default function MigrateUser() {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results: any) => {
        const users = results.data;
        const mapping = [];

        for (const user of users) {
          console.log("user data:", user);
          const {
            email,
            encrypted_password: password_hash,
            id: oldUserId,
          } = user;

          try {
            const { data, error } = await adminAuthClient.createUser({
              email,
              password_hash,
              email_confirm: true,
              user_metadata: { temporary_id: generateRandomId() },
            });

            if (error) {
              console.error("Error data:", data);
              console.error("Error migrating user:", error);
              continue;
            }

            mapping.push({
              old_user_id: oldUserId,
              new_user_id: data.user?.id,
            });
          } catch (err) {
            console.error("Unexpected error:", err);
          }
        }

        const csv = Papa.unparse(mapping);
        downloadCSV(csv, "user_id_mapping.csv");
      },
    });
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleCsvToJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    // Use FileReader to read the file
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target?.result;

      if (typeof csvData === "string") {
        const parsedData = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
        });

        if (parsedData.errors.length) {
          console.error("Error parsing CSV:", parsedData.errors);
          return;
        }

        const jsonData = parsedData.data;
        console.log("Converted JSON:", jsonData);

        downloadJson(jsonData, "user_ids.json");
      }
    };

    reader.onerror = () => {
      console.error("Error reading file");
    };

    reader.readAsText(file);
  };

  const downloadJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleUserMap = async () => {
    const mapping: any[] = [];

    try {
      const data = await userMap();
      mapping.push(data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }

    console.log("Complete file.");
    await writeMappingToFile("member_student_mapping.json", mapping);
  }

  const handleMigrateUserAccess = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {};

  const handleMigrateMember = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const mapping: any[] = [];
    const file = e.target.files?.[0];
    if (!file) return;
  
    // Wrap Papa.parse in a Promise to wait for it to complete
    const parseCsv = (file: File): Promise<any[]> => {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            resolve(results.data);
          },
          error: (error) => {
            reject(error);
          },
        });
      });
    };
  
    try {
      // Parse the CSV and process the users
      const users = await parseCsv(file);
      for (const user of users) {
        console.log("user data:", user);
  
        try {
          const data = await updateMember(user);
          mapping.push(data);
        } catch (err) {
          console.error("Unexpected error:", err);
        }
      }
  
      console.log("Complete file.");
  
      // Write the mapping to the file
      await writeMappingToFile("member_student_mapping.json", mapping);
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  const handleMigrateStudent = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const mapping: any[] = [];
    const file = e.target.files?.[0];
    if (!file) return;
  
    // Wrap Papa.parse in a Promise to wait for it to complete
    const parseCsv = (file: File): Promise<any[]> => {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            resolve(results.data);
          },
          error: (error) => {
            reject(error);
          },
        });
      });
    };
  
    try {
      // Parse the CSV and process the users
      const users = await parseCsv(file);
      for (const user of users) {
        console.log("user data:", user);
  
        try {
          const data = await updateStudent(user);
          mapping.push(data);
        } catch (err) {
          console.error("Unexpected error:", err);
        }
      }
  
      console.log("Complete file.");
  
      // Write the mapping to the file
      await writeMappingToFile("migration_student_result.json", mapping);
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  return (
    <div className="m-4 flex flex-col gap-2">
      <h1>Migrate Users</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <h1>Convert CSV to JSON</h1>
      <input type="file" accept=".csv" onChange={handleCsvToJson} />
      <h1>Create User Map</h1>
      <button onClick={handleUserMap} className="rounded bg-white text-black px-2 py-1 w-max">
        Click
      </button>
      {/* <h1>Migrate UserAccess</h1>
      <input type="file" accept=".csv" onChange={handleMigrateUserAccess} /> */}
      <h1>Migrate Member</h1>
      <input type="file" accept=".csv" onChange={handleMigrateMember} />
      <h1>Migrate Student</h1>
      <input type="file" accept=".csv" onChange={handleMigrateStudent} />
    </div>
  );
}
