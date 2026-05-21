import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '.card, [appHoverZoom]',
  standalone: true,
})
export class HoverZoomDirective {
  @Input() zoomScale: number = 1.1; // Default zoom scale
  @Input() zoomSpeed: number = 150; // Default zoom speed in milliseconds

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      `transform ${this.zoomSpeed}ms ease`
    );
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${this.zoomScale})`);
    // add shadow for depth effect
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 8px 24px rgba(0,0,0,0.2)');
  }

  @HostListener('mouseleave') onMouseLeave() {
    // scale back to normal
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
    // remove shadow
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'none');
  }
}
