import { HttpClient } from '@angular/common/http';
import { Component, input, inject, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'taon-github-stars',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './taon-github-stars.component.html',
  styleUrl: './taon-github-stars.component.scss',
})
export class TaonGithubStarsComponent implements OnInit {
  readonly repo = input.required<string>();
  readonly stars = signal<number | null>(null);

  private readonly http = inject(HttpClient);

  ngOnInit(): void {
    this.http
      .get<{
        stargazers_count: number;
      }>(`https://api.github.com/repos/${this.repo()}`)
      .subscribe({
        next: data => this.stars.set(data.stargazers_count),
      });
  }
}
