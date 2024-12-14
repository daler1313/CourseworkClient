import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule, JsonPipe, RouterModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  productList: any[] = []; // Список продуктов
  productObj: any = {
    id: null,
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_path: null, // Здесь будет храниться изображение
  };

  private apiUrl = 'http://127.0.0.1:8000/api/products';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllProducts(); // Получение списка продуктов при загрузке компонента
  }

  // Метод для редактирования продукта
  onEdit(data: any) {
    this.productObj = { ...data };
  }

  // Метод для сохранения нового продукта
  onSave() {
    const formData = new FormData();
    formData.append('name', this.productObj.name);
    formData.append('description', this.productObj.description);
    formData.append('price', this.productObj.price);
    formData.append('category_id', this.productObj.category_id);
    
    // Добавляем файл изображения, если он выбран
    if (this.productObj.image_path) {
      formData.append('image_path', this.productObj.image_path, this.productObj.image_path.name);
    }

    // Отправляем данные на сервер с использованием FormData
    this.http.post(this.apiUrl, formData).subscribe(
      (res: any) => {
        if (res) {
          this.clearProductForm();
          this.getAllProducts();
        }
      },
      (error) => {
        console.error('Ошибка при сохранении продукта:', error);
      }
    );
  }

  // Метод для обновления существующего продукта
  onUpdate() {
    if (this.productObj.id === null) {
      alert("Выберите продукт для обновления!");
      return;
    }

    const formData = new FormData();
    formData.append('name', this.productObj.name);
    formData.append('description', this.productObj.description);
    formData.append('price', this.productObj.price);
    formData.append('category_id', this.productObj.category_id);
    
    // Добавляем файл изображения, если он выбран
    if (this.productObj.image_path) {
      formData.append('image_path', this.productObj.image_path, this.productObj.image_path.name);
    }

    // Отправляем обновленные данные на сервер с использованием FormData
    this.http.put(`${this.apiUrl}/${this.productObj.id}`, formData).subscribe(
      (res: any) => {
        if (res) {
          this.clearProductForm();
          this.getAllProducts();
        }
      },
      (error) => {
        console.error('Ошибка при обновлении продукта:', error);
      }
    );
  }

  // Метод для удаления продукта
  onDelete(id: number) {
    const isDelete = confirm("Вы уверены, что хотите удалить?");
    if (isDelete) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(
        () => {
          this.getAllProducts();
        },
        (error) => {
          console.error('Ошибка при удалении продукта:', error);
        }
      );
    }
  }

  // Метод для получения списка продуктов
  getAllProducts() {
    this.http.get(this.apiUrl).subscribe(
      (res: any) => {
        this.productList = res;
      },
      (error) => {
        console.error('Ошибка при получении продуктов:', error);
      }
    );
  }

  // Метод для очистки формы
  clearProductForm() {
    this.productObj = {
      id: null,
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_path: null, // Обнуляем изображение
    };
  }

  // Метод для обработки выбора файла
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productObj.image_path = file;
    }
  }

  onCreateExcel() {
    // Создаем новый объект книги Excel
    const worksheet = XLSX.utils.json_to_sheet(this.productList); // Преобразуем массив объектов в лист Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Продукты');

    // Генерируем файл Excel
    XLSX.writeFile(workbook, 'Products.xlsx'); // Скачиваем файл с именем 'Products.xlsx'
}

}
