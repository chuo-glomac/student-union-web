"use client";

import { CustomFooter, CustomHeader } from "@/components/parts";
import { getLabels } from "@/utils/labels";
import { useEffect, useState } from "react";
import PostComp, { PostProps } from "@/components/post";

const example_data: PostProps = {
  member_id: 1,
  post: {
    images: [],
    text: "example text comes here.",
  },
  info: {
    like_count: 0,
    like_usernames: [],
    comment_count: 10,
    share_count: 1,
  },
};

export default function Post({ params }: { params: Promise<{ lang: string }> }) {
  const [labels, setLabels] = useState<any | null>(null);

  useEffect(() => {
    const fetchLabels = async (loadParams: any) => {
      const { lang } = await loadParams;
      console.log(lang);

      const localizedLabels = getLabels(lang);
      setLabels(localizedLabels);
    };

    fetchLabels(params);
  }, [params]);

  if (!labels) {
    return <div>Loading...</div>; // Render a loading state until labels are ready
  }

  return (
    <div>
      <CustomHeader labels={labels} currentPage="post" />
      <main className="container mx-auto my-8">
        <section className="create-post mb-6">
          <div className="bg-white p-4 rounded shadow">
            <textarea
              placeholder="What's on your mind?"
              className="w-full border p-2 rounded mb-2"
            ></textarea>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Post
            </button>
          </div>
        </section>

        <section className="feed space-y-6">
          <PostComp postData={example_data} />
        </section>
      </main>

      <CustomFooter labels={labels} />
    </div>
  );
}
