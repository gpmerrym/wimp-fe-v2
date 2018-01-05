import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'
import { fadeInAnimation } from '../animations/fade-in.animation';

@Component({
  selector: 'app-actor-form',
  templateUrl: './actor-form.component.html',
  styleUrls: ['./actor-form.component.css'],
  animations: [fadeInAnimation]
})
export class ActorFormComponent implements OnInit {

  actorForm: NgForm;
  @ViewChild('actorForm')
  currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  actor: object;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}


  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("actors", +params['id']))
      .subscribe(actor => this.actor = actor);
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        (+params['id']) ? this.getRecordForEdit() : null;
      });
  }

  saveActor(actorForm: NgForm){
    if(typeof actorForm.value.id === "number"){
      this.dataService.editRecord("actors", actorForm.value, actorForm.value.id)
        .subscribe(
          actor => this.successMessage = "Record updated successfully",
          error => this.errorMessage = <any>error);
        
    }else{
      this.dataService.addRecord("actors", actorForm.value)
      .subscribe(
        student => this.successMessage = "Record added successfully",
        error =>  this.errorMessage = <any>error);
        this.actor = {};
        this.actorForm.form.markAsPristine();
    }
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.actorForm = this.currentForm;
    this.actorForm.valueChanges
      .subscribe(
        data => this.onValueChanged()
      );
  }

  onValueChanged() {
    let form = this.actorForm.form;

    for (let field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }





  formErrors = {
    'firstName': '',
    'lastName': '',
    'birthDate': '',
    'yearSinceActive': ''
  };

  validationMessages = {
    'firstName': {
      'required': 'Actor first name title is required.',
      'minlength': 'Actor first name must be at least 2 characters long.',
      'maxlength': 'Actor first name cannot be more than 30 characters long.'
    },
    'lastName': {
      'required': 'Actor last name is required.',
      'minlength': 'Actor last name must be at least 2 characters long.',
      'maxlength': 'Actor last name cannot be more than 30 characters long.'
    },
    'birthDate': {
      'pattern': 'Release date should be in the following format: YYYY-MM-DD'
    },
    'yearSinceActive': {
      'pattern': 'Year since active must be a number'
    }
  };

}
