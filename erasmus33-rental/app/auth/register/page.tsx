"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectItem } from "@heroui/react";
import {
  Button,
  CardFooter,
  Image,
  Input,
  Modal,
  Card,
  ModalBody,
  ModalContent,
} from "@heroui/react";

import { supabase } from "@/lib/supabase";
import { User } from "@/interfaces/user";
import { countries } from "@/lib/countries";
import { languages } from "@/lib/languages";
import ImageCropper from "@/components/image-cropper";

import "react-image-crop/dist/ReactCrop.css";
import { UUID } from "crypto";

const fallbackPfp =
  "https://gkpotoixqcjijozesfee.supabase.co/storage/v1/object/public/profile_pictures/assets/user-placeholder.png";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);
  const [pfpFile, setPfpFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [otherNationalityState, setOtherNationalityState] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const blankUser: User = {
    first_name: "",
    last_name: "",
    phone_number: "",
    pt_phone_number: "",
    email: "",
    country: "",
    preferred_language: "",
    role: "user",
  };

  useEffect(() => {
    setLoading(true);
    setUser(blankUser);
    setLoading(false);
  }, [router]);

  async function updateUi(file: File) {
    if (!user) {
      console.log("User not found");

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
  }

  async function handleRegister(e: React.FormEvent) {
    if (!user || !passwordMatch) return;
    e.preventDefault();

    // Sign up user
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email: user.email,
      password: password,
    });

    if (signUpError || !userData) {
      console.error("Error signing up:", signUpError?.message);
      setLoading(false);

      return;
    } else {
      console.log("Confirmation email sent:", userData.user);
    }
    confirmRegsiter(userData.user?.id!);
  }

  function confirmRegsiter(id: string) {
    if (!user || !pfpFile) {
      console.log("User or pfpFile not found");

      return;
    }

    // Upload profile picture
    const filePath = `public/${id}`;

    supabase.storage
      .from("profile_pictures")
      .upload(filePath, pfpFile)
      .then((response) => {
        if (response.error) {
          console.error(
            "Error uploading profile picture:",
            response.error.message,
          );

          return;
        }
        console.log("Profile picture uploaded:", response.data);
      });

    // Get the public URL of the uploaded image
    const { data } = supabase.storage
      .from("profile_pictures")
      .getPublicUrl(filePath);

    // Insert user data
    supabase
      .from("users")
      .insert({
        id: id as UUID,
        ...user,
        profile_picture: data?.publicUrl,
      })
      .then((response) => {
        if (response.error) {
          console.error("Error inserting user data:", response.error.message);

          return;
        }
        console.log("User data inserted:", response.data);
      });

    setLoading(false);
    router.push("/auth/register/success");
  }

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (!user) return <div className="text-center p-4">User not found.</div>;

  return (
    <div className="container mx-auto py-6">
      <Card className="p-4">
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="grid grid-cols-6 gap-4 justify-between align-center">
            <div className="col-span-2 flex items-center justify-center">
              <Card
                isBlurred
                className="flex flex-col items-center border-none w-full"
              >
                <Image
                  removeWrapper
                  alt="Card example background"
                  className="object-cover "
                  fallbackSrc={fallbackPfp}
                  src={pfpUrl || fallbackPfp}
                />
                <CardFooter className="flex justify-center w-full">
                  <Button
                    about="Upload new Profile Picture"
                    color="primary"
                    variant="light"
                    onPress={() => {
                      setIsModalOpen(isModalOpen ? false : true);
                    }}
                  >
                    Upload New
                  </Button>
                  <Modal
                    isOpen={isModalOpen}
                    size="lg"
                    onClose={() => setIsModalOpen(false)}
                  >
                    <ModalContent>
                      <ModalBody>
                        <ImageCropper callback={updateUi} />
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </CardFooter>
              </Card>
            </div>
            <div className="col-span-4">
              <div className="gap-4">
                <p>Credentials</p>
                <Input
                  className="col-span-2 mb-6"
                  label="Email"
                  type="email"
                  value={user.email ?? ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    className="mb-6"
                    label="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    className="mb-6"
                    label="Confirm Password"
                    type="password"
                    onChange={(e) => {
                      if (e.target.value === password) setPasswordMatch(true);
                      else setPasswordMatch(false);
                    }}
                  />
                </div>
                {passwordMatch ? null : (
                  <p className="text-red-500">Passwords do not match</p>
                )}
                <p className="m-2">Personal Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    className="mb-6"
                    label="First Name"
                    type="text"
                    value={user.first_name ?? ""}
                    onChange={(e) =>
                      setUser({ ...user, first_name: e.target.value })
                    }
                  />
                  <Input
                    className="mb-6"
                    label="Last Name"
                    type="text"
                    value={user.last_name ?? ""}
                    onChange={(e) =>
                      setUser({ ...user, last_name: e.target.value })
                    }
                  />
                </div>
                <p className="m-2">International Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <Select className="mb-6" label="Nationality">
                    {Object.values(countries).map((country) => (
                      <SelectItem
                        key={country}
                        onPress={
                          country === "Other"
                            ? () => setOtherNationalityState(true)
                            : () => {
                                setUser({ ...user, country });
                                console.log("User:", user);
                                setOtherNationalityState(false);
                              }
                        }
                      >
                        {country}
                      </SelectItem>
                    ))}
                  </Select>
                  {otherNationalityState ? (
                    <Input
                      className="mb-6"
                      label="Other Nationality"
                      type="text"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUser({ ...user, country: e.target.value })
                      }
                    />
                  ) : null}
                  <Select className="mb-6" label="Preferred Language">
                    {Object.values(languages).map((language) => (
                      <SelectItem
                        key={language}
                        onPress={() => {
                          setUser({ ...user, preferred_language: language });
                        }}
                      >
                        {language}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <p className="m-2">Contact Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Local Phone Number"
                    labelPlacement="inside"
                    placeholder="+XXX XXX XXX XXX"
                    type="phone"
                    value={user.phone_number ?? ""}
                    onChange={(e) =>
                      setUser({ ...user, phone_number: e.target.value })
                    }
                  />
                  <Input
                    label="PT Phone Number"
                    labelPlacement="inside"
                    placeholder="+351 XXX XXX XXX"
                    type="text"
                    value={user.pt_phone_number ?? ""}
                    onChange={(e) =>
                      setUser({ ...user, pt_phone_number: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              color="primary"
              disabled={loading || !passwordMatch}
              type="submit"
              variant="solid"
            >
              Register
            </Button>

            <Button color="danger" onPress={() => router.push("/auth/login")}>
              Cancel
            </Button>

            <Button
              onPress={() => {
                console.log("User:", user);
                console.log("Password:", password);
              }}
            >
              Debug
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
