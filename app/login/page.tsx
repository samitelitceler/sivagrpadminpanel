"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoaderOverlay from "@/components/ui/Loader";
import { Poppins } from "next/font/google";
import { User } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] });



export default function Login() {
  const [phoneNumber, setphoneNumber] = useState("+91");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, { phoneNumber });
      console.log(res.data);
      if(res.status == 200){
        // Store orderId and phoneNumber in cookies
        Cookies.set("orderId", res.data.data.orderId);
        Cookies.set("phoneNumber", phoneNumber);
        
        toast({
          title: "Success",
          description: "OTP sent successfully",
          variant: "default",
          className: "bg-green-500 text-white",
        });
      }
      router.push("/login/otp");
    } catch (err) {
      console.log(err);
      setError("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={`${poppins.className} flex h-screen w-screen`}>
      {/* Left Dark Section */}
      <div className="w-1/2">
        <img src="/images/leftPageBackground.png" className="opacity-90 filter grayscale brightness-10" alt="leftPageBackground"  />
      </div>
      {/* Right Login Section */}
      <div className="w-1/2  flex justify-center items-center bg-white">
        <Card className="w-full">
          <CardHeader className="text-2xl font-poppins font-bold text-left text-[#262626]">Login</CardHeader>
          <CardContent className="space-y-4">
            <div >
              <label className={phoneNumber ? "text-sm font-medium text-[#4361EE]" : "text-sm font-medium text-[#262626]"}>Mobile Number or Phone no.</label>
              <div className="flex items-center border border-[#D8D8D8] rounded-md p-2">
                <User className={phoneNumber ? "mr-2 text-[#4361EE]" : "mr-2 text-[#D8D8D8]"} />
                <Input
                  type="text"
                  placeholder="Enter your mobile number"
                  value={phoneNumber}
                  onChange={(e) => setphoneNumber(e.target.value)}
                  className="border-none focus:text-[#4361EE] focus:outline-none placeholder:text-[#D8D8D8]"
                />
              </div>
            </div>
           
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={handleLogin} className="w-full text-white bg-[#2BA33E] cursor-pointer hover:bg-green-700" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
      {loading && <LoaderOverlay />}
    </div>
  );
}
