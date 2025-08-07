'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { handleDeleteApp, handleToggleStatus, createApp, updateApp } from '@/app/lib/actions';
import { redirect } from 'next/navigation';
// import { revalidatePath } from 'next/cache';

export function CreateApp() {
  return (
    <Link
      href="/dashboard/applicants/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Application</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
export async function UpdateApp({ id }: { id: string }) {
  try {
    return (
      <Link
        href={`/dashboard/applicants/${id}/edit/`}
        className="flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-500"
      >
        <PencilIcon className="h-4 w-4" />
        <span className="ml-2">Edit</span>
      </Link>
    );
  } catch (error) {
    console.error('Error updating app:', error);
    throw new Error('Failed to update application');
  }
}

export function DeleteApp({ id }: { id: string }) {
  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this applicant?")) {
      await handleDeleteApp(id); // Make sure this is client-safe
    }
  };

  return (
    <button
      type="submit"
      className="rounded-md border p-2 hover:bg-gray-100"
      onClick={handleDelete}
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}