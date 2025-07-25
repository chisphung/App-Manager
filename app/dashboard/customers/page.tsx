export default function Customer({ status }: { status: string }) {
  return (
    <div>
      <h2>Customer</h2>
      <p>{status}</p>
    </div>
  );
}
