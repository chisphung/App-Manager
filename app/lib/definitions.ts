// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type AppType = {
  id: string;
  name: string;
  github: string;
  status: string;
  description: string;
  image_url: string;
};

export type AppCardProps = {
  app: AppType;
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export type AppTable = {
  id: string;
  name: string;
  github: string;
  image_url: string;
  status: 'running' | 'stopped';
};
