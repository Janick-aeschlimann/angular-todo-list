import { Pipe, PipeTransform } from '@angular/core';

import { Todo } from '../shared/todo';

@Pipe({standalone: true, name: 'todoFilterPipe'})
export class TodoFilterPipePipe implements PipeTransform {
  transform(todos: Todo[], done: boolean | null): Todo[] {
    return todos.filter(
      (t) =>
        done === null ||
        done === undefined ||
        (done === true && t.doneDate) ||
        (done === false && !t.doneDate)
    );
  }
}
