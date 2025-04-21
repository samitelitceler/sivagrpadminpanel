"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        mobileNumber: "+91",
        email: "",
        storeName: "",
        address: "",
        language: "",
        gstNumber: "",
        shopDocuments: null,
        idProof: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files) {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        }
    };

    const handleSubmit = async () => {
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key as keyof typeof formData] as string);
        }

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/vendor/register`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("Registered Successfully!");
            console.log(res.data);
        } catch (error) {
            alert("Registration Failed");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen  bg-[#1E1E1E] flex items-center justify-center p-6">
            <Card className="w-full max-w-[800px] bg-white rounded-2xl">
                <CardContent className="p-8">
                    <h1 className="text-3xl font-bold mb-8">Register</h1>
                    
                    <div className="space-y-6">
                        <div className="grid gap-6">
                            <div>
                                <Label className="text-gray-600 mb-1">Vendor Name</Label>
                                <Input
                                    name="name"
                                    placeholder="Enter Vendor Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border-b border-gray-200 focus:border-gray-400 outline-none rounded-none bg-transparent"
                                />
                            </div>

                            <div>
                                <Label className="text-gray-600 mb-1">Mobile Number</Label>
                                <Input
                                    name="mobileNumber"
                                    placeholder="Enter Mobile Number"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    className="w-full p-2 border-b border-gray-200 focus:border-gray-400 outline-none rounded-none bg-transparent"
                                />
                            </div>

                            <div>
                                <Label className="text-gray-600 mb-1">Email</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Enter Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border-b border-gray-200 focus:border-gray-400 outline-none rounded-none bg-transparent"
                                />
                            </div>

                            <div>
                                <Label className="text-gray-600 mb-1">Store Name</Label>
                                <Input
                                    name="storeName"
                                    placeholder="Enter Store Name"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    className="w-full p-2 border-b border-gray-200 focus:border-gray-400 outline-none rounded-none bg-transparent"
                                />
                            </div>

                            <div>
                                <Label className="text-gray-600 mb-1">Address</Label>
                                <Input
                                    name="address"
                                    placeholder="Enter Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full p-2 border-b border-gray-200 focus:border-gray-400 outline-none rounded-none bg-transparent"
                                />
                            </div>

                            <div>
                                <Label className="text-gray-600 mb-1">Language</Label>
                                <Input
                                    name="language"
                                    placeholder="Enter Language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full p-2 border-b border-gray-200 focus:border-gray-400 outline-none rounded-none bg-transparent"
                                />
                            </div>

                            <div>
                                <Label className="text-gray-600 mb-1">GST Number</Label>
                                <Input
                                    name="gstNumber"
                                    placeholder="Enter GST Number"
                                    value={formData.gstNumber}
                                    onChange={handleChange}
                                    className="w-full p-2 border-b border-gray-200 focus:border-gray-400 outline-none rounded-none bg-transparent"
                                />
                            </div>

                            <div>
                                <Label className="text-gray-600 mb-1">Shop Documents</Label>
                                <div className="flex items-center gap-2 border-b border-gray-200 p-2">
                                    <Input
                                        type="file"
                                        name="shopDocuments"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="shopDocuments"
                                    />
                                    <label 
                                        htmlFor="shopDocuments"
                                        className="flex items-center gap-2 text-blue-600 cursor-pointer"
                                    >
                                        <span>Upload Document</span>
                                    </label>
                                    {formData.shopDocuments && (
                                        <span className="text-sm text-gray-500">
                                            {(formData.shopDocuments as File).name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-gray-600 mb-1">ID Proof</Label>
                                <div className="flex items-center gap-2 border-b border-gray-200 p-2">
                                    <Input
                                        type="file"
                                        name="idProof"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="idProof"
                                    />
                                    <label 
                                        htmlFor="idProof"
                                        className="flex items-center gap-2 text-blue-600 cursor-pointer"
                                    >
                                        <span>Upload Document</span>
                                    </label>
                                    {formData.idProof && (
                                        <span className="text-sm text-gray-500">
                                            {(formData.idProof as File).name}
                                        </span>
                                    )}
                                </div>
            </div>
            </div>

                        <Button 
                            onClick={handleSubmit}
                            className="w-32 h-10 bg-[#98E165] hover:bg-[#7bc748] text-white rounded-lg float-right"
                        >
                            Submit
                        </Button>
            </div>
                </CardContent>
            </Card>
        </div>
    );
}
