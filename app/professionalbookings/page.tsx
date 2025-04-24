"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ProfessionalDetail {
  name: string
  phone: string
  service: string
}

interface Booking {
  id: number
  customerName: string
  customerPhone: string
  location: string
  serviceType: string
  manpowerRequired: number
  professionals: ProfessionalDetail[]
}

export default function ProfessionalBookings() {
  // Hard-coded bookings
  const bookings: Booking[] = [
    {
      id: 1,
      customerName: "John Doe",
      customerPhone: "9876543210",
      location: "Mumbai",
      serviceType: "Stewards",
      manpowerRequired: 2,
      professionals: [
        { name: "Alice Smith", phone: "9123456780", service: "Stewards" },
        { name: "Bob Johnson", phone: "9123456781", service: "Stewards" },
      ],
    },
    {
      id: 2,
      customerName: "Jane Roe",
      customerPhone: "9123456700",
      location: "Delhi",
      serviceType: "Chefs",
      manpowerRequired: 1,
      professionals: [
        { name: "Chef Marco", phone: "9000000001", service: "Chefs" },
      ],
    },
    {
      id: 3,
      customerName: "Acme Corp",
      customerPhone: "9112345678",
      location: "Bengaluru",
      serviceType: "Security Services",
      manpowerRequired: 3,
      professionals: [
        { name: "Officer Lee",   phone: "9000000002", service: "Security Services" },
        { name: "Officer Patel", phone: "9000000003", service: "Security Services" },
        { name: "Officer Khan",  phone: "9000000004", service: "Security Services" },
      ],
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // filter + paginate
  const filtered = bookings.filter((b) =>
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const pageData = filtered.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="p-12 space-y-4 max-w-6xl mx-auto">
      <CardTitle className="text-2xl font-medium mb-6 ml-6">
        Professional Bookings
      </CardTitle>

      <CardContent>
        {/* Search Bar */}
        <div className="mb-4 max-w-sm ">
          <Input
            placeholder="Search by customer name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
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
                <TableHead className="border-slate-200">Service Type</TableHead>
                <TableHead className="border-slate-200">Manpower Req.</TableHead>
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
                      {bk.serviceType}
                    </TableCell>
                    <TableCell className="border-slate-200">
                      {bk.manpowerRequired}
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
                            <DialogTitle>Professionals Booked</DialogTitle>
                          </DialogHeader>
                          <table className="w-full text-left mt-4">
                            <thead>
                              <tr>
                                <th className="py-2">Name</th>
                                <th className="py-2">Phone</th>
                                <th className="py-2">Service</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bk.professionals.map((p, i) => (
                                <tr key={i} className="border-t">
                                  <td className="py-2">{p.name}</td>
                                  <td className="py-2">{p.phone}</td>
                                  <td className="py-2">{p.service}</td>
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
                    onClick={() =>
                      setCurrentPage((p) => Math.max(p - 1, 1))
                    }
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
  )
}