import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe,TitleCasePipe } from '@angular/common';
import { User } from '../../../prisma/generated/type-graphql';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgFor, DatePipe, NgIf, TitleCasePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent implements OnInit {
 
  constructor(){
    // this.getData(encodeURI("/graphql"),this.queries.users).then((data) => {
    //   this.users = data.data.users
    // });
  }

  ngOnInit(): void {
    // this.refreshUsers();
  }
  queries = {
    users: { query:"{ users { id  name lastname created nchildren user_email{email} }}" },
    groups: { query:"{groups {  id parent_group_id  title  rights } }"},
    emails: {query: "{user_emails{email id user_id}}"}
  }
  
  users: User[] = []

  refreshUsers() {
    this.getData(encodeURI("/graphql"), this.queries.users).then((d) => {
      this.users = d.data.users
    });
  }

  async getData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }
}
