'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from "@/hooks/use-toast"
import Cookies from "js-cookie";
import { X } from "lucide-react";

interface Ad {
  adsBannerID: string;
  bannerImageUrl: string;
}

export default function AddBanners() {
  const [file, setFile] = useState<File | null>(null)
  const [bannerTitle, setBannerTitle] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [ads, setAds] = useState<Ad[]>([])
  const { toast } = useToast()
  const token = Cookies.get("token");

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/vendor/view-banners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      if (!response.ok) throw new Error('Failed to fetch ads');
      
      const data = await response.json();
      console.log(data);
      
      // Ensure data is an array
      const adsArray = Array.isArray(data.banners) ? data.banners : [];
      
      setAds(adsArray);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/ad-banner?adsBannerID=${adId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete ad');
      setAds(ads.filter(ad => ad.adsBannerID !== adId));
      toast({
        title: "Success",
        description: "Ad deleted successfully",
        className: 'bg-[#C10001] text-white'
      });
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete ad"
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (validateFile(droppedFile)) {
      setFile(droppedFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile)
    }
  }

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
    const maxSize = 50 * 1024 * 1024 // 50MB

    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or PDF file"
      })
      return false
    }

    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size should not exceed 50MB"
      })
      return false
    }

    return true
  }

  const handleUpload = async () => {
    if (!file || !bannerTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Both banner image and title are required"
      })
      return
    }

    const formData = new FormData()
    formData.append('bannerImage', file)
    formData.append('bannerTitle', bannerTitle)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/vendor/add-banner`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      toast({
        title: "Success",
        description: "Banner uploaded successfully",
        className: 'bg-green-600 text-white'
      })
      setFile(null)
      setBannerTitle('')
      fetchAds()
    } catch (error) {
      console.error('Error uploading banner:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload banner"
      })
    }
  }

  return (
    <div className="p-12 space-y-4 max-w-8xl mx-auto">
      <h1 className="text-2xl font-semibold text-black mb-4">Upload Banner</h1>
      <p className="text-sm text-[#262626] mb-2">Upload the banner you want to display</p>
      
      <div className="mb-4">
        <label htmlFor="bannerTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Banner Title
        </label>
        <input
          id="bannerTitle"
          type="text"
          value={bannerTitle}
          onChange={(e) => setBannerTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter banner title"
        />
      </div>

      {!file && <p className="text-red-600 text-sm mb-6">No banner is uploaded</p>}

      <Card 
        className={`border-dashed border-2 ${isDragging ? 'border-black' : 'border-black'} 
        rounded-lg p-8 text-center cursor-pointer bg-transparent`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </div>
          <p className="text-[#262626]">Drag & Drop files here</p>
          <Button 
            variant="destructive" 
            className="bg-black hover:bg-gray-800 cursor-pointer w-40 text-white"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            Browse Files
          </Button>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".jpeg,.jpg,.png,.pdf"
            onChange={handleFileSelect}
          />
          <p className="text-sm text-[#262626]">or</p>
          <p className="text-sm text-[#262626]">File should be jpeg, png or pdf</p>
          <p className="text-sm text-[#262626]">Max size 50 MB</p>
        </div>
      </Card>

      {file && (
        <div className="mt-4">
          <p className="text-[#262626] mb-2">Selected file: {file.name}</p>
          <Button 
            variant="destructive" 
            className="bg-black hover:bg-[#3451DE] text-white w-40 "
            onClick={handleUpload}
            disabled={!bannerTitle.trim()}
          >
            Upload Banner
          </Button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map(ad => (
          <div key={ad.adsBannerID} className="relative">
            <img src={ad.bannerImageUrl} alt="Ad" className="w-full h-auto object-cover" />
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1"
              onClick={() => handleDeleteAd(ad.adsBannerID)}
            >
              <X className="h-4 w-4 text-[#013DC0]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
