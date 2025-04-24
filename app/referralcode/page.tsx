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
import Cookies from "js-cookie";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface ReferralCode {
  id: string;
  code: string;
  userName: string;
  phoneNumber: string;
  city: string;
  role: string;
  totalReferred: number;
  totalEarnings: string;
  status: string;
  referredRole: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ReferralCodeManagement() {
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: "",
    city: "",
    role: "USER"
  });

  useEffect(() => {
    fetchReferralCodes();
  }, []);

  const fetchReferralCodes = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch('https://server.sivagroupmanpower.com/api/v1/referral/codes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setReferralCodes(data.data || []);
    } catch (error) {
      console.error('Error fetching referral codes:', error);
      setReferralCodes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    const token = Cookies.get("token");

    try {
      await axios.post(
        'https://server.sivagroupmanpower.com/api/v1/referral/generate',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Reset form and refresh the list
      setFormData({
        userName: "",
        phoneNumber: "",
        city: "",
        role: "USER"
      });
      fetchReferralCodes();
      window.location.reload();
    } catch (error) {
      console.error('Error generating referral code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredReferralCodes = referralCodes.filter((code) => {
    const userName = code?.userName || '';
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = userName.toLowerCase().includes(searchTermLower);

    switch (activeFilter) {
      case 'verified':
        return matchesSearch && code?.status === 'VERIFIED';
      case 'pending':
        return matchesSearch && code?.status === 'PENDING';
      default:
        return matchesSearch;
    }
  });

  const totalPages = Math.ceil(filteredReferralCodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReferralCodes = filteredReferralCodes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-12 space-y-4 max-w-8xl mx-auto">
      <div className="flex justify-between items-center mb-6 ml-6">
        <CardTitle className="text-2xl font-medium">
          Referral Code Management
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              Generate New Referral
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generate Referral Code</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleGenerateReferral} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  required
                  value={formData.userName}
                  onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                  placeholder="Enter username"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+919290201010"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  required
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter city"
                  className="w-full"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Referral Code"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <CardContent>
        {/* Filter Buttons and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { label: "All Referrals", value: "all" },
            //   { label: "Verified", value: "verified" },
            //   { label: "Pending", value: "pending" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-1 rounded-full font-medium ${
                  activeFilter === filter.value
                    ? "bg-black text-white"
                    : "bg-transparent border border-black text-black"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-[21rem] shadow-[5px_5px_20px_0px_#61ABEB33] rounded-full md:ml-10">
            <Input
              type="text"
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-5 rounded-full pr-12 bg-white"
            />
          </div>
        </div>

        {/* Referral Codes Table */}
        <div className="border border-slate-200 rounded-md overflow-auto">
          <Table>
            <TableHeader className="bg-black text-white">
              <TableRow className="border-slate-200">
                <TableHead className="border-slate-200">S.No.</TableHead>
                <TableHead className="border-slate-200">Username</TableHead>
                <TableHead className="border-slate-200">Referral Code</TableHead>
                <TableHead className="border-slate-200">Phone Number</TableHead>
                <TableHead className="border-slate-200">City</TableHead>
                <TableHead className="border-slate-200">Total Referred</TableHead>
                <TableHead className="border-slate-200">Total Earnings</TableHead>
                <TableHead className="border-slate-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedReferralCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No referral codes found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedReferralCodes.map((code, index) => (
                  <TableRow key={code?.id || index} className="border-slate-200">
                    <TableCell className="border-slate-200">{startIndex + index + 1}</TableCell>
                    <TableCell className="border-slate-200">{code?.userName || 'N/A'}</TableCell>
                    <TableCell className="border-slate-200">{code?.code || 'N/A'}</TableCell>
                    <TableCell className="border-slate-200">{code?.phoneNumber || 'N/A'}</TableCell>
                    <TableCell className="border-slate-200">{code?.city || 'N/A'}</TableCell>
                    <TableCell className="border-slate-200">{code?.totalReferred || 0}</TableCell>
                    <TableCell className="border-slate-200">₹{code?.totalEarnings || '0'}</TableCell>
                    <TableCell className="border-slate-200">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="text-black underline p-0">View Details</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Referral Details</DialogTitle>
                          </DialogHeader>
                          <table className="w-full mt-4 text-center">
                            <thead>
                              <tr>
                                <th className="py-2">Person Name</th>
                                <th className="py-2">Mobile No</th>
                                <th className="py-2">Referral Code</th>
                                <th className="py-2">Total Referred</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="py-2">{code?.userName}</td>
                                <td className="py-2">{code?.phoneNumber}</td>
                                <td className="py-2">{code?.code}</td>
                                <td className="py-2">{code?.totalReferred}</td>
                              </tr>
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