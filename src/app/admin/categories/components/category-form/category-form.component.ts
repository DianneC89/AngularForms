import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder, FormGroup  } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

import { CategoriesService } from '../../../../core/services/categories.service';
import { MyValidators } from '../../../../utils/validators'

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private CategoriesService: CategoriesService,
    private router: Router,
    private storage: AngularFireStorage
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm(){
    this.form = this.formBuilder.group({
      name :['',[Validators.required, Validators.minLength(4)],[MyValidators.validateCategory(this.CategoriesService)]],
      image: ['',[Validators.required]]
    });
  }

  get nameField(){
    return this.form.get('name');
  }

  get imageField(){
    return this.form.get('image');
  }

  save() {
    if (this.form.valid) {
      this.createCategory();
    } else {
      this.form.markAllAsTouched();
    }
  }

  private createCategory() {
    const data = this.form.value;
    this.CategoriesService.createCategory(data)
    .subscribe(rta => {
      this.router.navigate(['/admin/categories']);
    });
  }


  uploadFile(event){
    const image = event.target.files[0];
    const name = 'category.png';
    const ref = this.storage.ref(name);
    const task = this.storage.upload(name, image);

    task.snapshotChanges().pipe(
      finalize(() => {
        const urlImage$ = ref.getDownloadURL();
        urlImage$.subscribe(url =>{
          console.log(url);
          this.imageField.setValue(url);
        })
      })
    )
    .subscribe();

  }



}
