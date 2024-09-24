import { Component,OnInit } from '@angular/core';
import { InstituteData } from '../consultancy-models/data.institute';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultancyApi } from '../consultancy-services/api.service';
import { ConsultancyService } from '../consultancy-services/consultancy.service';
import { ConsultancyDetailsOptions } from '../consultancy-models/data.consultancy-get-options';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-institute-all-details',
  templateUrl: './institute-all-details.component.html',
  styleUrls: ['./institute-all-details.component.scss']
})
export class InstituteAllDetailsComponent {
  breadscrums = [
    {
      title: 'Institute Details',
      items: ['Institute List'],
      active: 'Institute Details',
    },
  ];
  constructor(private route:ActivatedRoute, private router:Router, private consultancyApi:ConsultancyApi, private consultancyService:ConsultancyService){};
  details:InstituteData;
  keys:any;
  defaultData:ConsultancyDetailsOptions;
    ngOnInit(){
    this.defaultData = this.consultancyService.defaultRenderData()
     // for all details (on view button)
     this.details = this.route.snapshot.data['instituteDetails']

     this.keys = Object.keys(this.details);
     console.log(this.keys)
  }

  backToList(){
    this.consultancyService.showList.next(true)
    this.router.navigate(["/consultancy/institution-list"]);

  }
}
