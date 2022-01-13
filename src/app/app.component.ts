import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'time-picker';
  hhArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  mmArray = [0,10,20,30,40,50];
  @ViewChild('hContainer') hhContainerRef!: ElementRef;
  @ViewChild('mContainer') mmContainerRef!: ElementRef;
  
  hhScroll$ = new Subject<number>();
  mmScroll$ = new Subject<number>();
  hhValue!: number;
  mmValue!: number;
  constructor(){
      
  }
  getValueByPosition(y: number, type: string) {
    let arr = type === 'hh' ? this.hhArray : this.mmArray;
    let index = Math.floor((y+17)/33);
    if(index < 0) index = 0;
    if(index >= arr.length) index = arr.length -1;
    return arr[index];
  }
  scrollTo(index: number, event: any, type: string) {
    let containerRef = type === 'hh' ? this.hhContainerRef : this.mmContainerRef;
    containerRef.nativeElement.scrollTo({
        top: index * 33,
        behavior: 'smooth'
    });
  }
  ngOnInit(){
    this.hhScroll$.asObservable().pipe(
      debounceTime(100)
    ).subscribe((v) => {
        let index = this.hhArray.indexOf(v);
        this.hhContainerRef.nativeElement.scrollTo({
            top: index * 33,
            behavior: 'smooth'
        });
    })
    this.mmScroll$.asObservable().pipe(
      debounceTime(100)
    ).subscribe((v) => {
        let index = this.mmArray.indexOf(v);
        this.mmContainerRef.nativeElement.scrollTo({
            top: index * 33,
            behavior: 'smooth'
        });
    })
  }
  
  @HostListener("window:scroll", ['$event'])
  handleHHScroll(event: any) {
    // console.log("scroll:" + event.target.scrollTop);
    this.hhValue = this.getValueByPosition(event.target.scrollTop, 'hh');
    this.hhScroll$.next(this.hhValue);
  }
  
  @HostListener("window:scroll", ['$event'])
  handleMMScroll(event: any) {
    // console.log("scroll:" + event.target.scrollTop);
    this.mmValue = this.getValueByPosition(event.target.scrollTop, 'mm');
    this.mmScroll$.next(this.mmValue);
  }
}
