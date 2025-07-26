'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  contact_no: z.string().min(1, 'Contact number is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  education: z.string().min(1, 'Education is required'),
  experience: z.string().min(1, 'Experience is required'),
  skills: z.string().optional(),
});

// const CreateInvoice = FormSchema.omit({ id: true, date: true });
// const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateApplicant = FormSchema.omit({ id: true });
const UpdateApplicant = FormSchema.pick({
  id: true,
  name: true,
  email: true,
  contact_no: true,
  date_of_birth: true,
  education: true,
  experience: true,
  skills: true,
});

const BASE_API = 'http://localhost:8000'; // change to your deployed URL when needed

// ---------------- CREATE ----------------
export async function createApplicant(formData: FormData) {
  const { name, email, contact_no, date_of_birth, education, experience, skills } = CreateApplicant.parse({
    name: formData.get('name'),
    contact_no: formData.get('contact_no'),
    email: formData.get('email'),
    date_of_birth: formData.get('date_of_birth'),
    education: formData.get('education'),
    experience: formData.get('experience'),
    skills: formData.get('skills'),
  });

  const res = await fetch(`${BASE_API}/create_applicant`, {
    method: 'POST',
    body: new URLSearchParams({
      name,
      email,
      contact_no,
      date_of_birth,
      education,
      experience,
      skills: skills ?? '',
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

  revalidatePath('/dashboard/applicants');
  redirect('/dashboard/applicants');
}

// ---------------- UPDATE ----------------
export async function updateApplicant(id: string, formData: FormData) {
  const { name, email, contact_no, date_of_birth, education, experience, skills } = UpdateApplicant.parse({
    // id: formData.get('id'),
    name: formData.get('name'),
    contact_no: formData.get('contact_no'),
    email: formData.get('email'),
    date_of_birth: formData.get('date_of_birth'),
    education: formData.get('education'),
    experience: formData.get('experience'),
    skills: formData.get('skills'),
  });
  const res = await fetch(`${BASE_API}/update_applicant/${id}`, {
    method: 'POST',
    body: new URLSearchParams({
      name,
      email,
      contact_no,
      date_of_birth,
      education,
      experience,
      skills: skills ?? '',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  // if (!res.ok) {
  //   throw new Error('Failed to update invoice');
  // }

  revalidatePath('/dashboard/applicants');
  redirect('/dashboard/applicants');
}

// ---------------- DELETE ----------------
export async function deleteApplicant(id: string) {
  const res = await fetch(`${BASE_API}/delete_applicant/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete applicant');
  }

  revalidatePath('/dashboard/applicants');
  redirect('/dashboard/applicants');
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
