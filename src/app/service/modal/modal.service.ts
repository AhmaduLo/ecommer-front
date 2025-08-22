import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalData {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalData>({
    message: '',
    type: 'info',
    isVisible: false
  });

  modal$ = this.modalSubject.asObservable();

  showSuccess(message: string) {
    this.showModal(message, 'success');
  }

  showError(message: string) {
    this.showModal(message, 'error');
  }

  showInfo(message: string) {
    this.showModal(message, 'info');
  }

  private showModal(message: string, type: 'success' | 'error' | 'info') {
    this.modalSubject.next({
      message,
      type,
      isVisible: true
    });

    // Auto-fermeture après 2 secondes
    setTimeout(() => {
      this.hideModal();
    }, 2000);
  }

  hideModal() {
    this.modalSubject.next({
      message: '',
      type: 'info',
      isVisible: false
    });
  }
}