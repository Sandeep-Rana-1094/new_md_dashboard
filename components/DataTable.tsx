
import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface DataTableProps {
  data: Order[];
}

const ROWS_PER_PAGE = 10;

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

  // Reset to page 1 if data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);


  const paginatedData = data.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <div className="bg-surface/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border-default">
      <h3 className="text-lg font-semibold text-text-primary mb-4">All Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-text-secondary">
          <thead className="text-xs text-text-secondary uppercase bg-white/5 font-medium">
            <tr>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Order FY</th>
              <th scope="col" className="px-6 py-3">Order No.</th>
              <th scope="col" className="px-6 py-3">Party Name</th>
              <th scope="col" className="px-6 py-3">Segment</th>
              <th scope="col" className="px-6 py-3 text-right">Order Value (USD)</th>
              <th scope="col" className="px-6 py-3 text-right">Reserve (USD)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={`${item.orderNo}-${index}-${item.date}`} className="border-b border-border-default hover:bg-white/5">
                <td className="px-6 py-4 whitespace-nowrap">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td className="px-6 py-4">{item.orderFy}</td>
                <td className="px-6 py-4">{item.orderNo}</td>
                <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">{item.partyName}</td>
                <td className="px-6 py-4">{item.segment}</td>
                <td className="px-6 py-4 text-right font-medium text-text-primary">
                    {item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </td>
                <td className="px-6 py-4 text-right font-medium text-amber-400">
                  {item.reserve > 0 ? item.reserve.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'}
                </td>
              </tr>
            ))}
             {paginatedData.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-muted">No data available.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center pt-4">
        <span className="text-sm text-muted">
          Showing {data.length > 0 ? ((currentPage - 1) * ROWS_PER_PAGE) + 1 : 0}-{(currentPage * ROWS_PER_PAGE) > data.length ? data.length : (currentPage * ROWS_PER_PAGE)} of {data.length}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium bg-surface border border-border-default rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 text-sm font-medium bg-surface border border-border-default rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;