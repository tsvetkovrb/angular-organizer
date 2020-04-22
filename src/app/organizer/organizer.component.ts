import { Component, OnInit } from '@angular/core';
import { DateService } from '../shared/date.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TasksService, Task } from '../shared/tasks.servise';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit {
  form: FormGroup;
  tasks: Task[] = [];

  constructor(
    public dateService: DateService,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    this.dateService.date
      .pipe(switchMap((value) => this.tasksService.load(value)))
      .subscribe((tasks) => {
        this.tasks = tasks;
      });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }

  submit() {
    const { title } = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
    };

    this.tasksService.create(task).subscribe(
      (responseTask) => {
        this.tasks.push(responseTask);
        this.form.reset();
      },
      (error) => console.error(error)
    );
  }

  remove(task: Task) {
    this.tasksService.remove(task).subscribe(
      () => this.tasks = this.tasks.filter((t) => t.id !== task.id),
      (error) => console.log(error)
    );
  }
}
