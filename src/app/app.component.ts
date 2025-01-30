import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterLink, NgIf, RouterOutlet, AsyncPipe]
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
