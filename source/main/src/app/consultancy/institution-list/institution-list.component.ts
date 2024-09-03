import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultancyApi } from '../consultancy-services/api.service';
import { ConsultancyDetailsOptions } from '../consultancy-models/data.consultancy-get-options';
import { ConsultancyService } from '../consultancy-services/consultancy.service';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, of, startWith, Subscription, switchMap, tap, throttleTime } from 'rxjs';
import { Observable } from 'rxjs';
import { InstituteData } from '../consultancy-models/data.institute';
import { FormControl, FormGroup } from '@angular/forms';
import { SpecificConsultancyRelated } from '../consultancy-models/data.specificInstitutes';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-institution-list',
  templateUrl: './institution-list.component.html',
  styleUrls: ['./institution-list.component.scss'],
})

export class InstitutionListComponent {

  breadscrums = [
    {
      title: 'Institution List',
      items: ['Consultancy'],
      active: 'Institution List',
    },
  ];

  constructor(private router: Router, private consultancyService: ConsultancyService, private consultancyApiService: ConsultancyApi) { }
  editMode: boolean;
  defaultData: ConsultancyDetailsOptions = { ...this.consultancyService.defaultRenderData() };
  subscriptions: Subscription = new Subscription();
  consultancyId: string = localStorage.getItem("id")
  universities!: Observable<InstituteData[]>;
  countrySelected: boolean = false;
  countries: Observable<{ countryName: string, id: number }[]>;
  countryListForm: FormGroup;
  country$: BehaviorSubject<SpecificConsultancyRelated> = new BehaviorSubject<SpecificConsultancyRelated | null>(null);
  countryId: number;
  search = new FormControl();
  records: number;
  searchTerm$ = this.search.valueChanges.pipe(startWith(''));
  pagination$: BehaviorSubject<{pageSize:number,pageIndex:number}> = new BehaviorSubject<{pageSize:number,pageIndex:number}>({pageSize:this.defaultData.pageSize, pageIndex:this.defaultData.currentPage});
  sorting$: BehaviorSubject<string> = new BehaviorSubject<string>(this.defaultData.sortExpression);
  totalRecords$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentPage$: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultData.currentPage);





  getInstitutes(params: ConsultancyDetailsOptions) {
    return this.consultancyApiService.getInstitutes(this.defaultData).pipe
    (map(res => {
      console.log(res)
      this.records = res['pageInfo']['totalRecords'];
      return res['data']
    }));
  }

  ngOnInit() {
    this.countryListForm = new FormGroup({
      countryList: new FormControl(),
    })

    // fetching all countries for the dropdown
    this.countries = this.consultancyApiService.getAllCountries();

    // implementing filter on the basis of country
    this.subscriptions.add(combineLatest([this.country$, this.searchTerm$, this.pagination$, this.sorting$, this.currentPage$]).pipe(
      throttleTime(1000, undefined, { leading: true, trailing: true }),
      distinctUntilChanged(), switchMap(([id, search, pageRelated, sort]) => {
        if (id) {
          this.defaultData.CountryId = String(id);
          this.defaultData.searchText = search;
          this.defaultData.pageSize = pageRelated.pageSize;
          this.defaultData.currentPage = pageRelated.pageIndex;
          this.defaultData.sortExpression = sort;
          return this.universities = this.getInstitutes(this.defaultData)
        } else {
          return of([])
        }
      })).subscribe(res => {
        if (res.length) {
          this.countrySelected = true;
        }
      }))
  }

  // selection event (selection of country)
  onCountryChange(value: any) {
    this.country$.next(value.id);
  }

  // sort event
  onSortChange(event: any) {
    if (event.direction === '') {
      event.direction = 'asc'
    }
    this.sorting$.next(event.direction)
  }

  onSubmit() { }

  onPageChange(event: PageEvent) {
    this.pagination$.next({pageSize:event.pageSize,pageIndex:event.pageIndex+1})
  }




  addInstitute() {
    this.router.navigate(['consultancy/register-consultancy'])
  }

  deleteInstitute(id: number) {
    const con = confirm("Are you sure?")
    if (con) {
      this.consultancyApiService.deleteInstitute(id).subscribe(res => {
        this.universities = this.getInstitutes(this.defaultData)
      });
    }
  }

  refreshPage() {
    console.log("Refresh button clicked");
    // Add your refresh logic here
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    localStorage.removeItem("selectedCountry");
  }

}