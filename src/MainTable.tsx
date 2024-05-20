// src/MainTable.tsx
import React, { useState, useMemo } from 'react';
import { Table } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import useSalariesData from './salaries';
import './row.css';

interface ProcessedTableData {
  Year: string;
  NumberOfJobs: number;
  AverageSalaryUSD: number;
}

export default function MainTable(){
  const data = useSalariesData();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const processedData = useMemo(() => {
    const yearMap = new Map<string, { count: number; totalSalary: number }>();
    data.forEach((row) => {
      const year = row.work_year;
      if (!yearMap.has(year)) {
        yearMap.set(year, { count: 0, totalSalary: 0 });
      }
      const yearData = yearMap.get(year)!;
      yearData.count++;
      yearData.totalSalary += parseFloat(row.salary_in_usd || '0'); // Handle missing values
    });

    return Array.from(yearMap.entries()).map(([year, { count, totalSalary }]) => ({
      Year: year,
      NumberOfJobs: count,
      AverageSalaryUSD: totalSalary / count,
    }));
  }, [data]);

  const columns = [
    {
      title: 'Year',
      dataIndex: 'Year',
      sorter: (a: ProcessedTableData, b: ProcessedTableData) => a.Year.localeCompare(b.Year),
    },
    {
      title: 'Number of Jobs',
      dataIndex: 'NumberOfJobs',
      sorter: (a: ProcessedTableData, b: ProcessedTableData) => a.NumberOfJobs - b.NumberOfJobs,
    },
    {
      title: 'Average Salary (USD)',
      dataIndex: 'AverageSalaryUSD',
      sorter: (a: ProcessedTableData, b: ProcessedTableData) => a.AverageSalaryUSD - b.AverageSalaryUSD,
    },
  ];

  const handleRowClick = (record: ProcessedTableData) => {
    setSelectedYear(record.Year);
  };

  const detailedData = useMemo(() => {
    if (!selectedYear) return [];
    const jobMap = new Map<string, number>();
    data.forEach((row) => {
      if (row.work_year === selectedYear) {
        const jobTitle = row.job_title;
        if (!jobMap.has(jobTitle)) {
          jobMap.set(jobTitle, 0);
        }
        jobMap.set(jobTitle, jobMap.get(jobTitle)! + 1);
      }
    });
    return Array.from(jobMap.entries()).map(([jobTitle, count]) => ({
      JobTitle: jobTitle,
      Count: count,
    }));
  }, [selectedYear, data]);

  const detailedColumns = [
    {
      title: 'Job Title',
      dataIndex: 'JobTitle',
    },
    {
      title: 'Count',
      dataIndex: 'Count',
    },
  ];

  return (
    <div>
      <h2>Machine Learning Engineer Salaries</h2>
      <Table
        dataSource={processedData}
        columns={columns}
        rowKey="Year"
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowClassName={()=> 'row-cursor'}
      />

      <h2>Jobs Over Time</h2>
      <LineChart
        width={600}
        height={300}
        data={processedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="NumberOfJobs" stroke="#8884d8" />
        <Line type="monotone" dataKey="AverageSalaryUSD" stroke="#82ca9d" />
      </LineChart>

      {selectedYear && (
        <div>
          <h2>Job Titles in {selectedYear}</h2>
          <Table
            dataSource={detailedData}
            columns={detailedColumns}
            rowKey="JobTitle"
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};
