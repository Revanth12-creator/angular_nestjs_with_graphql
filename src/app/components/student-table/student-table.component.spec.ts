import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import { StudentTableComponent } from './student-table.component';

describe('StudentTableComponent', () => {
  let component: StudentTableComponent;
  let fixture: ComponentFixture<StudentTableComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentTableComponent],
      imports: [BrowserModule, FormsModule, ReactiveFormsModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(StudentTableComponent);

        component = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;
      });
  });

  // it(`should be submitted to true`, async () => {
  //   component.saveHandler();
  //   expect(component.saveHandler).toBeTruthy();
  // });
  it(`should call onSubmit method`, async () => {
    fixture.detectChanges();
    spyOn(component, 'saveHandler');
    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.saveHandler).toHaveBeenCalledTimes(1);
  });

  it(`form should be invalid`, async(() => {
    component.form.controls['name'].setValue('');
    component.form.controls['email'].setValue('');
    component.form.controls['dateofbirth'].setValue('');
    expect(component.form.valid).toBeFalse();
  }));
 
  // it(`should should have a message 'welcome' `, async () => {
  //  const fixture=TestBed.createComponent(StudentTableComponent);
  
  //   expect(studentTable.).toHaveBeenCalledTimes(1);
  // });

});
