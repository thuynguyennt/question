import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  public name: string = " ";
  public questionList: any = [];
  public points: number = 0;
  currentQuestion: number = 0;
  counter: number = 60;
  interval$: any;
  correctQuestion: number = 0;
  incorrectQuestion: number = 0;
  progress: string = "0";
  isCompleted: Boolean = false;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestion();
    this.startCounter()
  }

  getAllQuestion() {
    this.questionService.getListQuestion()
    .subscribe(res => {
      this.questionList = res.questions
    })
  }

  nextQuestion() {
    return this.currentQuestion ++;
  }

  prevQuestion() {
    return this.currentQuestion --;
  }

  answer(currenQue:number, option:any) {
    if(currenQue === this.questionList.length) {
      this.isCompleted = true;
    }
    if(option.correct) {
      this.points += 10;
      this.correctQuestion ++;
      setTimeout(() => {
        this.currentQuestion ++;
        this.progressbar();
      }, 1000)
      
    } else {
      this.points -= 10;
      this.incorrectQuestion ++;
      setTimeout(() => {
        this.currentQuestion ++;
        this.progressbar();
      }, 1000)
    }
  }

  startCounter() {
    this.interval$ = interval(1000)
    .subscribe( val => {
      this.counter --;
      if(this.counter === 0) {
        this.currentQuestion ++;
        this.counter = 60;
        this.points -= 10;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000)
  }

  stopCounter() {
    this.interval$.unsubscribe();
  }

  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  resetQuiz() {
    this.resetCounter();
    this.points = 0;
  }

  progressbar() {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
    return this.progress;
  }

}
