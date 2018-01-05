import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'
import { fadeInAnimation } from '../animations/fade-in.animation';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.css'],
  animations: [fadeInAnimation]
})
export class MovieFormComponent implements OnInit {

  movieForm: NgForm;
  @ViewChild('movieForm')
  currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  movie: object;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}


  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("movies", +params['id']))
      .subscribe(movie => this.movie = movie);
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        (+params['id']) ? this.getRecordForEdit() : null;
      });
  }

  saveMovie(movieForm: NgForm){
    if(typeof movieForm.value.id === "number"){
      this.dataService.editRecord("movies", movieForm.value, movieForm.value.id)
          .subscribe(
            movie => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("movies", movieForm.value)
          .subscribe(
            student => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.movie = {};
            this.movieForm.form.markAsPristine();
    }

  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.movieForm = this.currentForm;
    this.movieForm.valueChanges
      .subscribe(
        data => this.onValueChanged()
      );
  }

  onValueChanged() {
    let form = this.movieForm.form;

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
    'title': '',
    'distributor': '',
    'budget': '',
    'releaseDate': ''
  };

  validationMessages = {
    'title': {
      'required': 'Movie title is required.',
      'minlength': 'Movie title must be at least 2 characters long.',
      'maxlength': 'Movie title cannot be more than 30 characters long.'
    },
    'distributor': {
      'required': 'Distributor is required.',
      'minlength': 'Distributor must be at least 2 characters long.',
      'maxlength': 'Distributor cannot be more than 30 characters long.'
    },
    'budget': {
      'pattern': 'budget must be a number'
    },
    'releaseDate': {
      'pattern': 'Release date should be in the following format: YYYY-MM-DD'
    }
  };

}
