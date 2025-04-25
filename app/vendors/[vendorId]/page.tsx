"use client";
import { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface VendorDetails {
  id: string;
  vendorName: string;
  vendorPhoneNumber: string;
  vendorCity: string;
  pinCode: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface Statistics {
  totalRegistrations: number;
  approvedRegistrations: number;
  pendingRegistrations: number;
  rejectedRegistrations: number;
}

interface Registration {
  id: string;
  fullName: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    vendorDetails: VendorDetails;
    statistics: Statistics;
    registrations: Registration[];
  };
}

export default function VendorDetails({ params }: { params: Promise<{ vendorId: string }> }) {
  const { toast } = useToast();
  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Unwrap params using React.use()
  const { vendorId } = use(params);
  
  useEffect(() => {
    const fetchDetails = async () => {
      if (!vendorId) {
        toast({
          title: "Error",
          description: "No vendor ID provided",
          variant: "destructive"
        });
        return;
      }

      try {
        const response = await fetch(
          `https://server.sivagroupmanpower.com/api/v1/vendor/details?id=${vendorId}`,
        );
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          toast({
            title: "Success",
            description: "Vendor details loaded successfully",
            className: 'bg-green-600 text-white'
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to load vendor details",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching vendor details:", error);
        toast({
          title: "Error",
          description: "Something went wrong while loading vendor details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [vendorId, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-500">No data found</div>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Vendor Details</h1>
        <div className="px-4 py-2 bg-black text-white rounded-md">
          Code: {data.vendorDetails.code}
        </div>
      </div>

      {/* Basic Information Card */}
      <Card className="shadow-md">
        <CardHeader className="border-b">
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Vendor Name</p>
              <p className="text-lg font-semibold">{data.vendorDetails.vendorName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-lg font-semibold">{data.vendorDetails.vendorPhoneNumber}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">City</p>
              <p className="text-lg font-semibold">{data.vendorDetails.vendorCity}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Pin Code</p>
              <p className="text-lg font-semibold">{data.vendorDetails.pinCode}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Created At</p>
              <p className="text-lg font-semibold">
                {new Date(data.vendorDetails.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Total Registrations</p>
              <p className="text-3xl font-bold">{data.statistics.totalRegistrations}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {data.statistics.approvedRegistrations}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {data.statistics.pendingRegistrations}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">
                {data.statistics.rejectedRegistrations}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registrations Table */}
      <Card className="shadow-md">
        <CardHeader className="border-b">
          <CardTitle>Registrations History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registration Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.registrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No registrations found
                  </TableCell>
                </TableRow>
              ) : (
                data.registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">{registration.fullName}</TableCell>
                    <TableCell>{registration.phoneNumber}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          registration.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : registration.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {registration.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(registration.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}