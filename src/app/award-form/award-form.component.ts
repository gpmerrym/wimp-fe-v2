import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'
import { fadeInAnimation } from '../animations/fade-in.animation';

@Component({
  selector: 'app-award-form',
  templateUrl: './award-form.component.html',
  styleUrls: ['./award-form.component.css'],
  animations: [fadeInAnimation]
})
export class AwardFormComponent implements OnInit {

  awardForm: NgForm;
  @ViewChild('awardForm')
  currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  award: object;
  actorId;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("actors", +params['id']))
      .subscribe(award => this.award = award);
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        (+params['id']) ? this.getRecordForEdit() : null;
        this.actorId = params.id;
      });
  }

  saveAward(awardForm: NgForm){
      //console.log(this.actorId);
      this.dataService.addRecord("actors/"+this.actorId+"/awards", awardForm.value)
      .subscribe(
        student => this.successMessage = "Record added successfully",
        error =>  this.errorMessage = <any>error);
       // this.award = {};
        //this.awardForm.form.markAsPristine();
        
          
              
      };
    
    
    
  
    

    formErrors = {
      'title': '',
      'organization': '',
      'year': ''
      
    };
  

}


