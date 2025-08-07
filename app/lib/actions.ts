// app/lib/actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AppType } from './definitions'; // Adjust the import path as necessary
import { UpdateApp } from '../ui/applicants/buttons';
const BASE_API = 'http://localhost:8000';

const appSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  github: z.string().url('Invalid GitHub URL'),
  status: z.enum(['running', 'stopped']),
  description: z.string().optional(),
  image_url: z.string().url('Invalid image URL'), // Changed to image_url
});

export async function createApp(formData: FormData): Promise<void> {
try {
    const app: AppType = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      github: formData.get('github') as string,
      image_url: formData.get('image_url') as string,
      status: formData.get('status') as string,
      description: formData.get('description') as string,
    };

    // Create FormData object to match backend expectations
    const formDataToSend = new FormData();
    formDataToSend.append('name', app.name);
    formDataToSend.append('github', app.github);
    formDataToSend.append('image_url', app.image_url);
    formDataToSend.append('status', app.status);
    if (app.description) {
      formDataToSend.append('description', app.description);
    }

    // Send POST request to backend
    const res = await fetch(`${BASE_API}/create_application`, {
      method: 'POST',
      body: formDataToSend,
    });

    // Check response
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Failed to create application');
    }
    } catch (error) {
    // Handle Zod or API errors
    console.error('Error creating application:', error);
    throw new Error('Failed to create application');
  }
    // Revalidate and redirect
    revalidatePath('/dashboard/');
    redirect('/dashboard/');

}

export async function fetchApps(): Promise<AppType[]> {
  const res = await fetch(`${BASE_API}/applications`);
  // if (!res.ok) {
  //   throw new Error('Failed to fetch applications');
  // }
  return res.json();
}


  // Handler to toggle an app's status (Run/Stop)
export const handleToggleStatus = async (appId: string) => {
  const app = await fetch(`${BASE_API}/applications/${appId}`).then(res => res.json());
  if (!app) {
    console.error(`App with ID ${appId} not found.`);
    return;
  }
  const newStatus = app.status === 'running' ? 'stopped' : 'running';
  const res = await fetch(`${BASE_API}/toggle_application_status/${appId}`, {
    method: 'POST',
  });
  if (res.ok) {
    app.status = newStatus; // Update the app status locally
    revalidatePath('/dashboard/'); // Revalidate the path to update the UI
    return app.status;

  } else {
    console.error(`Failed to toggle status for app with ID ${appId}`);
  }
};

  // Handler to edit an app
export async function updateApp(id: string, formData: FormData) {
  const { name, github, status, description, image_url } = appSchema.parse({
    id, 
    github: formData.get('github'),
    image_url: formData.get('image_url'),    
    name: formData.get('name'),
    status: formData.get('status'),
    description: formData.get('description'),
  });
  const res = await fetch(`${BASE_API}/update_application/${id}`, {
    method: 'POST',
    body: new URLSearchParams({
      name,
      github,
      status,
      description: description ?? '',
      image_url,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (res.ok) {
    revalidatePath('/dashboard/');
    redirect('/dashboard/');
  }
}

  // Handler to delete an app
export const handleDeleteApp = async (appId: string) => {
    const app = await fetch(`${BASE_API}/applications/${appId}`).then(res => res.json());
    if (!app) {
      console.error(`App with ID ${appId} not found.`);
      return;
    }
    const res = await fetch(`${BASE_API}/delete_application/${appId}`, {
      method: 'DELETE',
    });
  };


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
