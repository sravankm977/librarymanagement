import { Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeScript,
  SafeStyle,
  SafeUrl,
} from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  // inject DomSanitizer — Angular's built-in security service
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    value: string,
    type: string = 'html'
  ): SafeHtml | SafeUrl | SafeStyle | SafeScript | SafeResourceUrl {
    // guard — handle null or undefined
    if (!value) return '';

    switch (type) {
      case 'html':
        // trust this HTML content
        return this.sanitizer.bypassSecurityTrustHtml(value);

      case 'url':
        // trust this URL (href, src)
        return this.sanitizer.bypassSecurityTrustUrl(value);

      case 'style':
        // trust this CSS style
        return this.sanitizer.bypassSecurityTrustStyle(value);

      case 'script':
        // trust this script
        return this.sanitizer.bypassSecurityTrustScript(value);

      case 'resourceUrl':
        // trust this resource URL (iframes, video src)
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);

      default:
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
  }
}
