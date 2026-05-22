import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAllowDragCardDirective]',
  standalone: true,
})
export class AllowDragCardDirective implements OnDestroy {
  @Input() dragHandle: string = ''; // optional CSS class for drag handle

  private isDragging = false; // tracks if drag is active

  // starting mouse position
  private startX = 0;
  private startY = 0;

  // starting element position
  private startLeft = 0;
  private startTop = 0;

  // store listeners so we can clean them up later
  private mouseMoveListener!: () => void;
  private mouseUpListener!: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // set required styles on the host element
    this.renderer.setStyle(this.el.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
    this.renderer.setStyle(this.el.nativeElement, 'user-select', 'none'); // prevent text selection while dragging
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();

    this.isDragging = true;

    // record where the mouse started
    this.startX = event.clientX;
    this.startY = event.clientY;

    // record where the element started
    this.startLeft = this.el.nativeElement.offsetLeft;
    this.startTop = this.el.nativeElement.offsetTop;

    // change cursor while dragging
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'none'); // disable transition while dragging
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.8'); // visual feedback

    // listen to mousemove and mouseup on the document
    // (not just the element, so drag works even if mouse moves fast)
    this.mouseMoveListener = this.renderer.listen('document', 'mousemove', (e: MouseEvent) =>
      this.onMouseMove(e)
    );

    this.mouseUpListener = this.renderer.listen('document', 'mouseup', () => this.onMouseUp());
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    // calculate how far the mouse has moved from the start
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    // calculate new position
    const newLeft = this.startLeft + deltaX;
    const newTop = this.startTop + deltaY;

    // apply new position to the element
    this.renderer.setStyle(this.el.nativeElement, 'left', `${newLeft}px`);
    this.renderer.setStyle(this.el.nativeElement, 'top', `${newTop}px`);
  }

  private onMouseUp() {
    if (!this.isDragging) return;

    this.isDragging = false;

    // restore styles after drag ends
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 0.2s ease');

    // clean up listeners to avoid memory leaks
    this.cleanUpListeners();
  }

  private cleanUpListeners() {
    if (this.mouseMoveListener) this.mouseMoveListener();
    if (this.mouseUpListener) this.mouseUpListener();
  }

  // clean up if component is destroyed while dragging
  ngOnDestroy() {
    this.cleanUpListeners();
  }
}
