import { inject, Injectable } from '@angular/core';
import { from, map, of, Subscription, tap } from 'rxjs';
import { Todo } from './todo';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  getDocs,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  public todos: Todo[] = [];

  private userUid = '';
  private todoSubscription: Subscription = Subscription.EMPTY;
  private firestore = inject(Firestore);
  private afAuth = inject(AngularFireAuth);

  constructor() {
    this.afAuth.authState.subscribe((state) => {
      if (state?.uid) {
        this.userUid = state.uid;

        const itemCollection = collection(this.firestore, 'todos');
        const refq = query(
          itemCollection,
          where('userUid', '==', this.userUid)
        );
        onSnapshot(refq, (snapshot) => {
          const preds = from(getDocs(refq)).pipe(
            tap((docs) => {
              this.todos = docs.docs
                .map((doc) => {
                  doc.data();
                  return {
                    id: doc.id,
                    ...(doc.data() as Object),
                  } as Todo;
                })
                .sort((a, b) => {
                  return a.dueDate > b.dueDate ? 1 : -1;
                });
            })
          );
          this.todoSubscription.unsubscribe();
          this.todoSubscription = preds.subscribe();
        });
      } else {
        if (this.todoSubscription) {
          this.todoSubscription.unsubscribe();
        }

        this.userUid = '';
        this.todos = [];
      }
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
