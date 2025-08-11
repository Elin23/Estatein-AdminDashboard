import React from "react"
import { Switch } from "@headlessui/react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"

interface Testimonial {
  id: string
  clientImage: string
  location: string
  name: string
  rate: number
  review: string
  show: boolean
  subject: string
}

interface TestimonialCardProps {
  testimonial: Testimonial
  onToggleShow: (id: string, show: boolean) => void
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  onToggleShow,
}) => {
  const role = useSelector((state: RootState) => state.auth.role) || '';
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-10">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {testimonial.subject}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {testimonial.location}
          </p>
        </div>

        {(role === "admin") && (<div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Visible
          </span>
          <Switch
            checked={testimonial.show}
            onChange={(val) => onToggleShow(testimonial.id, val)}
            className={`${
              testimonial.show ? "bg-green-600" : "bg-gray-400"
            } relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span
              className={`${
                testimonial.show ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform bg-white rounded-full transition`}
            />
          </Switch>
        </div>)}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <img
          src={testimonial.clientImage}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            {testimonial.name}
          </h4>
          <p className="text-yellow-500">
            {"★".repeat(testimonial.rate) + "☆".repeat(5 - testimonial.rate)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {testimonial.review}
      </p>
    </div>
  )
}

export default TestimonialCard
