import { Applicant } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createApplicant } from '@/app/lib/actions';

export default function Form({ applicant }: { applicant: Applicant }) {
  return (
    <form action={createApplicant} className="space-y-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="applicant" className="mb-2 block text-sm font-medium">
            Applicant Name
          </label>
          <div className="relative">
            <input
              id="applicant"
              name="name"
              type="text"
              defaultValue={applicant.name}
              placeholder="Enter applicant name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
        </div>

        {/* Contact No */}
        <div className="mb-4">
          <label htmlFor="contact_no" className="mb-2 block text-sm font-medium">
            Contact No
          </label>
          <div className="relative">
            <input
              id="contact_no"
              name="contact_no"
              type="text"
              defaultValue={applicant.contact_no}
              placeholder="Enter contact number"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={applicant.email}
                placeholder="Enter email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Date of Birth */}
        <div className="mb-4">
          <label htmlFor="date_of_birth" className="mb-2 block text-sm font-medium">
            Date of Birth
          </label>
          <div className="relative">
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              defaultValue={applicant.date_of_birth}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        {/* Education */}
        <div className="mb-4">
          <label htmlFor="education" className="mb-2 block text-sm font-medium">
            Education
          </label>
          <div className="relative">
            <input
              id="education"
              name="education"
              type="text"
              defaultValue={applicant.education}
              placeholder="Enter education details"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        {/* Experience */}
        <div className="mb-4">
          <label htmlFor="experience" className="mb-2 block text-sm font-medium">
            Experience
          </label>
          <div className="relative">
            <input
              id="experience"
              name="experience"
              type="text"
              defaultValue={applicant.experience}
              placeholder="Enter experience details"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        {/* Skills */}
        <div className="mb-4">
          <label htmlFor="skills" className="mb-2 block text-sm font-medium">
            Skills
          </label>
          <div className="relative">
            <input
              id="skills"
              name="skills"
              type="text"
              defaultValue={applicant.skills}
              placeholder="Enter skills"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Applicant</Button>
      </div>
    </form>
  );
}
