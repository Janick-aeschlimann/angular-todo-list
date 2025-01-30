import { Component, OnInit } from '@angular/core';

import { Todo } from '../shared/todo';
import { TodoListService } from '../shared/todo-list.service';
import { NgStyle, DecimalPipe, AsyncPipe } from '@angular/common';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [NgStyle, DecimalPipe, AsyncPipe],
})
export class DashboardComponent implements OnInit {
  constructor(public todoListService: TodoListService) {}

  ngOnInit(): void {}

  getTodoPercentage(): Observable<number> {
    return this.todoListService.todos.pipe(
      map((todos) => {
        if (todos.length) {
          return (
            (todos.filter((todo) => !todo.doneDate).length / todos.length) * 100
          );
        } else {
          return 0;
        }
      })
    );
  }

  getDonePercentage(): Observable<number> {
    return this.todoListService.todos.pipe(
      map((todos) => {
        if (todos.length) {
          return (
            (todos.filter((todo) => todo.doneDate).length / todos.length) * 100
          );
        } else {
          return 0;
        }
      })
    );
  }
}
