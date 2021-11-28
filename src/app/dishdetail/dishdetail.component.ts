import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Review } from '../shared/feedback';
import { Params,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { visibility } from '../animations/app.animation';
import { flyInOut, expand } from '../animations/app.animation';




@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(), visibility(), expand()
    ]

})



export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess: string;
  dishcopy = null;
  dishIds: string[];
  prev: string;
  next: string;
  reviewForm: FormGroup;
  review: Review;
  dishcopyy: Dish;
  visibility = 'shown';
  @ViewChild('rform') reviewFormDirective;

  formErrors = {
    'author': '',
    'comment': ''
  };
   validationMessages = {
     'author' : {
       'required': 'Name is required',
       'minlength': ' Name must be at least 2 characters long.'
     },
     'comment' : {
      'required': 'comment is required',
      'minlength': ' comment must be at least 10 characters long.'
    },
   };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private rv: FormBuilder,
    @Inject('BaseURL') private BaseURL) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden' ; return this.dishService.getDish(params['id']);}))
    .subscribe(dish => { this.dish = dish;this.dishcopy = dish;this.dishcopyy = dish; this.setPrevNext(dish.id); this.visibility = 'shown' ; },
    errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }
  createForm() {
    this.reviewForm = this.rv.group({
      author: ['', [Validators.required, Validators.minLength(2)] ],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      rating: ['5'],
      date: ['']

    });
    this.reviewForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
    
  }
  onValueChanged(data?: any) {
    if (!this.reviewForm) { return; }
    const form = this.reviewForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
 

  onSubmit() {
    this.review = this.reviewForm.value;
    this.review.date = (new Date()).toString();
    this.dishcopyy.comments.push(this.review);
    this.dishService.putDish(this.dishcopyy)
    .subscribe(dish => {
      this.dish = dish; this.dishcopyy = dish;
    },
    errmess => { this.dish = null; this.dishcopyy = null; this.errMess = <any>errmess; });
    this.reviewForm.reset({
      author:'',
      comment:'',
      rating: '5',

    });
    this.reviewFormDirective.resetForm({

  })



}}
