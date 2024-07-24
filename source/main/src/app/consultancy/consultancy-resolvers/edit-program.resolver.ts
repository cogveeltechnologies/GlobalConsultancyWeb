import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { ProgramData } from "../consultancy-models/data.program";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn:'root'
})

export class ProgramResolver implements Resolve<ProgramData>{
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProgramData> | Promise<ProgramData> | ProgramData {
    return of({
        Id: 2,
        ProgramName: 'Business Administration',
        ProgramDescription: 'A comprehensive program focusing on business principles and management practices.',
        Duration: '3 years',
        ApplicationFee: 60,
        TuitionFee: 18000,
        LevelOfEducation: 'Undergraduate',
        Status: 'Active',
        SubjectRequirements: 'Economics, Mathematics',
        AcademicRequirements: 'High School Diploma',
        ProgramCategoryId: 102,
        ProgramIntake: 200,
        IntakeId: 1002,
        InstituteId: 5002
    })
   }
}