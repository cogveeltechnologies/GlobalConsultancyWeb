import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, of, Subscription, switchMap } from 'rxjs';
import { ConsultancyApi } from '../consultancy-services/api.service';
import { Observable } from 'rxjs';
import { SpecificConsultancyRelated } from '../consultancy-models/data.specificInstitutes';
import { ConsultancyService } from '../consultancy-services/consultancy.service';
import { ConsultancyDetailsOptions } from '../consultancy-models/data.consultancy-get-options';

@Component({
  selector: 'app-register-program',
  templateUrl: './register-program.component.html',
  styleUrls: ['./register-program.component.scss']
})
export class RegisterProgramComponent {
  constructor(private route: ActivatedRoute, private consultancyApiService: ConsultancyApi, private router: Router, private consultancyService:ConsultancyService) { }

  breadscrums = [
    {
      title: 'Add Program',
      items: ['Consultancy'],
      active: 'Add Program',
    },
  ];
  registerProgram: FormGroup;
  editMode: boolean;
  programCategoryOptions = [101, 102, 103, 1];
  programIntakeOptions = [200, 201, 202];
  statusOptions: string[] = ["Active", "Inactive"];
  isPublic: boolean[] = [true, false]
  subscriptions: Subscription = new Subscription();
  editId: number;
  consultancyId:string = localStorage.getItem("id");
  defaultData:ConsultancyDetailsOptions = {...this.consultancyService.defaultRenderData()};
  instituteOptions: Observable<SpecificConsultancyRelated[]>;
  sessionOptions: Observable<SpecificConsultancyRelated[]>;
  intakeOptions: Observable<SpecificConsultancyRelated[]>;
  institute$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  session$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  intake$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);



  ngOnInit() {
    this.registerProgram = new FormGroup({
      programName: new FormControl(''),
      programDescription: new FormControl(''),
      duration: new FormControl(''),
      applicationFee: new FormControl(''),
      tutionFee: new FormControl(''),
      sessionId: new FormControl(''),
      levelOfEducation: new FormControl(''),
      status: new FormControl(''),
      subjectRequirements: new FormControl(''),
      academicRequirements: new FormControl(''),
      programCategoryId: new FormControl(''),
      programIntake: new FormControl(''),
      intakeId: new FormControl(''),
      instituteId: new FormControl(''),
      courseTypeId: new FormControl(''),
      isPublic: new FormControl('')
    });

    const details = this.route.snapshot.data['editResponse']

    if (details) {
      this.editId = +this.route.snapshot.paramMap.get('id');
      this.editMode = true
      this.registerProgram.patchValue(details)
    }

    this.instituteOptions = this.consultancyApiService.getSpecificInstitutes(this.consultancyId);

    this.subscriptions.add(combineLatest([this.institute$, this.session$, this.intake$]).pipe(switchMap(([instituteId, sessionId, intakeId]) => {
      if (instituteId && !sessionId) {
        this.defaultData.InstituteId = String(instituteId);
         this.sessionOptions = this.consultancyApiService.getSpecificSessions(this.defaultData);
         return of([])
      } else if (sessionId && !intakeId) {
        this.defaultData.SessionId = String(sessionId);
         this.intakeOptions = this.consultancyApiService.getSpecificIntakes(this.defaultData);
         return of([])
      }else {
        return of([])
      }
    })).subscribe())
  }

  onInstituteChange(event:any){
    this.institute$.next(event.value)
  }
  onSessionChange(event:any){
    this.session$.next(event.value)
  }
  onIntakeChange(event:any){
    this.intake$.next(event.value)
  }

  onSubmit() {
    let newDetails = this.registerProgram.value;
    newDetails.consultancyId = +this.consultancyId;
    console.log(newDetails)
    if (this.editMode) {
      this.subscriptions.add(this.consultancyApiService.updateProgram(this.editId, newDetails).subscribe(res => {
        this.router.navigate(["consultancy", "program-list"]);
      }))
    } else {
      this.subscriptions.add(this.consultancyApiService.registerProgram(newDetails).subscribe(res => {
        this.router.navigate(["consultancy", "program-list"]);
      }))
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
