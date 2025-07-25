'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const BASE_API = 'http://localhost:8000'; // change to your deployed URL when needed

// ---------------- CREATE ----------------
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const res = await fetch(`${BASE_API}/invoices/create`, {
    method: 'POST',
    body: new URLSearchParams({
      customerId,
      amount: amount.toString(),
      status,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  // if (!res.ok) {
  //   throw new Error('Failed to create invoice');
  // }
  // 303 code
    // if (res.status !== 303) {
    //   const error = await res.json();
    //   throw new Error(error.message || 'Failed to create invoice');
    // }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// ---------------- UPDATE ----------------
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const res = await fetch(`${BASE_API}/invoices/update/${id}`, {
    method: 'POST',
    body: new URLSearchParams({
      customerId,
      amount: amount.toString(),
      status,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to update invoice');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// ---------------- DELETE ----------------
export async function deleteInvoice(id: string) {
  const res = await fetch(`${BASE_API}/invoices/delete/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete invoice');
  }

  revalidatePath('/dashboard/invoices');
}

// ---------------- AUTH ----------------
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
