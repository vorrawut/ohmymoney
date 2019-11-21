import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { Income } from 'src/app/models/income';
import { IncomeRequest } from 'src/app/models/income-request';
import { IncomeService } from 'src/app/services/income/income.service';
import { IncomeGroup } from './../../models/income-group';
import { IncomeComponent } from './income.component';


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
          incomeGroupName: 'งานประจำ',
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

  it('should call method getIncomeGroup when call ngOnInit', () => {
    spyOn(incomeService, 'getIncomeGroup').and.returnValue(of([]));
    component.ngOnInit();
    expect(incomeService.getIncomeGroup).toHaveBeenCalled();
  });

  it('should set data in incomeGroup when call getIncomeGroup api is success', () => {
    const expected = [
      {
        id: 1,
        name: 'เงินเดือน'
      },
      {
        id: 2,
        name: 'รายได้เสริม'
      }
    ] as IncomeGroup[];
    spyOn(incomeService, 'getIncomeGroup').and.returnValue(of(expected));
    component.ngOnInit();

    expect(component.incomeGroup).toBe(expected);
  });

  it('should call method save income when click submit', () => {
    component.incomeForm.get('date').setValue('11/15/2019');
    component.incomeForm.get('incomeGroupId').setValue('3');
    component.incomeForm.get('amount').setValue('50000');

    spyOn(incomeService, 'saveIncome').and.returnValue(of());
    spyOn(component, 'getDateISOString').and.returnValue(
      '2019-11-15T17:58:17.318Z'
    );

    const expected = {
      amount: 50000,
      date: '2019-11-15T17:58:17.318Z',
      incomeGroupId: 3
    } as IncomeRequest;

    component.onSubmit();
    expect(incomeService.saveIncome).toHaveBeenCalledWith(expected);
  });

  it('should call method get income by userID when called save income success', () => {
    component.incomeForm.get('date').setValue('11/15/2019');
    component.incomeForm.get('incomeGroupId').setValue('3');
    component.incomeForm.get('amount').setValue('50000');

    spyOn(incomeService, 'saveIncome').and.returnValue(of([]));
    spyOn(component, 'getDateISOString').and.returnValue(
      '2019-11-15T17:58:17.318Z'
    );
    spyOn(component, 'getIncomeByUserId');

    component.onSubmit();
    expect(component.getIncomeByUserId).toHaveBeenCalled();
  });

  it('(done fn) should close modal when save income is success', (done) => {

    component.modalRef = { hide: () => {} } as BsModalRef;

    const saveIncomeSpy = spyOn(incomeService, 'saveIncome').and.returnValue(of({}));
    spyOn(component, 'getDateISOString').and.returnValue('2019-11-15T17:58:17.318Z');
    spyOn(component.modalRef, 'hide');

    component.onSubmit();

    saveIncomeSpy.calls.mostRecent().returnValue.subscribe( _ => {
      expect(component.modalRef.hide).toHaveBeenCalled();
      done();
    });
  });


  it('(async) should close modal when save income is success', async(() => {

    component.modalRef = { hide: () => {} } as BsModalRef;

    spyOn(incomeService, 'saveIncome').and.returnValue(of({}));
    spyOn(component, 'getDateISOString').and.returnValue('2019-11-15T17:58:17.318Z');
    spyOn(component.modalRef, 'hide');

    component.onSubmit();

    fixture.whenStable().then(() => {
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  }));



  it('should call updateIncome service when click edit', () => {
    spyOn(incomeService, 'updateIncome');
    component.incomeForm.get('date').setValue('11/15/2019');
    component.incomeForm.get('incomeGroupId').setValue('3');
    component.incomeForm.get('amount').setValue('50000');

    component.modalRef = {} as BsModalRef;

    spyOn(component, 'getDateISOString').and.returnValue(
      '2019-11-15T17:58:17.318Z'
    );
    const input = {
      id: 1,
      amount: 50000,
      date: '11/15/2019',
      incomeGroupId: 3,
      incomeGroupName: 'เงินเดือน'
    } as Income;

    const dataUpdate = {
      amount: 50000,
      date: '2019-11-15T17:58:17.318Z',
      incomeGroupId: 3
    } as IncomeRequest;
    component.edit(input);

    expect(incomeService.updateIncome).toHaveBeenCalledWith(
      input.id,
      dataUpdate
    );
  });

  it('should set income data to form group when click edit', () => {
    const input = {
      id: 1,
      amount: 50000,
      date: '11/15/2019',
      incomeGroupId: 3,
      incomeGroupName: 'เงินเดือน'
    } as Income;

    const template = fixture.debugElement.nativeElement.querySelector(
      '#template'
    );

    component.openModal(template, input);

    expect(component.incomeForm.get('date').value).toBe('11/15/2019');
    expect(component.incomeForm.get('incomeGroupId').value).toBe('3');
    expect(component.incomeForm.get('amount').value).toBe('50000');
  });

  it('should set empty in date, incomeGroupId, amount when income data is empty and call open modal', () => {
    const template = fixture.debugElement.nativeElement.querySelector(
      '#template'
    );

    component.openModal(template);

    expect(component.incomeForm.get('date').value).toBe('');
    expect(component.incomeForm.get('incomeGroupId').value).toBe('');
    expect(component.incomeForm.get('amount').value).toBe('');
  });

  it('should set empty in income form when income data is empty and click add modal', () => {
    component.incomeForm.get('date').setValue('1/13/2019');
    component.incomeForm.get('incomeGroupId').setValue('2');
    component.incomeForm.get('amount').setValue('90000');

    const template = fixture.debugElement.nativeElement.querySelector(
      '#template'
    );

    component.openModal(template);

    expect(component.incomeForm.get('date').value).toBe('');
    expect(component.incomeForm.get('incomeGroupId').value).toBe('');
    expect(component.incomeForm.get('amount').value).toBe('');
  });
});
