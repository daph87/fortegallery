import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('menuDropDown', { static: false }) menuDropDown: ElementRef;
  public isAdmin: boolean = false;

  public activateMenu(): void {
    let dropDown = this.menuDropDown.nativeElement.style.display;
    if (dropDown === 'block') 
    this.menuDropDown.nativeElement.style.display = 'none';
    else this.menuDropDown.nativeElement.style.display = 'block';
  }

  constructor(private store: Store<any>, private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    // check if Im connected as admin
    this.store.select('adminState').subscribe(ngrxAdmin => {
      if (ngrxAdmin) this.adminService.getAdmins().subscribe(admin => {
        this.isAdmin = ngrxAdmin.username === admin[0].username && ngrxAdmin.password === admin[0].password ? true : false;
      });
    });

  }

}
