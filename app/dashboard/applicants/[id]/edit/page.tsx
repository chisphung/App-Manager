import { fetchApplicantsPages, fetchApplicantById, fetchInvoiceById } from '@/app/lib/data'
import Breadcrumbs from '@/app/ui/applicants/breadcrumbs'
import Form from '@/app/ui/applicants/edit-form'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { updateApplicant } from '@/app/lib/actions'

export const metadata: Metadata = {
  title: 'Edit Applicant',
}

export default async function Page({ params }: { params: { id: string } }) {
  const temp_params = await params;
  const id = temp_params.id;
  // const applicants = await fetchApplicantsPages();
  const applicant = await fetchApplicantById(id);

  if (!applicant) notFound()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Applicants', href: '/dashboard/applicants' },
          {
            label: 'Edit Applicant',
            href: `/dashboard/applicants/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form applicant={applicant}/>
    </main>
  )
}
