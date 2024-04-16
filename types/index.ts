export type User = {
  id: string;
  email: string;
  password?: string | null;
  firstName: string;
  lastName: string;
  todos?: Todo[];
};

export type Todo = {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  createdAt: Date;
    updatedAt: Date;
};

export type TodoWithUser = Todo & {
  userId: string;
};
