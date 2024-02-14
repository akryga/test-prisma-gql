import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersComponent } from "./users/users.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, UsersComponent]
})
export class AppComponent {
  title = 'test-prisma-gql';
}
