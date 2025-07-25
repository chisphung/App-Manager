export default function InvoiceStatus({ status }: { status: string }) {
    return (
        <div>
        <h2>Invoice Status</h2>
        <p>{status}</p>
        </div>
    );
    }