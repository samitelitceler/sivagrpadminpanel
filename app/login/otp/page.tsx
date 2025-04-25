"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoaderOverlay from "@/components/ui/Loader";
import { Poppins } from "next/font/google";
import { KeyRound } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] });

const CountdownTimer = ({ onResend }: { onResend: () => void }) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <p className="text-sm text-gray-500 mt-2">
      {countdown > 0 ? (
        `Resend OTP in ${countdown}s`
      ) : (
        <button onClick={onResend} className="text-[#4361EE]">
          Resend OTP
        </button>
      )}
    </p>
  );
};

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const phoneNumber = Cookies.get("phoneNumber");
      const orderId = Cookies.get("orderId");

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-otp`, {
        phoneNumber,
        otp,
        orderId
      });

      if(res.status === 200) {
        Cookies.set("token", res.data.token, { expires: 1 });
        
        toast({
          title: "Success",
          description: "OTP verified successfully",
          variant: "default",
          className: "bg-green-500 text-white",
        });
        router.push("/"); // This should now work because token is set
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const phoneNumber = Cookies.get("phoneNumber");
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/vendor/login`, { phoneNumber });
      
      if(res.status === 200) {
        Cookies.set("orderId", res.data.data.orderId);
        toast({
          title: "Success",
          description: "OTP resent successfully",
          variant: "default",
          className: "bg-green-500 text-white",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Failed to resend OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`${poppins.className} flex h-screen w-screen`}>
      <div className="w-1/2 bg-black"></div>
      <div className="w-1/2 flex justify-center items-center bg-white">
        <Card className="w-full mx-8">
          <CardHeader className="text-2xl font-poppins font-bold text-left text-[#262626] px-6">
            Verify OTP
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            <div>
              <label className={otp ? "text-sm font-medium text-[#4361EE]" : "text-sm font-medium text-[#262626]"}>
                Enter OTP
              </label>
              <div className="flex items-center border border-[#D8D8D8] rounded-md p-2 mt-1">
                <KeyRound className={otp ? "mr-2 text-[#4361EE]" : "mr-2 text-[#D8D8D8]"} />
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border-none focus:text-[#4361EE] focus:outline-none placeholder:text-[#D8D8D8] w-full"
                  maxLength={6}
                />
              </div>
              <CountdownTimer onResend={handleResendOtp} />
            </div>
            <Button 
              onClick={handleVerifyOtp} 
              className="w-full text-white bg-[#2BA33E] cursor-pointer hover:bg-green-700 mt-4" 
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </CardContent>
        </Card>
      </div>
      {loading && <LoaderOverlay />}
    </div>
  );
}