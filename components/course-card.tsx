interface Course {
  id: number
  name: string
  code: string
  instructor: string
  rating: number
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg truncate">{course.name}</h3>
      <p className="text-gray-600 mb-2 truncate">{course.instructor}</p>
      <p className="text-gray-600 mb-2 truncate">Course Code: {course.code}</p>
      <div className="flex items-center">
        <span className="text-yellow-500 mr-1">★</span>
        <span>{course.rating.toFixed(1)}</span>
      </div>
    </div>
  )
}

