"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export type PostProps = {
  member_id: number;
  post: {
    images: string[];
    text: string;
  };
  info: {
    like_count: number;
    like_usernames?: string[];
    comment_count: number;
    share_count: number;
  };
};

const PostComp = ({ postData }: { postData: PostProps }) => {
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("Profiles")
          .select("*")
          .eq("member_id", postData.member_id)
          .single();
        // console.log(data);
        // console.log(error);

        if (error) {
          // Handle error
        } else {
          // Handle success
        }

        if (error) throw error;
        setProfile(data);
      } catch (err: any) {
        console.log("Error data fetch:", err);
        setError(err.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [postData.member_id]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="post bg-white p-4 rounded shadow">
      <div className="user-info flex items-center mb-4">
        <img
          src={profile?.avatar_url || "/user-avatar.png"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <span className="username font-bold">
          {profile?.username || "Unknown User"}
        </span>
      </div>
      <p className="post-content mb-4">{postData.post.text}</p>
      <div className="post-actions flex space-x-4">
        <button className="text-blue-500 hover:underline">Like</button>
        <button className="text-blue-500 hover:underline">Comment</button>
        <button className="text-blue-500 hover:underline">Share</button>
      </div>
    </div>
  );
};

export default PostComp;
