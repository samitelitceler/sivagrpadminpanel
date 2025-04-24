"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { MapPin } from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";

interface Professional {
  id: string;
  fullName: string;
  email: string;
  referralCode: string;
  phoneNumber: string;
  whatsappNumber: string;
  alternatePhoneNumber: string;
  status: string;
  age: number;
  permanentAddress: string;
  currentAddress: string;
  workingExperience: string;
  serviceType: string;
  createdAt: string;
  // ... other fields as needed
}

export default function ProfessionalManagement() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch('https://server.sivagroupmanpower.com/api/v1/registration-form', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProfessionals(data.data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const token = Cookies.get("token");
    try {
      await axios.put(
        `https://server.sivagroupmanpower.com/api/v1/registration-form?id=${id}`, 
        { status: "APPROVED" },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      fetchProfessionals();
    } catch (error) {
      console.error('Error approving professional:', error);
    }
  };

  const handleReject = async (id: string) => {
    const token = Cookies.get("token");
    try {
      await axios.put(
        `https://server.sivagroupmanpower.com/api/v1/registration-form?id=${id}`, 
        { status: "REJECTED" },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      fetchProfessionals();
    } catch (error) {
      console.error('Error rejecting professional:', error);
    }
  };

  const filteredProfessionals = professionals.filter((professional) => {
    const name = professional?.fullName || '';
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = name.toLowerCase().includes(searchTermLower);

    switch (activeFilter) {
      case 'approved':
        return matchesSearch && professional?.status === 'APPROVED';
      case 'pending':
        return matchesSearch && professional?.status === 'PENDING';
      case 'rejected':
        return matchesSearch && professional?.status === 'REJECTED';
      default:
        return matchesSearch;
    }
  });

  const totalPages = Math.ceil(filteredProfessionals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProfessionals = filteredProfessionals.slice(startIndex, startIndex + itemsPerPage);

//   const openGoogleMaps = (latitude: number, longitude: number) => {
//     const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
//     window.open(googleMapsUrl, '_blank');
//   };

  return (
    <div className="p-12 space-y-4 max-w-8xl mx-auto ">
      <CardTitle className="text-2xl font-medium mb-6 ml-6">
        Professional Management
      </CardTitle>
      <CardContent>
        {/* Filter Buttons and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { label: "All Professionals", value: "all" },
              { label: "Approved", value: "approved" },
              { label: "Pending", value: "pending" },
              { label: "Rejected", value: "rejected" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-1 rounded-full font-medium ${
                  activeFilter === filter.value
                    ? "bg-black text-white"
                    : "bg-transparent border border-gray-500 text-black"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-[21rem] shadow-[5px_5px_20px_0px_#61ABEB33] rounded-full md:ml-10">
            <Input
              type="text"
              placeholder="Search by professional name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-5 rounded-full pr-12 bg-white"
            />
          </div>
        </div>

        {/* Professionals Table */}
        <div className="border border-slate-200 rounded-md overflow-auto">
          <Table>
            <TableHeader className="bg-black text-white">
              <TableRow className="border-slate-200">
                <TableHead className="border-slate-200">S.No.</TableHead>
                <TableHead className="border-slate-200">Full Name</TableHead>
                <TableHead className="border-slate-200">Service Type</TableHead>
                <TableHead className="border-slate-200">Contact Number</TableHead>
                <TableHead className="border-slate-200">Experience</TableHead>
                <TableHead className="border-slate-200">Status</TableHead>
                <TableHead className="border-slate-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedProfessionals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No professionals found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProfessionals.map((professional, index) => (
                  <TableRow key={professional?.id || index} className="border-slate-200">
                    <TableCell className="border-slate-200">{startIndex + index + 1}</TableCell>
                    <TableCell className="border-slate-200">{professional?.fullName || 'N/A'}</TableCell>
                    <TableCell className="border-slate-200">{professional?.serviceType || 'N/A'}</TableCell>
                    <TableCell className="border-slate-200">{professional?.phoneNumber || 'N/A'}</TableCell>
                    <TableCell className="border-slate-200">{professional?.workingExperience || 'N/A'}</TableCell>
                    <TableCell className="border-slate-200">
                      {professional?.status === 'PENDING' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(professional.id)}
                            className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(professional.id)}
                            className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span>{professional?.status || 'N/A'}</span>
                      )}
                    </TableCell>
                    <TableCell className="border-slate-200">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="px-4 py-1 bg-black text-white rounded-md hover:bg-gray-700 transition-colors">
                            View Details
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{professional.fullName} – Details</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div><span className="font-semibold">Referral Code:</span> {professional.referralCode}</div>
                            <div><span className="font-semibold">Email:</span> {professional.email}</div>
                            <div><span className="font-semibold">Phone:</span> {professional.phoneNumber}</div>
                            <div><span className="font-semibold">WhatsApp:</span> {professional.whatsappNumber}</div>
                            <div><span className="font-semibold">Alternate Phone:</span> {professional.alternatePhoneNumber}</div>
                            <div><span className="font-semibold">Age:</span> {professional.age}</div>
                            <div><span className="font-semibold">Service Type:</span> {professional.serviceType}</div>
                            <div><span className="font-semibold">Experience:</span> {professional.workingExperience}</div>
                            <div><span className="font-semibold">Permanent Address:</span> {professional.permanentAddress}</div>
                            <div><span className="font-semibold">Current Address:</span> {professional.currentAddress}</div>
                            <div><span className="font-semibold">Status:</span> {professional.status}</div>
                            <div><span className="font-semibold">Registered On:</span> {new Date(professional.createdAt).toLocaleString()}</div>
                          </div>
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
                  <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
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
                  <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
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
