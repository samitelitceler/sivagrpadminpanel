"use client"
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Order {
  sNo: number;
  orderId: string;
  customerName: string;
  time: string;
  phoneNumber: string;
  product: string;
  status: 'Delivered' | 'Under process' | 'Cancelled' | 'Out for Delivery';
}

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortBy, setSortBy] = useState('All');

  const orders: Order[] = [
    { sNo: 1, orderId: 'OA12345', customerName: 'Pragati', time: '12:45:01 pm', phoneNumber: '876542xxxx', product: 'Fashion', status: 'Delivered' },
    { sNo: 2, orderId: 'OA12345', customerName: 'Pragati', time: '12:45:01 pm', phoneNumber: '876542xxxx', product: 'Fashion', status: 'Under process' },
    { sNo: 3, orderId: 'OA12345', customerName: 'Pragati', time: '12:45:01 pm', phoneNumber: '876542xxxx', product: 'Fashion', status: 'Cancelled' },
    // ... add more orders as needed
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Under process':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">ORDER DETAILS</h1>
      
      {/* Order Summary */}
      <div className="flex gap-4 mb-6">
        <div className="bg-black text-white px-4 py-2 rounded-lg">
          120 Total Orders
        </div>
        <div className="px-4 py-2">32 Delivered</div>
        <div className="px-4 py-2">7 Out for Delivery</div>
        <div className="px-4 py-2">21 Under Process</div>
        <div className="px-4 py-2">12 Cancelled</div>
      </div>

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
            <option>Delivered</option>
            <option>Under process</option>
            <option>Cancelled</option>
            <option>Out for Delivery</option>
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

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">SNo</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone number</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">View Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.sNo}>
                <td className="px-6 py-4 text-sm text-gray-500">{order.sNo}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.orderId}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.customerName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.time}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.phoneNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.product}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button variant="link" className="text-blue-600">
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}