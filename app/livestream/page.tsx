"use client"
import { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { DatePicker } from "@/components/ui/date-picker"; // You'll need to implement or import this
// import { TimePicker } from "@/components/ui/time-picker"; // You'll need to implement or import this
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import Cookies from 'js-cookie';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface LiveStream {
  id: string;
  date: string;
  timeSlots: TimeSlot[];
  status: 'ongoing' | 'scheduled' | 'completed';
  thumbnail: string;
  viewCount: number;
  title: string;
}

export default function Livestream() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ startTime: '', endTime: '' }]);

  useEffect(() => {
    fetchLivestreams();
  }, []);

  const fetchLivestreams = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/vendor/get-livestream-availability`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`
          }
        }
      );
      setStreams(response.data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch livestreams",
        variant: "destructive",
      });
      console.log(error);
      
    }
  };

  const handleScheduleLivestream = async () => {
    try {
      const payload = {
        date: selectedDate.toISOString(),
        timeSlots: timeSlots.map(slot => ({
          startTime: new Date(slot.startTime).toISOString(),
          endTime: new Date(slot.endTime).toISOString(),
        }))
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/vendor/create-livestream-availability`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`
          }
        }
      );

      toast({
        title: "Success",
        description: "Livestream scheduled successfully",
        variant: "default",
        className: "bg-green-500 text-white",
      });

      fetchLivestreams();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule livestream",
        variant: "destructive",
      });
      console.log(error);
      
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Livestream</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <span>Select date</span>
            <Input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-4">
            <span>Sort by</span>
            <select className="border rounded-md p-2">
              <option>All</option>
              <option>Ongoing</option>
              <option>Scheduled</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        {/* Ongoing Livestream */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ongoing Livestream</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-400 hover:bg-green-500 text-black">
                  Schedule Livestream
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Livestream</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4">
                  <div>
                    <label className="block mb-2">Date</label>
                    <Input
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    />
                  </div>
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="flex gap-4">
                      <div>
                        <label className="block mb-2">Start Time</label>
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => {
                            const newSlots = [...timeSlots];
                            newSlots[index].startTime = e.target.value;
                            setTimeSlots(newSlots);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block mb-2">End Time</label>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => {
                            const newSlots = [...timeSlots];
                            newSlots[index].endTime = e.target.value;
                            setTimeSlots(newSlots);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => setTimeSlots([...timeSlots, { startTime: '', endTime: '' }])}
                    variant="outline"
                  >
                    Add Time Slot
                  </Button>
                  <Button onClick={handleScheduleLivestream} className="w-full">
                    Schedule
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative w-64 h-64">
            {streams.find(s => s.status === 'ongoing') ? (
              <div className="relative">
                <Image
                  src="/placeholder-stream.jpg"
                  alt="Ongoing stream"
                  width={256}
                  height={256}
                  className="rounded-lg"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                  LIVE
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  <Eye size={16} />
                  <span>2k</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                No ongoing livestream
              </div>
            )}
          </div>
        </div>

        {/* Scheduled Livestreams */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Scheduled Livestream</h2>
          <div className="grid grid-cols-4 gap-4">
            {streams
              .filter(stream => stream.status === 'scheduled')
              .map((stream, index) => (
                <div key={index} className="relative">
                  <Image
                    src="/placeholder-stream.jpg"
                    alt={`Scheduled stream ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-lg"
                  />
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {new Date(stream.timeSlots[0].startTime).toLocaleDateString()}
                      {' - '}
                      {new Date(stream.timeSlots[0].startTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm">Fashion</p>
                  </div>
                  <Button className="w-full mt-2 bg-green-400 hover:bg-green-500 text-black">
                    Start
                  </Button>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Livestreams */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Livestreams</h2>
          <div className="grid grid-cols-6 gap-4">
            {streams
              .filter(stream => stream.status === 'completed')
              .map((stream, index) => (
                <div key={index} className="relative">
                  <Image
                    src="/placeholder-stream.jpg"
                    alt={`Recent stream ${index + 1}`}
                    width={160}
                    height={160}
                    className="rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    <Eye size={16} />
                    <span>2k</span>
                  </div>
                  <p className="mt-2 text-sm truncate">Establecido hecho...</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}