import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecificConsultancyRelated } from '../consultancy-models/data.specificInstitutes';
import { ConsultancyApi } from '../consultancy-services/api.service';
import { Observable, Subscription } from 'rxjs';
import { ConsultancyService } from '../consultancy-services/consultancy.service';

@Component({
  selector: 'app-register-session',
  templateUrl: './register-session.component.html',
  styleUrls: ['./register-session.component.scss']
})
export class RegisterSessionComponent {
  constructor(private route: ActivatedRoute, private router: Router, private consultancyApiService: ConsultancyApi, private consultancyService:ConsultancyService) { }
  breadscrums = [
    {
      title: 'Add Session',
      items: ['Consultancy'],
      active: 'Add Session',
    },
  ];

  registerSession: FormGroup;
  editMode: boolean;
  institutes: Observable<SpecificConsultancyRelated[]>;
  consultancyId: string = localStorage.getItem("id");
  instituteId: number;
  editId: number;
  subscription: Subscription = new Subscription()


  ngOnInit() {
    this.registerSession = new FormGroup(
      {
        sessionName: new FormControl(''),
        instituteId: new FormControl(''),
        year: new FormControl('')
      })

    // get institutes
    this.institutes = this.consultancyApiService.getSpecificInstitutes(this.consultancyId);

    // edit session
    const editSession = this.route.snapshot.data['editResponse'];
    if (editSession) {
      this.editId = +this.route.snapshot.paramMap.get('id');
      this.instituteId = editSession.instituteId;
      this.editMode = true;
      this.registerSession.patchValue(editSession);
    }

  }

  onInstituteChange(event: any) {
    this.instituteId = event.value
  }

  routeToSessionList() {
    if(this.editMode){
      this.consultancyService.showList.next(true)
      this.router.navigate(['consultancy', 'session-list'])
    }else{
      this.router.navigate(['consultancy', 'session-list'])
    }
   
  }

  // Filter function to allow today and future dates
  futureDateFilter = (date: Date | null): boolean => {
    const today = new Date();
    // Set time to midnight to compare only dates
    today.setHours(0, 0, 0, 0);
    return date ? date >= today : false; // Allow today and future dates
  };


  onSubmit(): void {
    const sessionDetails = this.registerSession.value;

    // add consultancy id
    sessionDetails.consultancyId = +this.consultancyId;

    if (this.editMode) {
      this.subscription.add(this.consultancyApiService.updateSession(this.editId, sessionDetails)
        .subscribe(res => {
          if (res['status'] >= 200 && res['status'] < 300) {
            this.routeToSessionList()
          }
        }))
    } else {
      // call api to record new session in db
      sessionDetails.instituteId = this.instituteId;
      this.subscription.add(this.consultancyApiService.registerSession(sessionDetails)
        .subscribe(res => {
          if (res['status'] >= 200 && res['status'] < 300) {
            this.routeToSessionList()
          }
        }))

    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
