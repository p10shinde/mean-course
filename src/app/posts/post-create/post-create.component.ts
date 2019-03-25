import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {
  @ViewChild('postForm')
  private postForm: NgForm;

  private postEditSub: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.postService.getPostsEditedListener()
      .subscribe((post) => {
        this.postForm.setValue({
          title: post.title,
          content: post.content
        });
      });
  }

  onAddPost(form: NgForm) {
    if (form.invalid) { return; }
    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();

  }

  ngOnDestroy() {
    this.postEditSub.unsubscribe();
  }

}
