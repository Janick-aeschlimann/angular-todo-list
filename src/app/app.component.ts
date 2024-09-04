import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public afAuth: AngularFireAuth, public router: Router) {}

  login(): void {
    this.afAuth.signInWithPopup(new GoogleAuthProvider()).then(() => {
      this.router.navigate(['todo-list']);
    });
  }

  logout(): void {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['']);
    });
  }
}
