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
import { CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Vendor {
    id: string;
    vendorName: string;
    vendorPhoneNumber: string;
    vendorCity: string;
    pinCode: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export default function Vendors() {
    const { toast } = useToast();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        vendorName: "",
        vendorPhoneNumber: "+91",
        vendorCity: "",
        pinCode: "",
    });
    const router = useRouter();

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        const token = Cookies.get("token");
        try {
            const response = await fetch('https://server.sivagroupmanpower.com/api/v1/vendor/get-all-vendor-details', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setVendors(data.data);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch vendors",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast({
                title: "Error",
                description: "Something went wrong while loading vendors",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateVendor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        const token = Cookies.get("token");

        try {
            const response = await fetch(
                'https://server.sivagroupmanpower.com/api/v1/vendor/generate-vendor-code',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Vendor added successfully",
                    className: 'bg-green-600 text-white'
                });
                // Reset form and refresh the list
                setFormData({
                    vendorName: "",
                    vendorPhoneNumber: "+91",
                    vendorCity: "",
                    pinCode: "",
                });
                fetchVendors();
                window.location.reload();
            } else {
                toast({
                    title: "Error",
                    description: "Failed to add vendor",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error generating vendor code:', error);
            toast({
                title: "Error",
                description: "Something went wrong while adding vendor",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleViewDetails = (id: string) => {
        try {
            // console.log(id);
            
            router.push(`/vendors/${id}`);
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Failed to navigate to vendor details",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="p-12 space-y-4 max-w-8xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <CardTitle className="text-2xl font-medium">
                    Vendor Management
                </CardTitle>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-black text-white hover:bg-gray-800">
                            Add New Vendor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Vendor</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleGenerateVendor} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Vendor Name</label>
                                <Input
                                    required
                                    value={formData.vendorName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, vendorName: e.target.value }))}
                                    placeholder="Enter vendor name"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <div className="relative">
                                    <Input
                                        required
                                        value={formData.vendorPhoneNumber}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            // If user tries to delete the +91, keep it
                                            if (!value.startsWith('+91')) {
                                                value = '+91' + value.replace(/^\+91/, '');
                                            }
                                            // Remove any non-digit characters except the +
                                            value = value.replace(/[^\d+]/g, '');
                                            // Limit to +91 and 10 digits
                                            if (value.length > 13) {
                                                value = value.slice(0, 13);
                                            }
                                            setFormData(prev => ({ ...prev, vendorPhoneNumber: value }));
                                        }}
                                        placeholder="Enter 10 digit number"
                                        className="w-full"
                                        type="tel"
                                        pattern="^\+91\d{10}$"
                                        maxLength={13}
                                    />
                                </div>
                                {/* <p className="text-xs text-gray-500">Format: +91 followed by 10 digits</p> */}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City</label>
                                <Input
                                    required
                                    value={formData.vendorCity}
                                    onChange={(e) => setFormData(prev => ({ ...prev, vendorCity: e.target.value }))}
                                    placeholder="Enter city"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pin Code</label>
                                <Input
                                    required
                                    value={formData.pinCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, pinCode: e.target.value }))}
                                    placeholder="Enter pin code"
                                    className="w-full"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-black text-white hover:bg-gray-800"
                                disabled={isGenerating}
                            >
                                {isGenerating ? "Adding..." : "Add Vendor"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <CardContent>
                <div className="border border-slate-200 rounded-md overflow-auto">
                    <Table>
                        <TableHeader className="bg-black text-white">
                            <TableRow className="border-slate-200">
                                <TableHead className="border-slate-200">S.No.</TableHead>
                                <TableHead className="border-slate-200">Vendor Name</TableHead>
                                <TableHead className="border-slate-200">Phone Number</TableHead>
                                <TableHead className="border-slate-200">City</TableHead>
                                <TableHead className="border-slate-200">Pin Code</TableHead>
                                <TableHead className="border-slate-200">Vendor Code</TableHead>
                                <TableHead className="border-slate-200">Created At</TableHead>
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
                            ) : vendors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
                                        No vendors found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                vendors.map((vendor, index) => (
                                    <TableRow key={vendor.id} className="border-slate-200">
                                        <TableCell className="border-slate-200">{index + 1}</TableCell>
                                        <TableCell className="border-slate-200">{vendor.vendorName}</TableCell>
                                        <TableCell className="border-slate-200">{vendor.vendorPhoneNumber}</TableCell>
                                        <TableCell className="border-slate-200">{vendor.vendorCity}</TableCell>
                                        <TableCell className="border-slate-200">{vendor.pinCode}</TableCell>
                                        <TableCell className="border-slate-200">{vendor.code}</TableCell>
                                        <TableCell className="border-slate-200">
                                            {new Date(vendor.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="border-slate-200">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleViewDetails(vendor.id)}
                                                className="text-black hover:bg-gray-100"
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </div>
    );
}