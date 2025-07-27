import { fetchApplicantsPages, fetchCustomers } from '@/app/lib/data'
import Breadcrumbs from '@/app/ui/applicants/breadcrumbs'
import Form from '@/app/ui/applicants/create-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create New Invoice',
}

export default async function Page() {
  const applicants = await fetchApplicantsPages()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Applicants', href: '/dashboard/applicants' },
          {
            label: 'Create Applicant',
            href: '/dashboard/applicants/create',
            active: true,
          },
        ]}
      />
      <Form applicant={applicants} />
    </main>
  )
}
