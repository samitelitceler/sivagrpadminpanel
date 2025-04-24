"use client";

import { useState } from "react";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";

interface User {
  id: number;
  customerId: string;
  customerName: string;
  phoneNo: string;
  location: string;
  previousBookings: number;
}

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample data
  const users: User[] = [
    { id: 1, customerId: "OA12345", customerName: "Pragati", phoneNo: "123456789", location: "Hyderabad", previousBookings: 3 },
    { id: 2, customerId: "OA12346", customerName: "Rahul",   phoneNo: "987654321", location: "Mumbai",    previousBookings: 1 },
    { id: 3, customerId: "OA12347", customerName: "Sneha",   phoneNo: "912345678", location: "Delhi",     previousBookings: 2 },
    // ...more users
  ];

  // Filter by name
  const filtered = users.filter(user =>
    user.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-12 space-y-4 max-w-6xl mx-auto">
      <CardTitle className="text-2xl font-medium mb-4 ml-6">
        Users
      </CardTitle>

      <CardContent>
        {/* Search Bar */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by customer name"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 w-full"
          />
        </div>

        {/* Users Table */}
        <div className="overflow-auto rounded border border-slate-200">
          <Table>
            <TableHeader className="bg-black text-white">
              <TableRow>
                <TableHead className="border-slate-200">S.No.</TableHead>
                <TableHead className="border-slate-200">Customer ID</TableHead>
                <TableHead className="border-slate-200">Customer Name</TableHead>
                <TableHead className="border-slate-200">Phone No.</TableHead>
                <TableHead className="border-slate-200">Location</TableHead>
                <TableHead className="border-slate-200">Prev. Bookings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((user, idx) => (
                  <TableRow key={user.id}>
                    <TableCell className="border-slate-200">
                      {startIndex + idx + 1}
                    </TableCell>
                    <TableCell className="border-slate-200">{user.customerId}</TableCell>
                    <TableCell className="border-slate-200">{user.customerName}</TableCell>
                    <TableCell className="border-slate-200">{user.phoneNo}</TableCell>
                    <TableCell className="border-slate-200">{user.location}</TableCell>
                    <TableCell className="border-slate-200">{user.previousBookings}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 ? (
                  <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} />
                ) : (
                  <PaginationPrevious className="pointer-events-none opacity-50" />
                )}
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    onClick={() => setCurrentPage(idx + 1)}
                    isActive={currentPage === idx + 1}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                {currentPage < totalPages ? (
                  <PaginationNext onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} />
                ) : (
                  <PaginationNext className="pointer-events-none opacity-50" />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </div>
  );
}