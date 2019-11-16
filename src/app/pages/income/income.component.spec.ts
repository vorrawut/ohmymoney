import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Income } from 'src/app/models/income';
import { ModalModule } from 'ngx-bootstrap/modal';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeComponent } from './income.component';
import { HttpClientModule } from '@angular/common/http';
import { IncomeService } from 'src/app/services/income/income.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('IncomeComponent', () => {
  let component: IncomeComponent;
  let fixture: ComponentFixture<IncomeComponent>;
  let incomeService: IncomeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeComponent],
      imports: [
        ModalModule.forRoot(),
        HttpClientTestingModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    incomeService = TestBed.inject(IncomeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getIncomeByUserId service', () => {
    let expected: Income[];
    beforeEach(() => {
      expected = [
        {
          id: 1,
          incomeGroupId: 1,
          incomeNameGroupId: 'งานประจำ',
          amount: 1000000,
          date: '1/31/2019'
        }
      ];
      spyOn(incomeService, 'getIncomeByUserId').and.returnValue(of(expected));
    });

    it('should call getIncomeByUserId service when call method ngOnInit', () => {
      component.ngOnInit();

      expect(incomeService.getIncomeByUserId).toHaveBeenCalled();
    });

    it('should set incomes when call getIncomeByUserId is success', () => {
      component.ngOnInit();

      expect(component.incomes).toEqual(expected);
    });
  });

  describe('create reactive form', () => {
    it('should set empty in date of form', () => {
      component.ngOnInit();

      expect(component.incomeForm.controls.date.value).toBe('');
    });

    it('should set empty in income group id of form', () => {
      component.ngOnInit();
      expect(component.incomeForm.controls.incomeGroupId.value).toBe('');
    });

    it('should set empty in amount of form', () => {
      component.ngOnInit();
      expect(component.incomeForm.controls.amount.value).toBe('');
    });
  });
});
