import {
 AppType,
 AppCardProps,
 AppTable
} from './definitions';
import { formatCurrency } from './utils';

const BASE_URL = 'http://localhost:8000';

export async function fetchApps() {
  try {
    const res = await fetch(`${BASE_URL}/applications`);
    if (!res.ok) throw new Error('Failed to fetch applications.');
    const data: AppType[] = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export async function fetchAppById(id: string): Promise<AppType | null> {
  try {
    const res = await fetch(`${BASE_URL}/applications/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch application with ID ${id}.`);
    const data: AppType = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    return null;
  }
}
