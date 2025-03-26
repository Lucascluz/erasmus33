"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  CardFooter,
  Image,
  Modal,
  Card,
  ModalBody,
  ModalContent,
} from "@heroui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CameraIcon,
} from "@heroicons/react/24/solid";

import { supabase } from "@/lib/supabase";
import { User } from "@/interfaces/user";
import ImageCropper from "@/components/image-cropper";
import "react-image-crop/dist/ReactCrop.css";

const fallbackPfp =
  "https://gkpotoixqcjijozesfee.supabase.co/storage/v1/object/public/profile_pictures/assets/user-placeholder.png";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [userBackup, setUserBackup] = useState<User | null>(null);
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);
  const [pfpFile, setPfpFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUser = useCallback(async () => {
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !session.session) {
      router.push("/auth/login");

      return;
    }
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      handleSignOut();
    } else {
      console.log("User:", data);
      setUser(data);
      setUserBackup(data);
    }
    setLoading(false);
    setPfpUrl(data.profile_picture);
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateUi = useCallback(
    async (file: File) => {
      if (!user || user === userBackup) {
        console.log("User not found or no changes made");

        return;
      }
      setIsModalOpen(false);

      // Create a temporary URL for immediate UI update
      const tempUrl = URL.createObjectURL(file);
      console.log("Create a temporary URL for immediate UI update", tempUrl);

      // Optimistically update UI
      console.log("Optimistically update UI");
      setPfpUrl(tempUrl);
      setPfpFile(file);
    },
    [user, userBackup],
  );

  const updateUserData = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      setLoading(true);

      // Upload profile picture
      if (pfpFile) {
        const { error: uplError } = await supabase.storage
          .from("profile_pictures")
          .upload(`public/${user.id}.png`, pfpFile, {
            upsert: true,
            contentType: pfpFile.type || "image/png", // Usa o tipo real do arquivo
          });

        if (uplError) {
          console.error("Error uploading profile picture:", uplError.message);
        } else {
          if (!pfpFile.type.startsWith("image/")) {
            console.error("Invalid file type:", pfpFile.type);

            return;
          }
          console.log("Profile picture uploaded successfully");
          // Retrieve new profile picture URL
          const { data } = await supabase.storage
            .from("profile_pictures")
            .getPublicUrl(`public/${user.id}.png`);

          if (!data) {
            console.error("Error getting profile picture URL");
          } else {
            setUser({ ...user, profile_picture: data.publicUrl });
            console.log("Profile picture URL:", user.profile_picture);
          }
        }

        // Update user data
        const { error: updError } = await supabase
          .from("users")
          .update(user)
          .eq("id", user.id);

        if (updError) console.error("Error updating user:", updError.message);
        else console.log("User updated successfully");
        setLoading(false);
      }
    },
    [user, pfpFile],
  );

  const handleSignOut = useCallback(() => {
    supabase.auth.signOut();
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (!user) return <div className="text-center p-4">User not found.</div>;

  return (
    <div className="container mx-auto">
      <Card className="p-6">
        <form className="space-y-4" onSubmit={updateUserData}>
          <div className="grid grid-cols-6 gap-4 justify-between align-center">
            <div className="col-span-2 flex items-center justify-center">
              <Card className="flex flex-col items-center border-none w-full">
                <Image
                  removeWrapper
                  alt="Card example background"
                  className="object-cover"
                  fallbackSrc={fallbackPfp}
                  src={pfpUrl || fallbackPfp}
                />
                <CardFooter className="justify-between py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] ml-1 z-10">
                  <ImageCropper
                    isCircular
                    aspectRatio={"1/1"}
                    callback={(file) => updateUi(file)}
                  />
                </CardFooter>
              </Card>
              <div></div>
            </div>
            <div className="col-span-4">
              <div className="gap-4">
                <p className="m-2 font-bold">Personal Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-2">
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="text-lg">
                      {user?.first_name || "Not provided"}
                    </p>
                  </div>
                  <div className="p-2">
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="text-lg">
                      {user?.last_name || "Not provided"}
                    </p>
                  </div>
                </div>
                <p className="m-2 font-bold">International Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-2">
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="text-lg">{user?.country || "Not provided"}</p>
                  </div>
                  <div className="p-2">
                    <p className="text-sm text-gray-500">Preferred Language</p>
                    <p className="text-lg">
                      {user?.preferred_language || "Not provided"}
                    </p>
                  </div>
                </div>
                <p className="m-2 font-bold">Contact Information</p>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-2">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-lg">
                      {user?.phone_number || "Not provided"}
                    </p>
                  </div>
                  <div className="p-2">
                    <p className="text-sm text-gray-500">PT Phone Number</p>
                    <p className="text-lg">
                      {user?.pt_phone_number || "Not provided"}
                    </p>
                  </div>
                  <div className="p-2 col-span-2">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg">{user?.email || "Not provided"}</p>
                  </div>
                </div>

                {user.role !== "user" && (
                  <>
                    <p className="m-2 font-bold">Renting Information</p>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-2">
                        <p className="text-sm text-gray-500">Room Number</p>
                        <p className="text-lg">{user?.room_number || "0"}</p>
                      </div>
                      <div className="p-2">
                        <p className="text-sm text-gray-500">House Number</p>
                        <p className="text-lg">{user?.house_number || "0"}</p>
                      </div>
                      <div className="p-2">
                        <p className="text-sm text-gray-500">Arrival Date</p>
                        <p className="text-lg">
                          {user?.arrival_date
                            ? new Date(user.arrival_date).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                      <div className="p-2">
                        <p className="text-sm text-gray-500">
                          Departure Estimate
                        </p>
                        <p className="text-lg">
                          {user?.departure_estimate
                            ? new Date(
                                user.departure_estimate,
                              ).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button color="danger" onPress={handleSignOut}>
              Log Out
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
