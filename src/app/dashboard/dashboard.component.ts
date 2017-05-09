import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { FirebaseService } from '../firebase.service';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  boards: Observable<any>;
  user: Observable<firebase.User>;
  newBoardForm: FormGroup;

  constructor(
    private fireBase: FirebaseService,
    private fb: FormBuilder,
    private snackBar: MdSnackBar,
  ) {
    this.boards = fireBase.userBoards;
    this.user = fireBase.user;

    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.newBoardForm = this.fb.group({
      boardName: ['', Validators.required],
    });
  }

  createBoard() {
    const val = this.newBoardForm.controls.boardName.value;

    if (this.fireBase.validateString(val)) {
      return this.snackBar.open(`Boards cannot contain ".", "#", "$", "[", or "]"`, null, {duration: 6000});
    }

    this.fireBase
      .createBoard(val)
      .then(() => {
        this.newBoardForm.reset();
        this.snackBar.open(`${val} board successfully created!`, null, {duration: 6000});
      })
      .catch(err => this.snackBar.open(err.message || 'Ops! Something went wrong.', null, {duration: 6000}));
  }

  deleteBoard(board: any) {
    this.fireBase.removeBoard(board.$key);
  }

}