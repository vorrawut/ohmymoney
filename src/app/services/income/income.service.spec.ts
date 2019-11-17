import { TestBed } from '@angular/core/testing';
import { IncomeService } from './income.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { IncomeRequest } from 'src/app/models/income-request';

describe('IncomeService', () => {
  let service: IncomeService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(IncomeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call method get with url of get income api', () => {
    service.getIncomeByUserId().subscribe();

    const req = httpTestingController.expectOne(
      `${service.SERVER_URL}/income/id/1`
    );
    expect(req.request.method).toBe('GET');
  });

  it('should call method GET with url of get income group api', () => {
    service.getIncomeGroup().subscribe();

    const req = httpTestingController.expectOne(
      `${service.SERVER_URL}/income/group`
    );
    expect(req.request.method).toBe('GET');
  });

  it('should call method POST with url of save income api', () => {
    const dataRequest = {
      amount: 50000,
      date: '12/31/2019',
      incomeGroupId: 3
    } as IncomeRequest;
    service.saveIncome(dataRequest).subscribe();

    const req = httpTestingController.expectOne(`${service.SERVER_URL}/income`);
    expect(req.request.method).toBe('POST');
  });
});
