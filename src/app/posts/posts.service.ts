import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postsCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPostUpdateListener(): Observable<{ posts: Post[]; postsCount: number }> {
    return this.postsUpdated.asObservable();
  }

  getPosts(postsPerPage: number, currentPage: number): void {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: Post[]; maxPosts: number }>(
        `${BACKEND_URL}${queryParams}`
      )
      .pipe(
        map((postData: any) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = [...transformedPostsData.posts];
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount: transformedPostsData.maxPosts,
        });
      });
  }

  getPost(
    id: string
  ): Observable<{
    _id: string;
    title: string;
    content: string;
    imagePath: string;
    creator: string;
  }> {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(`${BACKEND_URL}${id}`);
  }

  addPost(t: string, c: string, image: File): void {
    const postData = new FormData();
    postData.append('title', t);
    postData.append('content', c);
    postData.append('image', image, t);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  updatePost(postId: string, t: string, c: string, image: File | string): void {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', t);
      postData.append('content', c);
      postData.append('image', image, t);
    } else {
      postData = {
        id: postId,
        title: t,
        content: c,
        imagePath: image,
        creator: null,
      };
    }
    this.http.put(`${BACKEND_URL}${postId}`, postData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string): Observable<object> {
    return this.http.delete(`${BACKEND_URL}${postId}`);
  }
}
