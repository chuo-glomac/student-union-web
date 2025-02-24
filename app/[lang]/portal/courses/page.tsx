import { CourseCard } from '@/components/course-card'
import Link from 'next/link';

export default function Courses() {
  const courses = [
    { id: 1, universityId: 1, name: 'Introduction to Computer Science', code: 'CS101', instructor: 'Dr. Smith', rating: 4.5 },
    { id: 2, universityId: 1, name: 'Data Structures and Algorithms', code: 'CS201', instructor: 'Prof. Johnson', rating: 4.2 },
    { id: 3, universityId: 1, name: 'Database Management Systems', code: 'CS301', instructor: 'Dr. Davis', rating: 4.7 },
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <h2 className="text-2xl font-bold mb-6">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <Link href={`courses/${course.id}`} key={course.id} className="block">
            <CourseCard course={course} />
          </Link>
        ))}
      </div>
    </div>
  )
}