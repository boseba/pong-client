import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { MouseWheelDirective } from './directives/directives.exports';
import { BlocksModule } from '../blocks/blocks.module';
import { ResizeObserverDirective } from './directives/resize-observer.directive';
import { InkEffectDirective } from '../directives/ink-effect.directive';
import { TrackByPropertyDirective } from '../directives/track-by-property.directive';
import { ContextualPanelDirective } from '../directives/contextual-panel.directive';
import { IconContainerComponent } from './icon-container/icon-container.component';

@NgModule({
  declarations: [
    IconContainerComponent,
    MouseWheelDirective,
    ResizeObserverDirective,
    InkEffectDirective,
    ContextualPanelDirective,
    TrackByPropertyDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BlocksModule,
    
    PipesModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    PipesModule,
    BlocksModule,
    
    IconContainerComponent,
    MouseWheelDirective,
    ResizeObserverDirective,
    InkEffectDirective,
    ContextualPanelDirective,
    TrackByPropertyDirective
  ]
})
export class SharedModule { }
