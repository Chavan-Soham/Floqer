// src/useSalariesData.ts
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

const csvFilePath = '/salaries.csv'; // Adjust path if needed

export interface SalaryData {
  work_year: string;
  experience_level: string;
  employment_level: string;
  job_title: string;
  salary: string;
  salary_currency: string;
  salary_in_usd: string; // Assuming USD conversion exists
  employee_residence: string;
  remote_ratio: string;
  company_location: string;
  company_size: string;
}

const useSalariesData = (): SalaryData[] => {
  const [data, setData] = useState<SalaryData[]>([]);

  useEffect(() => {
    fetch(csvFilePath)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<SalaryData>(csvText, {
          header: true,
          complete: (results) => {
            const validData = results.data.filter(row => row.work_year && row.salary_in_usd);
            setData(validData as SalaryData[]);
          },
        });
      });
  }, []);

  return data;
};

export default useSalariesData;
