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

interface Registration {
  id: string;
  fullName: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Statistics {
  totalRegistrations: number;
  approvedRegistrations: number;
  pendingRegistrations: number;
  rejectedRegistrations: number;
}

interface ReferralDetails {
  id: string;
  code: string;
  userName: string;
  phoneNumber: string;
  city: string;
  role: string;
  totalReferred: number;
  totalEarnings: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    referralDetails: ReferralDetails;
    statistics: Statistics;
    registrations: Registration[];
  };
}

export default function ReferralDetails({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast();
  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = use(params);
  

  useEffect(() => {
    const fetchDetails = async () => {
      console.log("Fetching details for ID:", id);
      if (!id) {
        toast({
          title: "Error",
          description: "No referral ID provided",
          variant: "destructive"
        });
        return;
      }



      try {
        const response = await fetch(
          `https://server.sivagroupmanpower.com/api/v1/referral/details?id=${id}`);
        const result = await response.json();
        console.log("API Response:", result);

        if (result.success) {
          setData(result.data);
          toast({
            title: "Success",
            description: "Referral details loaded successfully",
            className: "bg-green-600 text-white"
          });
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to load referral details",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching referral details:", error);
        toast({
          title: "Error",
          description: "Something went wrong while loading referral details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, toast]);

  if (loading) {
    return <div className="p-12">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="p-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">No Data Found</h2>
          <p className="mt-2 text-gray-600">The requested referral details could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Referral Details</h1>

      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{data.referralDetails.userName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Referral Code</p>
              <p className="font-medium">{data.referralDetails.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{data.referralDetails.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="font-medium">{data.referralDetails.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="font-medium">₹{data.referralDetails.totalEarnings}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Referred</p>
              <p className="font-medium">{data.referralDetails.totalReferred}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Registrations</p>
              <p className="text-2xl font-bold">{data.statistics.totalRegistrations}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">{data.statistics.approvedRegistrations}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{data.statistics.pendingRegistrations}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{data.statistics.rejectedRegistrations}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registrations</CardTitle>
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
              {data.registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>{registration.fullName}</TableCell>
                  <TableCell>{registration.phoneNumber}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${registration.status === "APPROVED"
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
                    {new Date(registration.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}