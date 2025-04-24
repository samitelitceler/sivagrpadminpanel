"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ItemBooking {
  itemName: string;
  quantity: number;
}

interface RawMaterialBooking {
  id: number;
  customerName: string;
  customerPhone: string;
  location: string;
  bookedAt: string;
  items: ItemBooking[];
}

export default function RawMaterialBookings() {
  // Hard-coded raw material bookings with bookedAt times
  const bookings: RawMaterialBooking[] = [
    {
      id: 1,
      customerName: "Alpha Industries",
      customerPhone: "9876501234",
      location: "Chennai",
      bookedAt: "2025-05-01T14:30:00Z",
      items: [
        { itemName: "Cement", quantity: 100 },
        { itemName: "Sand (tons)", quantity: 20 },
      ],
    },
    {
      id: 2,
      customerName: "BuildCo Ltd.",
      customerPhone: "9123409876",
      location: "Pune",
      bookedAt: "2025-05-02T09:15:00Z",
      items: [
        { itemName: "Bricks (pcs)", quantity: 5000 },
        { itemName: "Steel Rods (kg)", quantity: 200 },
      ],
    },
    {
      id: 3,
      customerName: "Construct Corp",
      customerPhone: "9012345678",
      location: "Kolkata",
      bookedAt: "2025-05-03T16:45:00Z",
      items: [
        { itemName: "Gravel (tons)", quantity: 15 },
        { itemName: "Tiles (boxes)", quantity: 50 },
        { itemName: "Paint (liters)", quantity: 200 },
      ],
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter by customer name
  const filtered = bookings.filter((b) =>
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Helper to format the ISO timestamp
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div className="p-12 space-y-4 max-w-6xl mx-auto">
      <CardTitle className="text-2xl font-medium mb-6 ml-6">
        Raw Material Bookings
      </CardTitle>

      <CardContent>
        {/* Search */}
        <div className="mb-4 max-w-sm">
          <Input
            placeholder="Search by customer name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full"
          />
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-md overflow-auto">
          <Table>
            <TableHeader className="bg-black text-white">
              <TableRow className="border-slate-200">
                <TableHead className="border-slate-200">S.No.</TableHead>
                <TableHead className="border-slate-200">Customer Name</TableHead>
                <TableHead className="border-slate-200">Phone No.</TableHead>
                <TableHead className="border-slate-200">Location</TableHead>
                <TableHead className="border-slate-200">Booked At</TableHead>
                <TableHead className="border-slate-200">Items Booked</TableHead>
                <TableHead className="border-slate-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((bk, idx) => (
                  <TableRow key={bk.id} className="border-slate-200">
                    <TableCell className="border-slate-200">
                      {startIndex + idx + 1}
                    </TableCell>
                    <TableCell className="border-slate-200">
                      {bk.customerName}
                    </TableCell>
                    <TableCell className="border-slate-200">
                      {bk.customerPhone}
                    </TableCell>
                    <TableCell className="border-slate-200">
                      {bk.location}
                    </TableCell>
                    <TableCell className="border-slate-200">
                      {formatDate(bk.bookedAt)}
                    </TableCell>
                    <TableCell className="border-slate-200">
                      {bk.items.map((it) => it.itemName).join(", ")}
                    </TableCell>
                    <TableCell className="border-slate-200">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0 underline">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                          </DialogHeader>
                          <p className="mt-2 text-sm text-gray-600">
                            Booked At: {formatDate(bk.bookedAt)}
                          </p>
                          <table className="w-full text-left mt-4">
                            <thead>
                              <tr>
                                <th className="py-2">Item Name</th>
                                <th className="py-2">Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bk.items.map((it, i) => (
                                <tr key={i} className="border-t">
                                  <TableCell className="py-2">{it.itemName}</TableCell>
                                  <TableCell className="py-2">{it.quantity}</TableCell>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
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
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  />
                ) : (
                  <PaginationPrevious className="pointer-events-none opacity-50" />
                )}
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                {currentPage < totalPages ? (
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                  />
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