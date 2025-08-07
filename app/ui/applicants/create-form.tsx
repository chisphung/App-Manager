import { AppType } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  LinkIcon,
  PhotoIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createApp } from '@/app/lib/actions';
import { v4 as uuidv4 } from 'uuid'; // For generating ID

// Make applications prop optional
export default function Form({ applications }: { applications?: AppType }) {
  return (
    <form action={createApp} className="space-y-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Applicant Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={applications?.name || ''}
              placeholder="Enter applicant name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/* GitHub Link */}
        <div className="mb-4">
          <label htmlFor="github" className="mb-2 block text-sm font-medium">
            GitHub Link
          </label>
          <div className="relative">
            <input
              id="github"
              name="github"
              type="url"
              defaultValue={applications?.github || ''}
              placeholder="Enter GitHub link"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Image URL
          </label>
          <div className="relative">
            <input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={applications?.image_url || 'https://placehold.co/28x28/6366f1/ffffff?text=Profile'}
              placeholder="Enter image URL"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="status"
                name="status"
                type="text"
                defaultValue={applications?.status || 'pending'}
                placeholder="Enter status"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <CheckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative">
            <input
              id="description"
              name="description"
              type="text"
              defaultValue={applications?.description || ''}
              placeholder="Enter description"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
        <Button type="submit">Create Application</Button>
      </div>
    </form>
  );
}