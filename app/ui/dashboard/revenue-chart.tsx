'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Play, Square, Edit, Trash2, Server, Power, PowerOff } from 'lucide-react';
import { AppCardProps, AppType } from 'app/lib/definitions';
import {CreateApp, UpdateApp, DeleteApp} from 'app/ui/applicants/buttons'
import Link from 'next/link';
import { PencilIcon } from 'lucide-react';
// import { UpdateApplicant, DeleteApplicant } from '@/app/ui/applicants/buttons';
import { fetchApps, handleToggleStatus } from 'app/lib/actions';

const AppCard: React.FC<
  Omit<AppCardProps, 'onDelete' | 'onToggleStatus' | 'onEdit'> & { onDelete: () => void; onToggleStatus: () => void; onEdit: string }
> = ({ app, onToggleStatus, onEdit, onDelete }) => {
  const isRunning = app.status === 'running';
  const statusColor = isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  const statusIcon = isRunning ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4 text-gray-500" />;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* App Image and Status Badge */}
      <div className="relative">
        <img
          src={app.image_url}
          alt={`${app.name}`}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Error';
          }}
        />
        <div className={`absolute top-3 right-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          {statusIcon}
          <span className="ml-1.5">{isRunning ? 'Running' : 'Stopped'}</span>
        </div>
      </div>

      {/* App Info */}
      <div className="p-5 flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{app.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{app.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-2">
        <button
          onClick={onToggleStatus}
          className={`flex items-center justify-center px-3 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="ml-2">{isRunning ? 'Stop' : 'Run'}</span>
        </button>
        
        <Link
          href={`/dashboard/applicants/${onEdit}/edit/`}
          className="flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          <PencilIcon className="h-4 w-4" />
          <span className="ml-2">Edit</span>
        </Link>
        <button
          onClick={onDelete}
          className="flex items-center justify-center p-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function AppManagement() {
  const [apps, setApps] = useState<AppType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch apps when the component mounts
  useEffect(() => {
    const loadApps = async () => {
      setIsLoading(true);
      const apps = await fetchApps();
      setApps(apps);
      setIsLoading(false);
    };
    loadApps();
  }, []);

  // Handle edit action
  const handleToggleStatusLocal = async (id: string) => {
    try {
      await handleToggleStatus(id);
      // Refetch apps to update the UI
      const updatedApps = await fetchApps();
      setApps(updatedApps);
    } catch (error: any) {
      console.error('Error toggling app status:', error);
      alert(`Failed to toggle status: ${error.message}`);
    }
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      await DeleteApp({ id });
      // Update the apps state to remove the deleted app
      setApps((prevApps) => prevApps.filter((app) => app.id !== id));
    } catch (error) {
      console.error('Error deleting app:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">App Management</h1>
            <p className="mt-2 text-md text-gray-600">
              Manage, monitor, and control your deployed applications.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <CreateApp />
          </div>
        </div>

        {/* --- App Grid --- */}
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading applications...</p>
            </div>
          ) : apps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {apps.map((app: AppType) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onToggleStatus={() => handleToggleStatusLocal(app.id)}
                  onEdit={app.id}
                  onDelete={() => handleDelete(app.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
              <Server className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new application.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}