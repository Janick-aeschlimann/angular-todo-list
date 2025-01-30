import { Observable, map } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

import { Todo } from '../shared/todo';

@Pipe({ standalone: true, name: 'todoFilterPipe' })
export class TodoFilterPipePipe implements PipeTransform {
  transform(
    todos: Observable<Todo[]>,
    done: boolean | null
  ): Observable<Todo[]> {
    return todos.pipe(
      map((todos) =>
        todos.filter(
          (t) =>
            done === null ||
            done === undefined ||
            (done === true && t.doneDate) ||
            (done === false && !t.doneDate)
        )
      )
    );
  }
}
