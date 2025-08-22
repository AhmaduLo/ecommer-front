import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService, ModalData } from 'src/app/service/modal/modal.service';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal-overlay" [class.visible]="modalData.isVisible" (click)="closeModal()">
      <div class="modal-content" [ngClass]="'modal-' + modalData.type" (click)="$event.stopPropagation()">
        <div class="modal-icon">
          <i [ngClass]="getIconClass()"></i>
        </div>
        <div class="modal-message">{{ modalData.message }}</div>
        <div class="modal-progress-bar">
          <div class="progress" [class.animate]="modalData.isVisible"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  modalData: ModalData = { message: '', type: 'info', isVisible: false };
  private subscription: Subscription = new Subscription();

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.subscription = this.modalService.modal$.subscribe(
      data => this.modalData = data
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeModal() {
    this.modalService.hideModal();
  }

  getIconClass(): string {
    switch (this.modalData.type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'info':
      default:
        return 'fas fa-info-circle';
    }
  }
}