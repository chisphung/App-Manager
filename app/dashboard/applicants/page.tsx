import { fetchAppById, fetchApps } from '@/app/lib/data'
import { lusitana } from '@/app/ui/fonts'
import { CreateApp } from '@/app/ui/applicants/buttons'
import Pagination from '@/app/ui/applicants/pagination'
import InvoicesTable from '@/app/ui/applicants/table'
import Search from '@/app/ui/search'
import { InvoicesTableSkeleton } from '@/app/ui/skeletons'
import { Suspense } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Applicants',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
  }
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;
  const totalPages = await fetchApps();

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className={`${lusitana.className} text-2xl`}>Applications</h1>
      </div>
      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <Search placeholder='Search applications...' />
        <CreateApp />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <InvoicesTable/>
      </Suspense>
      {/* <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  )
}
