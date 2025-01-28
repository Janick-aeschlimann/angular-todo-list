import { TodoListService } from './../shared/todo-list.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../shared/firestore.service';

import { formatDate, NgFor, NgStyle, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoFilterPipePipe } from '../pipes/todo-filter-pipe.pipe';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  imports: [
    FormsModule,
    NgFor,
    NgStyle,
    DatePipe,
    TodoFilterPipePipe,
  ],
  standalone: true
})
export class TodoListComponent implements OnInit {
  public todoDescription = '';
  public todoDueDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  public showDone = false;

  constructor(public todoListService: TodoListService) {}

  ngOnInit(): void {}

  public addTodo(): void {
    if (this.todoDescription && this.todoDueDate) {
      this.todoListService.addTodo(
        this.todoDescription,
        new Date(this.todoDueDate)
      );
      this.todoDescription = '';
      this.todoDueDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    }
  }
}
