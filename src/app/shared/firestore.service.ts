import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription } from 'rxjs';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  userUid = 'EzEZsLs9v8b0ocxoEwMtwfSw1AV2';
  authState = this.afAuth.authState;
  todoSubscription: any = Subscription.EMPTY;
  todos: any[] = [];
  data: any;

  constructor(
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe((state) => {
      if (state?.uid) {
        this.userUid = state.uid;

        this.firestore
          .collection('todo', (ref) => {
            return ref.where('userUid', '==', this.userUid);
          })
          .snapshotChanges()
          .subscribe((data) => {
            this.todos = data
              .map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as Object),
                } as Todo;
              })
              .sort((a, b) => {
                return a.dueDate > b.dueDate ? 1 : -1;
              });
          });
      }
    });
  }

  test: any = () => {
    return (this.data = this.firestore.collection('todo', (ref) => {
      return ref.where('userUid', '==', this.userUid);
    })).snapshotChanges();
  };
}
