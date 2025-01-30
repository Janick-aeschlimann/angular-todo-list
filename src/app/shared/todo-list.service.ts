import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  from,
  map,
  Observable,
  Subscription,
  switchMap,
  take,
  takeUntil,
  tap,
  toArray,
} from 'rxjs';
import { Todo } from './todo';
import {
  addDoc,
  collection,
  Firestore,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  collectionSnapshots,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  private userUid = '';
  private firestore = inject(Firestore);
  private afAuth = inject(AngularFireAuth);

  private subject = new BehaviorSubject<Array<Todo>>([]);
  public todos: Observable<Array<Todo>> = this.subject.asObservable();

  constructor() {
    this.afAuth.authState
      .pipe(
        filter((state: any) => {
          if (state === null) {
            // Reset local variables if user is not logged in
            this.userUid = '';
            this.subject.next([]);
            // Early return, skips return true below if called
            return false;
          }
          return true;
        }),
        switchMap((state) => {
          this.userUid = state.uid;
          const itemCollection = collection(this.firestore, 'todos');
          const refq = query(
            itemCollection,
            where('userUid', '==', this.userUid)
          );
          return collectionSnapshots(refq).pipe(
            // Force listeners to unsubscribe when user is logged out. Otherwise this observable will keep firing even when logged out.
            takeUntil(
              this.afAuth.authState.pipe(filter((state: any) => state === null))
            ),
            filter((snapshots) => {
              return (
                snapshots.filter((snapshot) =>
                  Boolean(snapshot.metadata.hasPendingWrites)
                ).length === 0
              );
            })
          );
        }),
        distinctUntilChanged()
      )
      .subscribe((data) => {
        this.subject.next(
          data
            .map((doc) => {
              doc.data();
              return {
                id: doc.id,
                ...(doc.data() as Object),
              } as Todo;
            })
            .sort((a, b) => {
              return a.dueDate > b.dueDate ? 1 : -1;
            })
        );
      });
  }

  ngOnInit(): void {}

  public addTodo(description: string, dueDate: Date): void {
    const itemCollection = collection(this.firestore, 'todos');
    addDoc(itemCollection, {
      description: description,
      dueDate: dueDate,
      userUid: this.userUid,
    });
  }

  public deleteTodoById(id: string): void {
    deleteDoc(doc(this.firestore, 'todos/' + id));
  }

  public updateTodoById(todo: Todo): void {
    updateDoc(doc(this.firestore, 'todos/' + todo.id), {
      description: todo.description,
      dueDate: todo.dueDate,
    });
  }

  public toggleDoneStateById(todo: Todo): void {
    updateDoc(doc(this.firestore, 'todos/' + todo.id), {
      doneDate: todo.doneDate ? null : new Date(),
    });
  }
}
