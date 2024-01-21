import { Todo } from "@models/todo.model";

export type TodoState = {
  todo: Todo[];
  isLoading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
};

export const initialState: TodoState = {
  todo: [],
  isLoading: false,
  addLoading: false,
  updateLoading: false
};
