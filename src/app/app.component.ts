import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { Todo } from '@models/todo.model';
import { TodoStore } from '@store/todo/todo.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  todoStore$ = inject(TodoStore);
  newTodo!: string;

  addTodo() {
    if (!this.newTodo) return;
    this.todoStore$.addTodoItem({
      title: this.newTodo,
      userId: 1,
      completed: false
    });
    this.newTodo = '';
  }

  updateTodo(todo: Todo) {
    this.todoStore$.updateTodoItem(todo.id, todo);
  }
}
