"use client"
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface User {
  sNo: number;
  customerId: string;
  customerName: string;
  phoneNo: string;
  location: string;
}

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortBy, setSortBy] = useState('All');

  const users: User[] = [
    { sNo: 1, customerId: 'OA12345', customerName: 'Pragati', phoneNo: '123456789', location: 'Hyderabad' },
    { sNo: 2, customerId: 'OA12345', customerName: 'Pragati', phoneNo: '123456789', location: 'Hyderabad' },
    { sNo: 3, customerId: 'OA12345', customerName: 'Pragati', phoneNo: '123456789', location: 'Hyderabad' },
    { sNo: 4, customerId: 'OA12345', customerName: 'Pragati', phoneNo: '123456789', location: 'Hyderabad' },
    { sNo: 5, customerId: 'OA12345', customerName: 'Pragati', phoneNo: '123456789', location: 'Hyderabad' },
    { sNo: 6, customerId: 'OA12345', customerName: 'Pragati', phoneNo: '123456789', location: 'Hyderabad' },
    { sNo: 7, customerId: 'OA12345', customerName: 'Pragati', phoneNo: '123456789', location: 'Hyderabad' },
    { sNo: 8, customerId: 'OA12345', customerName: 'Pragati', phoneNo: '123456789', location: 'Hyderabad' },
    { sNo: 9, customerId: 'OA12345', customerName: 'Pragati', phoneNo: '123456789', location: 'Hyderabad' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      
      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span>Select date</span>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex items-center gap-4">
          <span>Sort by</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md p-2"
          >
            <option>All</option>
            <option>Name</option>
            <option>Location</option>
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">SNo</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone no.</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Location</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.sNo} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{user.sNo}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.customerId}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.customerName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.phoneNo}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.location}</td>
                <td className="px-6 py-4">
                  {user.sNo === 1 ? (
                    <button className="text-blue-600 hover:text-blue-800">View more</button>
                  ) : (
                    <button className="text-blue-600 hover:text-blue-800">Invoice</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}