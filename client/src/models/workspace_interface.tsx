export interface Team {
  id: string;
  name: string;
  color: string;
  avatar: null | string;
  members: Array<{
    user: {
      id: number;
      username: string;
      email: string;
      color: string;
      profilePicture: null | string;
      initials: string;
      role: number;
      custom_role: null | string;
      last_active: string;
      date_joined: string;
      date_invited: string;
    };
    invited_by: {
      id: number;
      username: string;
      color: string;
      email: string;
      initials: string;
      profilePicture: null | string;
    };
  }>;
}

export interface User {
  id: string;
  username: string;
  color: null | string;
  profilePicture: null | string;
  initials: string;
}

export interface Status {
  status: string;
  type: string;
  orderindex: number;
  color: string;
}

export interface Features {
  due_dates: {
    enabled: boolean;
    start_date: boolean;
    remap_due_dates: boolean;
    remap_closed_due_date: boolean;
  };
  time_tracking: {
    enabled: boolean;
  };
  tags: {
    enabled: boolean;
  };
  time_estimates: {
    enabled: boolean;
  };
  checklists: {
    enabled: boolean;
  };
  custom_fields: {
    enabled: boolean;
  };
  remap_dependencies: {
    enabled: boolean;
  };
  dependency_warning: {
    enabled: boolean;
  };
  portfolios: {
    enabled: boolean;
  };
}

export interface Member {
  user: User;
}

export interface Space {
  [x: string]: any;
  id: string;
  name: string;
  private: boolean;
  color: null | string;
  avatar: null | string;
  admin_can_manage: boolean;
  archived: boolean;
  members: Member[];
  statuses: Status[];
  multiple_assignees: boolean;
  features: Features;
}

export interface Folder {
  id: string;
  name: string;
  orderindex: number;
  override_statuses: boolean;
  hidden: boolean;
  space: Space;
  task_count: string;
  lists: any[]; // Assuming the 'lists' property can contain an array of any type
}

export interface Priority {
  priority: string;
  color: string;
}

export interface List {
  id: string;
  name: string;
  orderindex: number;
  content: string;
  status: Status;
  priority: Priority;
  assignee: null | any; // Replace 'any' with the actual type for assignee
  task_count: null | string;
  due_date: string;
  start_date: null | string;
  folder: Folder;
  space: Space;
  archived: boolean;
  override_statuses: boolean;
  permission_level: string;
}
