import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [NgClass],
  templateUrl: './loader.html',
})
export class Loader {
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  variant = input<'local' | 'global'>('local');

  containerClasses = computed(() => {
    return this.variant() === 'global'
      ? 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center'
      : 'flex w-full flex-1 items-center justify-center p-10';
  });

  spinnerClasses = computed(() => {
    const sizes = {
      sm: 'size-8 border-2',
      md: 'size-12 border-4',
      lg: 'size-20 border-4',
      xl: 'size-32 border-8'
    };
    
    return sizes[this.size()];
  });
}