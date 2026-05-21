import { Directive, ElementRef, Host, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDisableIfEmptyDirective]',
  standalone: true,
})
export class DisableIfEmptyDirective {
  @Input() appDisableIfEmptyDirective: string = '';

  constructor(private el: ElementRef) {}

  @HostListener('input') onInput() {
    this.el.nativeElement.disabled = this.appDisableIfEmptyDirective.trim() === '';
  }
}
