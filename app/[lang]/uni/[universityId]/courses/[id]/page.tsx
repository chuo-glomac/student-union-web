import { CourseCard } from "@/components/course-card";
import Link from "next/link";
// import { useParams } from "next/navigation";

export default function Courses({
    params,
  }: {
    params: { universityId: string; id: string }
  }) {

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <h2 className="text-2xl font-bold mb-6">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        Params: {params.universityId} - {params.id}
      </div>
    </div>
  );
}
