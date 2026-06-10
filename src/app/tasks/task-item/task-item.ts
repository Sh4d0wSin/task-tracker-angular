import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { Task } from '../../models/task';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  imports: [FormsModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  @Input() task!: Task;
  @Input() isSubmitting!: boolean;
  @Input() countdowns!: Record<number, number>;

  @Output() deleteTask = new EventEmitter<number>();
  @Output() toggleTask = new EventEmitter<Task>();
  @Output() saveEdit = new EventEmitter<{ task: Task; title: string; description: string }>();

  isEditing = signal(false);
  editTitle = signal('');
  editDescription = signal('');

  startEdit(): void {
    this.isEditing.set(true);
    this.editTitle.set(this.task.title);
    this.editDescription.set(this.task.description);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  onSaveEdit(): void {
    this.saveEdit.emit({ task: this.task, title: this.editTitle(), description: this.editDescription() });
    this.isEditing.set(false);
  }
}
