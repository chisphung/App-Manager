import { UpdateApplicant, DeleteApplicant } from '@/app/ui/applicants/buttons';
import InvoiceStatus from '@/app/ui/applicants/status';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchApplicantsPages } from '@/app/lib/data';
import { Applicant } from '@/app/lib/definitions';
export default async function InvoicesTable() {
  const applicants = await fetchApplicantsPages();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {applicants?.map((applicant: Applicant) => (
              <div
                key={applicant.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{applicant.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{applicant.email}</p>
                  </div>
                  <InvoiceStatus status={applicant.contact_no} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {applicant.email}
                    </p>
                    <p>{applicant.experience}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateApplicant id={applicant.id} />
                    <DeleteApplicant id={applicant.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Aplicant Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Contact No
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Day of Birth
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Education
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Experience
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Skills
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {applicants?.map((applicant: Applicant) => (
                <tr
                  key={applicant.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {/* <Image
                        src={applicant.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${applicant.name}'s profile picture`}
                      /> */}
                      <p>{applicant.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {applicant.contact_no}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {applicant.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(applicant.date_of_birth)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {applicant.education}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {applicant.experience}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {applicant.skills}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateApplicant id={applicant.id} />
                      <DeleteApplicant id={applicant.id} />
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
