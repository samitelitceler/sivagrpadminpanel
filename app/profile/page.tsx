"use client"
import { useState } from 'react';
import { Pencil, Download, FileText, LogOut } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileData {
  storeName: string;
  vendorName: string;
  contactNumber: string;
  address: string;
  mailId: string;
  location: string;
  categories: string;
  gstNumber: string;
  shopDocuments: string;
  idProof: string;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    storeName: 'Pragathi Mart',
    vendorName: 'Jaydeep Singh',
    contactNumber: '1234567890',
    address: '1/205, Sector 2, Jankipuram Extension, Lucknow',
    mailId: 'Jaydeep2@gmail.com',
    location: '9.2345667, 7.1234567',
    categories: 'Wardrobe essentials, Perfumes, Furniture, Collectables',
    gstNumber: '123456789103939',
    shopDocuments: 'Pragatidoc.doc',
    idProof: 'aadharcard.pdf'
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add API call to save profile data
  };

  const renderField = (label: string, value: string, key: keyof ProfileData) => {
    return (
      <div className="border-b py-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">{label}</span>
          <div className="flex-1 ml-8">
            {isEditing && key !== 'shopDocuments' && key !== 'idProof' ? (
              <Input
                value={value}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                className="max-w-md"
              />
            ) : (
              <span className="text-gray-500">{value}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button 
          onClick={isEditing ? handleSave : handleEdit}
          className={isEditing ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}
        >
          {isEditing ? 'Save' : <Pencil className="h-5 w-5" />}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {renderField('Store Name', profile.storeName, 'storeName')}
        {renderField('Vendor Name', profile.vendorName, 'vendorName')}
        {renderField('Contact Number', profile.contactNumber, 'contactNumber')}
        {renderField('Address', profile.address, 'address')}
        {renderField('Mail Id', profile.mailId, 'mailId')}
        {renderField('Location', profile.location, 'location')}
        {renderField('Categories', profile.categories, 'categories')}
        {renderField('GST Number', profile.gstNumber, 'gstNumber')}

        {/* Shop Documents */}
        <div className="border-b py-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Shop Documents</span>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">{profile.shopDocuments}</span>
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* ID Proof */}
        <div className="border-b py-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">ID Proof</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">{profile.idProof}</span>
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-5 w-5 text-blue-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 flex justify-end">
          <Button variant="destructive" className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}