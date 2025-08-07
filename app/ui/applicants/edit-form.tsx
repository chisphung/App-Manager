'use client'

import { updateApp } from '@/app/lib/actions'
import { AppType } from '@/app/lib/definitions'
import { formatDateToLocal } from '@/app/lib/utils'
import { Button } from '@/app/ui/button'
import {
  PhoneIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useFormState } from 'react-dom'

export default function EditApplicationForm({
  application,
  // applicants
}: {
  application: AppType | undefined
  // applicants: Applicant[]
}) {
  type State = {
    message: string | null
    errors: {
      id?: string[]
      name?: string[]
      github?: string[]
      image_url?: string[]
      status?: string[]
      description?: string[]
    }
  }

  const initialState: State = { message: null, errors: {} }

  // Only bind if applicant.id is defined, otherwise throw or return null
  if (!application?.id) {
    return (
      <div className="p-4 text-red-500">
        Error: Applicant ID is missing. Cannot edit applicant.
      </div>
    )
  }

  const updateAppHandler = async (state: State, formData: FormData): Promise<State> => {
    const result = await updateApp(String(application.id), formData)
    return result ?? state
  }
  const [, dispatch] = useFormState<State, FormData>(updateAppHandler, initialState)
  return (
    <form action={dispatch}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        {/* Application Name */}
        <div className='mb-4'>
          <label htmlFor='application' className='mb-2 block text-sm font-medium'>
            Application Name
          </label>
          <div className='relative'>
            <input
              id='application'
              name='name'
              type='text'
              defaultValue={application?.name}
              placeholder='Enter application name'
              className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
            />
            <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
          </div>
        </div>
        {/* Github link */}
        <div className='mb-4'>
          <label htmlFor='github' className='mb-2 block text-sm font-medium'>
            Github Link
          </label>
          <div className='relative'>
            <input
              id='contact_no'
              name='github'
              type='text'
              defaultValue={application?.github}
              placeholder='Enter GitHub link'
              className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
            />
            <PhoneIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
          </div>
        </div>
           {/* Image URL */}
      <div className='mb-4'>
        <label htmlFor='image_url' className='mb-2 block text-sm font-medium'>
          Image URL
        </label>
        <div className='relative mt-2 rounded-md'>
          <div className='relative'>
            <input
              id='image_url'
              name='image_url'
              type='text'
              defaultValue={application?.image_url}
              placeholder='Enter image URL'
              className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
            />
            <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
          </div>
        </div>
      </div>
      {/* Status */}
      <div className='mb-4'>
        <label htmlFor='status' className='mb-2 block text-sm font-medium'>
          Status
        </label>
        <div className='relative'>
          <input
            id='status'
            name='status'
            type='text'
            defaultValue={application?.status}
            placeholder='Enter status'
            className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
          />
          <ClockIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
        </div>
      </div>
      {/* Description */}
      <div className='mb-4'>
        <label htmlFor='description' className='mb-2 block text-sm font-medium'>
          Description
        </label>
        <div className='relative'>
          <input
            id='description'
            name='description'
            type='text'
            defaultValue={application?.description}
            placeholder='Enter description'
            className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
          />
          <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
        </div>
      </div>
      </div>
   
      <div className='mt-6 flex justify-end gap-4'>
        <Link
          href='/dashboard/invoices'
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancel
        </Link>
        <Button
          type='submit'
          className={`${application === undefined && 'bg-gray-400'}`}
          disabled={application === undefined}
        >
          Edit Applicant
        </Button>
      </div>
    </form>
  )
}
