import { Component, inject, PendingTasks, signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-task-list',
  imports: [FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  taskService = inject(TaskService);
  taskSignal = signal<Task[]>([]);
  newTitle = signal<string>("");
  newDescription = signal<string>("");



  ngOnInit(): void {
    this.taskService.getAll().subscribe((tasks) => {this.taskSignal.set(tasks)});

  }

  createTask(): void {

    this.taskService.create({title: this.newTitle(), description: this.newDescription(), completed: false})
    .subscribe((newTask) => {this.taskSignal.update(tasks => [...tasks, newTask])});
  }

  deleteTask(id: number): void {
    this.taskService.delete(id).subscribe(() => {this.taskSignal.update(tasks => tasks.filter(task => task.id !== id))});
  }

  toggleTask(task: Task): void {
    
    this.taskService.update(task.id, {...task, completed: !task.completed}).
    subscribe((updatedtask) => {this.taskSignal.update(tasks => tasks.map(t => (t.id == task.id) ? updatedtask : t ))});
  }


}
