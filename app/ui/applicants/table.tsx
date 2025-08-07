import Image from 'next/image';
import { UpdateApp, DeleteApp } from '@/app/ui/applicants/buttons';
import InvoiceStatus from '@/app/ui/applicants/status';
import { fetchApps } from '@/app/lib/data';
import { AppType } from '@/app/lib/definitions';

export default async function ApplicationsTable() {
  const applications = await fetchApps();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {applications?.map((application: AppType) => (
              <div
                key={application.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <Image
                        src={application.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${application.name}'s profile picture`}
                      />
                      <p>{application.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{application.github}</p>
                  </div>
                  <InvoiceStatus status={application.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm">{application.description}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateApp id={application.id} />
                    <DeleteApp id={application.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop View */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Applicant Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  GitHub
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {applications?.map((application: AppType) => (
                <tr
                  key={application.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={application.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${application.name}'s profile picture`}
                      />
                      <p>{application.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {application.github}
                  </td>
                  <td className="px-3 py-3">
                    {application.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={application.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateApp id={application.id} />
                      <DeleteApp id={application.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}