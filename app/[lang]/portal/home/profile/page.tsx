"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { validateUser } from "@/utils/supabase/auth";
import { generateRandomId } from "@/utils/generateRandomId";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Icon } from "@/components/icons";

export default function Profile() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isFollowing, setIsFollowing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: valiadate_data } = await validateUser();
        if (!valiadate_data) return;
        setUser(valiadate_data);

        const { data: profileData, error } = await supabase
          .from("Profiles")
          .select("*")
          .eq("member_id", valiadate_data.member_id)
          .single();

        if (!profileData) {
          alert("Cannot find profile.");
          redirect("/createProfile");
        }
        console.log(profileData);

        const avatarUrl =
          profileData.avatar_url || "default/default_male01.jpg";
        // console.log('avatarUrl:', avatarUrl)
        const { data: avatarData } = await supabase.storage
          .from("avatars")
          .getPublicUrl(avatarUrl);

        if (!avatarData) {
          setAvatarUrl("");
          alert("Avatar not set.");
        }
        // console.log(avatarData)

        // console.log("Public url:", avatarData);
        setAvatarUrl(avatarData.publicUrl);
        setProfile(profileData);
      } catch (err: any) {
        console.log("Error data fetch:", err);
        setError(err.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [avatarUrl]);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);
    try {
      console.log(profile);
      if (profile?.avatar_url) {
        const { data, error: deleteError } = await supabase.storage
          .from("avatars")
          .remove([profile.avatar_url]);

        console.log("File deleted successfully:", data);

        if (deleteError) {
          console.error("Error deleting previous avatar:", deleteError.message);
          alert("Error deleting the previous avatar.");
          return;
        }
      }

      const resizeImage = async (file: File, size: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          const reader = new FileReader();

          reader.onload = (event) => {
            img.src = event.target?.result as string;
          };

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) return reject("Failed to create canvas context");

            const minSide = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;

            ctx.drawImage(
              img,
              (img.width - minSide) / 2, // Start X (crop center)
              (img.height - minSide) / 2, // Start Y (crop center)
              minSide, // Source width
              minSide, // Source height
              0, // Destination X
              0, // Destination Y
              size, // Destination width
              size // Destination height
            );

            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject("Failed to convert canvas to blob");
              },
              "image/jpeg",
              0.8 // Quality (0.8 = 80%)
            );
          };

          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      };

      const resizedBlob = await resizeImage(file, 360);

      // Step 2: Upload the Processed Image
      const fileExt = "jpg"; // Enforce JPG extension
      const fileName = `public/${Date.now()}-${generateRandomId()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, resizedBlob, {
          contentType: "image/jpeg",
        });

      if (uploadError) {
        alert("Error uploading file.");
        return;
      }

      // Step 3: Update the Profile with the New Avatar URL
      const { error: updateError } = await supabase
        .from("Profiles")
        .update({ avatar_url: uploadData.path })
        .eq("member_id", user?.member_id);

      if (updateError) {
        alert("Error updating profile with avatar URL.");
        return;
      }

      // Update UI with the new avatar URL
      const { data: avatarData } = await supabase.storage
        .from("avatars")
        .getPublicUrl(uploadData.path);

      if (avatarData) {
        setAvatarUrl(avatarData.publicUrl);
      }

      setAvatarLoading(false);
    } catch (error) {
      console.error("Error during image upload:", error);
      alert("Failed to process and upload the image.");
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="">
      <div className="flex flex-col md:flex-row items-center mb-8 px-4 py-8 shadow">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-8">
          {!avatarUrl || avatarLoading ? (
            <div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-8 bg-gray-200"
            ></div>
          ) : (
            <div
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-8 border"
              onClick={handleAvatarClick}
            >
              <div className="w-full h-full">
                <Image
                  src={avatarUrl}
                  alt="Uploaded Image"
                  width={160}
                  height={160}
                  className="border-gray-300 rounded-full"
                  priority
                />
              </div>
              <div className="absolute top-0 w-full h-full rounded-full bg-black opacity-0 hover:opacity-80 transition-opacity duration-200 flex justify-center items-center">
                <Icon
                  name="camera"
                  solid={false}
                  color="white"
                  size="size-12"
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={uploadFile}
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>
        <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold">{profile.display_name}</h1>
          <h1 className="text-lg text-gray-600 mb-2">@{profile.username}</h1>
          <div className="flex justify-center md:justify-start space-x-4 mb-4">
            <span>
              <strong>{profile.count_post}</strong> post{profile.count_post > 0 && 's'}
            </span>
            <span>
              <strong>{profile.count_friend}</strong> friend{profile.count_friend > 0 && 's'}
            </span>
            {/* <span>
              <strong>526</strong> following
            </span> */}
          </div>
          <p className="mb-4 max-w-md">
            {profile.description || (
                <span className="">
                    Add Status
                </span>
            )}
          </p>
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-4 py-2 rounded-md font-semibold ${
              isFollowing
                ? "bg-gray-200 text-gray-800"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {/* {posts.map((post) => (
          <div key={post.id} className="aspect-square relative">
            <Image
              src={post.imageUrl}
              alt={`Post ${post.id}`}
              fill
              className="object-cover"
            />
          </div>
        ))} */}
      </div>
    </div>
  );
}
