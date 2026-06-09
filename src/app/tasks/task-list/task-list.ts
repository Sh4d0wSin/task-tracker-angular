import { Component, inject,signal } from '@angular/core';
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
  isLoading = signal(true);
  hasError = signal(false);
  editingTaskId = signal<number | null>(null);
  editTitle = signal<string>('');
  editDescription = signal<string>('');
  isSubmitting = signal(false);



  ngOnInit(): void {
    this.taskService.getAll().subscribe((tasks) => {this.taskSignal.set(tasks); this.isLoading.set(false)}, (error) => {this.isLoading.set(false); this.hasError.set(true)});

  }

  createTask(): void {
    this.isSubmitting.set(true);
    this.taskService.create({title: this.newTitle(), description: this.newDescription(), completed: false})
    .subscribe((newTask) => {this.taskSignal.update(tasks => [...tasks, newTask]); this.isSubmitting.set(false)});
  }

  deleteTask(id: number): void {
    this.isSubmitting.set(true);
    this.taskService.delete(id).subscribe(() => {this.taskSignal.update(tasks => tasks.filter(task => task.id !== id)); this.isSubmitting.set(false)});
  }

  toggleTask(task: Task): void {
    this.isSubmitting.set(true);
    this.taskService.update(task.id, {...task, completed: !task.completed}).
    subscribe((updatedtask) => {this.taskSignal.update(tasks => tasks.map(t => (t.id == task.id) ? updatedtask : t )); this.isSubmitting.set(false)});
  }

  startEdit(task: Task) : void {
    this.editingTaskId.set(task.id);
    this.editDescription.set(task.description);
    this.editTitle.set(task.title);
  }

  cancelEdit(): void {
    this.editingTaskId.set(null);
  }

  saveEdit(task: Task) : void {
    this.isSubmitting.set(true);
    this.taskService.update(task.id, { ...task, title: this.editTitle(), description: this.editDescription()}).
    subscribe((editedTask) => {this.taskSignal.update(tasks => tasks.map(t => (t.id == task.id) ? editedTask : t)); this.cancelEdit();  this.isSubmitting.set(false)});
  }


}
