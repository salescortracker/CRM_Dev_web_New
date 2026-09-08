import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

type MasterEndpoint = {
  getAll: string;
  create: string;
  update: string;
  delete: string;
};

export const MASTER_ENDPOINTS: Record<string, MasterEndpoint> = {
  companies: { getAll: 'getallcompany', create: 'createcompany', update: 'updatecompany', delete: 'deletecompany' },
  regions: { getAll: 'getallregion', create: 'createregion', update: 'updateregion', delete: 'deleteregion' },
  countries: { getAll: 'getallcountry', create: 'createcountry', update: 'updatecountry', delete: 'deletecountry' },
  states: { getAll: 'getallstate', create: 'createstate', update: 'updatestate', delete: 'deletestate' },
  cities: { getAll: 'getallcity', create: 'createcity', update: 'updatecity', delete: 'deletecity' },
  currencies: { getAll: 'getallcurrency', create: 'createcurrency', update: 'updatecurrency', delete: 'deletecurrency' },
  timezones: { getAll: 'getalltimezone', create: 'createtimezone', update: 'updatetimezone', delete: 'deletetimezone' },
  languages: { getAll: 'getalllanguage', create: 'createlanguage', update: 'updatelanguage', delete: 'deletelanguage' },
  nationalities: { getAll: 'getallnationality', create: 'createnationality', update: 'updatenationality', delete: 'deletenationality' },

  taxTypes: { getAll: 'getalltaxtype', create: 'createtaxtype', update: 'updatetaxtype', delete: 'deletetaxtype' },
  gst: { getAll: 'getallgst', create: 'creategst', update: 'updategst', delete: 'deletegst' },
  vat: { getAll: 'getallvat', create: 'createvat', update: 'updatevat', delete: 'deletevat' },
  paymentTerms: { getAll: 'getallpaymentterm', create: 'createpaymentterm', update: 'updatepaymentterm', delete: 'deletepaymentterm' },
  paymentMethods: { getAll: 'getallpaymentmethod', create: 'createpaymentmethod', update: 'updatepaymentmethod', delete: 'deletepaymentmethod' },
  invoicePrefixes: { getAll: 'getallinvoiceprefix', create: 'createinvoiceprefix', update: 'updateinvoiceprefix', delete: 'deleteinvoiceprefix' },
  creditTerms: { getAll: 'getallcreditterm', create: 'createcreditterm', update: 'updatecreditterm', delete: 'deletecreditterm' },

  leadSources: { getAll: 'getallleadsource', create: 'createleadsource', update: 'updateleadsource', delete: 'deleteleadsource' },
  leadStatuses: { getAll: 'getallleadstatus', create: 'createleadstatus', update: 'updateleadstatus', delete: 'deleteleadstatus' },
  opportunityStages: { getAll: 'getallopportunitystage', create: 'createopportunitystage', update: 'updateopportunitystage', delete: 'deleteopportunitystage' },
  pipelines: { getAll: 'getallpipeline', create: 'createpipeline', update: 'updatepipeline', delete: 'deletepipeline' },
  customerTypes: { getAll: 'getallcustomertype', create: 'createcustomertype', update: 'updatecustomertype', delete: 'deletecustomertype' },
  customerCategories: { getAll: 'getallcustomercategory', create: 'createcustomercategory', update: 'updatecustomercategory', delete: 'deletecustomercategory' },
  activityTypes: { getAll: 'getallactivitytype', create: 'createactivitytype', update: 'updateactivitytype', delete: 'deleteactivitytype' },
  followUpTypes: { getAll: 'getallfollowuptype', create: 'createfollowuptype', update: 'updatefollowuptype', delete: 'deletefollowuptype' },
  communicationTypes: { getAll: 'getallcommunicationtype', create: 'createcommunicationtype', update: 'updatecommunicationtype', delete: 'deletecommunicationtype' },
  meetingTypes: { getAll: 'getallmeetingtype', create: 'createmeetingtype', update: 'updatemeetingtype', delete: 'deletemeetingtype' },
  callOutcomes: { getAll: 'getallcalloutcome', create: 'createcalloutcome', update: 'updatecalloutcome', delete: 'deletecalloutcome' },
  winReasons: { getAll: 'getallwinreason', create: 'createwinreason', update: 'updatewinreason', delete: 'deletewinreason' },
  lossReasons: { getAll: 'getalllossreason', create: 'createlossreason', update: 'updatelossreason', delete: 'deletelossreason' },
  competitors: { getAll: 'getallcompetitor', create: 'createcompetitor', update: 'updatecompetitor', delete: 'deletecompetitor' },
  priorities: { getAll: 'getallpriority', create: 'createpriority', update: 'updatepriority', delete: 'deletepriority' },
  ratings: { getAll: 'getallrating', create: 'createrating', update: 'updaterating', delete: 'deleterating' },

  industries: { getAll: 'getallindustry', create: 'createindustry', update: 'updateindustry', delete: 'deleteindustry' },
  businessTypes: { getAll: 'getallbusinesstype', create: 'createbusinesstype', update: 'updatebusinesstype', delete: 'deletebusinesstype' },
  companyCategories: { getAll: 'getallcompanycategory', create: 'createcompanycategory', update: 'updatecompanycategory', delete: 'deletecompanycategory' },
  branchTypes: { getAll: 'getallbranchtype', create: 'createbranchtype', update: 'updatebranchtype', delete: 'deletebranchtype' },
  departments: { getAll: 'getalldepartment', create: 'createdepartment', update: 'updatedepartment', delete: 'deletedepartment' },
  designations: { getAll: 'getalldesignation', create: 'createdesignation', update: 'updatedesignation', delete: 'deletedesignation' },
  employeeTypes: { getAll: 'getallemployeetype', create: 'createemployeetype', update: 'updateemployeetype', delete: 'deleteemployeetype' },
  businessUnits: { getAll: 'getallbusinessunit', create: 'createbusinessunit', update: 'updatebusinessunit', delete: 'deletebusinessunit' },

  productCategories: { getAll: 'getallproductcategory', create: 'createproductcategory', update: 'updateproductcategory', delete: 'deleteproductcategory' },
  brands: { getAll: 'getallbrand', create: 'createbrand', update: 'updatebrand', delete: 'deletebrand' },
  unitsOfMeasure: { getAll: 'getallunitofmeasure', create: 'createunitofmeasure', update: 'updateunitofmeasure', delete: 'deleteunitofmeasure' },
  warehouses: { getAll: 'getallwarehouse', create: 'createwarehouse', update: 'updatewarehouse', delete: 'deletewarehouse' },
  productTypes: { getAll: 'getallproducttype', create: 'createproducttype', update: 'updateproducttype', delete: 'deleteproducttype' },

  ticketPriorities: { getAll: 'getallticketpriority', create: 'createticketpriority', update: 'updateticketpriority', delete: 'deleteticketpriority' },
  ticketCategories: { getAll: 'getallticketcategory', create: 'createticketcategory', update: 'updateticketcategory', delete: 'deleteticketcategory' },
  ticketStatuses: { getAll: 'getallticketstatus', create: 'createticketstatus', update: 'updateticketstatus', delete: 'deleteticketstatus' },
  slaLevels: { getAll: 'getallslalevel', create: 'createslalevel', update: 'updateslalevel', delete: 'deleteslalevel' },
  resolutionTypes: { getAll: 'getallresolutiontype', create: 'createresolutiontype', update: 'updateresolutiontype', delete: 'deleteresolutiontype' },

  holidays: { getAll: 'getallholiday', create: 'createholiday', update: 'updateholiday', delete: 'deleteholiday' },
  shifts: { getAll: 'getallshift', create: 'createshift', update: 'updateshift', delete: 'deleteshift' },
  leaveTypes: { getAll: 'getallleavetype', create: 'createleavetype', update: 'updateleavetype', delete: 'deleteleavetype' },
  attendanceStatuses: { getAll: 'getallattendancestatus', create: 'createattendancestatus', update: 'updateattendancestatus', delete: 'deleteattendancestatus' },
};

@Injectable({
  providedIn: 'root',
})
export class MasterDataService {
  private readonly masterUrl = `${environment.apiUrl}/Master`;

  constructor(private http: HttpClient) {}

  getAll(tabId: string): Observable<any> {
    return this.http.get(`${this.masterUrl}/${this.endpoint(tabId).getAll}`);
  }

  create(tabId: string, payload: any): Observable<any> {
    return this.http.post(`${this.masterUrl}/${this.endpoint(tabId).create}`, payload);
  }

  update(tabId: string, payload: any): Observable<any> {
    return this.http.post(`${this.masterUrl}/${this.endpoint(tabId).update}`, payload);
  }

  delete(tabId: string, id: string | number): Observable<any> {
    return this.http.post(`${this.masterUrl}/${this.endpoint(tabId).delete}/${id}`, {});
  }

  private endpoint(tabId: string): MasterEndpoint {
    const endpoint = MASTER_ENDPOINTS[tabId];
    if (!endpoint) {
      throw new Error(`No master endpoint configured for ${tabId}`);
    }
    return endpoint;
  }
}
