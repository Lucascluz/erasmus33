"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Image, Input, Card } from "@heroui/react";

import { supabase } from "@/lib/supabase";
import { User } from "@/interfaces/user";

import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@heroui/button";

const fallbackPfp =
  "https://gkpotoixqcjijozesfee.supabase.co/storage/v1/object/public/profile_pictures/assets/user-placeholder.png";

export default function ProfilePage() {
  const router = useRouter();
  const { id } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
      } else {
        console.log("User:", data);
        setUser(data);
      }
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (!user) return <div className="text-center p-4">User not found.</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-end mb-4">
        <Button variant="bordered" onPress={() => router.push("/admin/houses")}>
          Back to Houses
        </Button>
      </div>
      <Card className="p-4">
        <div className="grid grid-cols-6 gap-4 justify-between align-center">
          <div className="col-span-2 flex items-center justify-center">
            <Card
              isFooterBlurred
              className="flex flex-col items-center border-none w-full"
            >
              <Image
                removeWrapper
                alt="Card example background"
                className="object-cover "
                fallbackSrc={fallbackPfp}
                src={user.profile_picture || fallbackPfp}
              />
            </Card>
          </div>
          <div className="col-span-4">
            <div className="gap-4">
              <p className="m-2">Personal Information</p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  value={user.first_name ?? ""}
                  onChange={(e) =>
                    setUser({ ...user, first_name: e.target.value })
                  }
                />
                <Input
                  label="Last Name"
                  maxLength={5}
                  type="text"
                  value={user.last_name ?? ""}
                  onChange={(e) =>
                    setUser({ ...user, last_name: e.target.value })
                  }
                />
              </div>
              <p className="m-2">International Information</p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nationality"
                  type="text"
                  value={user.country ?? ""}
                  onChange={(e) =>
                    setUser({ ...user, country: e.target.value })
                  }
                />
                <Input
                  label="Preferred Language"
                  type="text"
                  value={user.preferred_language ?? ""}
                  onChange={(e) =>
                    setUser({ ...user, preferred_language: e.target.value })
                  }
                />
              </div>
              <p className="m-2">Contact Information</p>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <Input
                  label="Phone Number"
                  type="text"
                  value={user.phone_number ?? ""}
                  onChange={(e) =>
                    setUser({ ...user, phone_number: e.target.value })
                  }
                />
                <Input
                  label="PT Phone Number"
                  type="text"
                  value={user.pt_phone_number ?? ""}
                  onChange={(e) =>
                    setUser({ ...user, pt_phone_number: e.target.value })
                  }
                />
                <Input
                  className="col-span-2"
                  label="Email"
                  type="email"
                  value={user.email ?? ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <p className="m-2">Renting Information</p>
              <div className="grid grid-cols-4 gap-4">
                <Input
                  label="Room Number"
                  type="text"
                  value={user.room_number ? user.room_number.toString() : "0"}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      room_number: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
                <Input
                  label="House Number"
                  type="text"
                  value={user.house_number ? user.house_number.toString() : "0"}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      house_number: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
                <Input
                  label="Arrival Date"
                  type="date"
                  value={user.arrival_date ? user.arrival_date.toString() : ""}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      arrival_date: new Date(e.target.value),
                    })
                  }
                />
                <Input
                  label="Departure Estimate"
                  type="date"
                  value={
                    user.departure_estimate
                      ? user.departure_estimate.toString()
                      : ""
                  }
                  onChange={(e) =>
                    setUser({
                      ...user,
                      departure_estimate: new Date(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
