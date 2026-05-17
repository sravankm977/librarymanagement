import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './layout-routing.module';

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class LayoutModule {}
