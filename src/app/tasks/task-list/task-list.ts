import { Component, inject, signal, computed } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskItem } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  imports: [FormsModule, TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  taskService = inject(TaskService);
  taskSignal = signal<Task[]>([]);
  newTitle = signal<string>('');
  newDescription = signal<string>('');
  isLoading = signal(true);
  hasError = signal(false);
  isSubmitting = signal(false);
  countdowns = signal<Record<number, number>>({});
  private timers: Record<number, ReturnType<typeof setInterval>> = {};

  completedCount = computed(() => this.taskSignal().filter(t => t.completed).length);
  totalCount = computed(() => this.taskSignal().length);

  ngOnInit(): void {
    this.taskService.getAll().subscribe(
      (tasks) => { this.taskSignal.set(tasks); this.isLoading.set(false); },
      (_error) => { this.isLoading.set(false); this.hasError.set(true); }
    );
  }

  createTask(): void {
    this.isSubmitting.set(true);
    this.taskService.create({ title: this.newTitle(), description: this.newDescription(), completed: false })
      .subscribe((newTask) => { this.taskSignal.update(tasks => [...tasks, newTask]); this.isSubmitting.set(false); });
  }

  deleteTask(id: number): void {
    this.isSubmitting.set(true);
    this.taskService.delete(id).subscribe(() => {
      this.taskSignal.update(tasks => tasks.filter(task => task.id !== id));
      this.isSubmitting.set(false);
      this.clearCountdown(id);
    });
  }

  toggleTask(task: Task): void {
    this.isSubmitting.set(true);
    this.taskService.update(task.id, { ...task, completed: !task.completed })
      .subscribe((updatedTask) => {
        this.taskSignal.update(tasks => tasks.map(t => t.id === task.id ? updatedTask : t));
        this.isSubmitting.set(false);
        if (!task.completed) { this.startCountdown(updatedTask.id); } else { this.clearCountdown(updatedTask.id); }
      });
  }

  onSaveEdit(event: { task: Task; title: string; description: string }): void {
    this.isSubmitting.set(true);
    this.taskService.update(event.task.id, { ...event.task, title: event.title, description: event.description })
      .subscribe((editedTask) => {
        this.taskSignal.update(tasks => tasks.map(t => t.id === event.task.id ? editedTask : t));
        this.isSubmitting.set(false);
      });
  }

  startCountdown(taskId: number): void {
    this.countdowns.update(c => ({ ...c, [taskId]: 10 }));
    this.timers[taskId] = setInterval(() => {
      this.countdowns.update(c => ({ ...c, [taskId]: c[taskId] - 1 }));
      if (this.countdowns()[taskId] === 0) {
        this.deleteTask(taskId);
        clearInterval(this.timers[taskId]);
      }
    }, 1000);
  }

  clearCountdown(taskId: number): void {
    clearInterval(this.timers[taskId]);
    this.countdowns.update(c => { const { [taskId]: _, ...rest } = c; return rest; });
  }
}
