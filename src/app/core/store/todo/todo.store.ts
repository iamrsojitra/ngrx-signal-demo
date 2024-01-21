import { Injector, computed, inject, runInInjectionContext } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { finalize, tap } from 'rxjs';

import { Todo } from '@models/todo.model';
import { TodoService } from '@services/todo.service';
import { initialState } from '@store/todo/todo.states';

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ todo }) => ({
    totalTodoItems: computed(() => todo().length)
  })),
  withMethods((store, todoService = inject(TodoService), injector = inject(Injector)) => ({
    loadTodo() {
      rxMethod<Todo[]>(() => {
        patchState(store, { isLoading: true });
        return todoService.loadTodoItems({ _start: 0, _limit: 5 }).pipe(
          tap(todo => patchState(store, { todo })),
          finalize(() => patchState(store, { isLoading: false }))
        );
      });
    },
    addTodoItem(newTodo: Omit<Todo, 'id'>) {
      runInInjectionContext(injector, () => {
        rxMethod<Todo>(() => {
          patchState(store, { addLoading: true });
          return todoService.addToDoItem(newTodo).pipe(
            tap((resToDo) => patchState(store, {
              // with api response
              // todo: [...store.todo(), resToDo]

              // without api response
              todo: [...store.todo(), { id: store.totalTodoItems() + 1, ...newTodo }]
            })),
            finalize(() => patchState(store, { addLoading: false }))
          );
        });
      });
    },
    updateTodoItem(id: number, updatedTodo: Todo) {
      runInInjectionContext(injector, () => {
        rxMethod<Todo>(() => {
          patchState(store, { updateLoading: true });
          return todoService.updateToDoItem(id, updatedTodo).pipe(
            tap((resToDo) => patchState(store, {
              // with api response
              // todo: store.todo().map((todo) => todo.id === id ? resToDo : todo)

              // without api response
              todo: store.todo().map((todo) => todo.id === id ? updatedTodo : todo)
            })),
            finalize(() => patchState(store, { updateLoading: false }))
          );
        });
      });
    }
  })),
  withHooks(({ loadTodo }) => ({
    onInit: () => {
      loadTodo();
    }
  }))
);
