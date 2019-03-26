import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../posts.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First', conetnt: 'This is the first post content'},
  //   {title: 'Second', conetnt: 'This is the Second post content'},
  //   {title: 'Third', conetnt: 'This is the Third post content'}
  // ];
  posts: Post [] = [];
  private postsSub: Subscription;
  constructor(public postService: PostService) {}
  ngOnInit() {
    this.postService.getPosts();
    this.postsSub = this.postService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  deletePost(post: Post) {
    this.postService.deletePost(post.title);
  }

  editPost(post: Post) {
    this.postService.editPost(post.title, post.content);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
