import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Todo } from '@models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(
    private httpClient: HttpClient
  ) { }

  loadTodoItems(params: { _start: number, _limit: number; }) {
    return this.httpClient.get<Todo[]>(this.apiUrl, {
      params
    });
  }

  addToDoItem(todo: Omit<Todo, 'id'>) {
    return this.httpClient.post<Todo>(this.apiUrl, todo);
  }

  updateToDoItem(id: number, todo: Todo) {
    return this.httpClient.patch<Todo>(`${this.apiUrl}/${id}`, todo);
  }
}
