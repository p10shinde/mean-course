import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private postsEdited = new Subject<Post>();
  private API_URL = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {

  }

  getPosts() {
    return this.http.get<Post[]>(`${this.API_URL}getpost`)
    // return [...this.posts];
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };
    let postExists = false;
    this.posts.filter(p => {
      if (p.title === title) {
        p.content = content;
        postExists = true;
      }
    });

    if (!postExists) {
      this.posts.push(post);
    }

    this.postsUpdated.next([...this.posts]);
  }

  deletePost(title: string, content: string) {
    const post: Post = { title: title, content: content};
    this.posts = this.posts.filter( p => p.title !== title);
    this.postsUpdated.next([...this.posts]);
    this.postsEdited.next({title: '', content: ''});
  }

  editPost(title: string, content: string) {
    this.postsEdited.next({title: title, content: content});
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPostsEditedListener() {
    return this.postsEdited.asObservable();
  }

}
