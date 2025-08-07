import { Card } from '@/app/ui/dashboard/cards';
import AppManagement from '@/app/ui/dashboard/revenue-chart';
import LatestApplicant from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchApps } from '@/app/lib/data';
 
export default async function Page() {
  // const revenue = await fetchRevenue();
  const latestApplicants = await fetchApps();
  // const {
  //   numberOfCustomers, 
  //   numberOfInvoices, 
  //   totalPaidInvoices, 
  //   totalPendingInvoices 
  // } = await fetchCardData();
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> 
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> 
      </div> */}
      <div>
        <AppManagement />
      </div>
    </main>
  );
}