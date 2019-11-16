import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Income } from 'src/app/models/income';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  constructor(private modalService: BsModalService) {}
  modalRef: BsModalRef;
  incomes: Income[];

  ngOnInit() {
    this.incomes = [
      {
        id: 1,
        incomeGroupId: 1,
        incomeNameGroupId: 1,
        amount: 10000,
        date: '1/31/2019'
      },
      {
        id: 2,
        incomeGroupId: 1,
        incomeNameGroupId: 1,
        amount: 500000,
        date: '2/31/2019'
      }
    ];
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
