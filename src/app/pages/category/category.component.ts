import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, CommonModule, JsonPipe, RouterModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  categoryList: any[] = []; // Список категорий
  categoryObj: any = {
    id: null,
    name: '',
    description: ''
  };

  // Базовый URL API
  private apiUrl = 'http://127.0.0.1:8000/api/categories';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllCategories(); // Получение списка категорий при загрузке компонента
  }

  // Метод для редактирования категории
  onEdit(data: any) {
    this.categoryObj = { ...data };
  }

  // Метод для сохранения новой категории
  onSave() {
    this.http.post(this.apiUrl, this.categoryObj).subscribe(
      (res: any) => {
        if (res) {
          this.clearCategoryForm();
          this.getAllCategories();
        }
      },
      (error) => {
        console.error('Ошибка при сохранении категории:', error);
      }
    );
  }

  // Метод для обновления существующей категории
  onUpdate() {
    if (this.categoryObj.id === null) {
      alert("Выберите категорию для обновления!");
      return;
    }

    this.http.put(`${this.apiUrl}/${this.categoryObj.id}`, this.categoryObj).subscribe(
      (res: any) => {
        if (res) {
          this.clearCategoryForm();
          this.getAllCategories();
        }
      },
      (error) => {
        console.error('Ошибка при обновлении категории:', error);
      }
    );
  }

  // Метод для удаления категории
  onDelete(id: number) {
    const isDelete = confirm("Вы уверены, что хотите удалить?");
    if (isDelete) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(
        () => {
          this.getAllCategories();
        },
        (error) => {
          console.error('Ошибка при удалении категории:', error);
        }
      );
    }
  }

  // Метод для получения списка категорий
  getAllCategories() {
    this.http.get(this.apiUrl).subscribe(
      (res: any) => {
        this.categoryList = res;
      },
      (error) => {
        console.error('Ошибка при получении категорий:', error);
      }
    );
  }

  // Метод для очистки формы
  clearCategoryForm() {
    this.categoryObj = {
      id: null,
      name: '',
      description: ''
    };
  }
}
