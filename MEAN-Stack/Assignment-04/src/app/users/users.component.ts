import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { User, UserService } from './user.service';
@Component({imports:[FormsModule],templateUrl:'./users.component.html'})
export class UsersComponent {
  private service=inject(UserService);
  users=signal<User[]>([]);loading=signal(false);saving=signal(false);error=signal('');message=signal('');name='';email='';
  constructor(){this.load();}
  load(){this.loading.set(true);this.error.set('');this.service.getUsers().pipe(finalize(()=>this.loading.set(false))).subscribe({
    next:users=>this.users.set(users),error:()=>this.error.set('Could not load users. Check the local API and retry.')});}
  save(){
    if(!this.name.trim()||!this.email.trim()||this.saving())return;
    this.saving.set(true);this.error.set('');this.message.set('');
    this.service.addUser({name:this.name.trim(),email:this.email.trim()}).pipe(finalize(()=>this.saving.set(false))).subscribe({
      next:user=>{this.users.update(users=>[...users,user]);this.name='';this.email='';this.message.set('User saved by the API.');},
      error:()=>this.error.set('Could not save user. Use a valid name/email and check the API.')});
  }
}
