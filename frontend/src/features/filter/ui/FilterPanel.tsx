'use client';

import { useState } from 'react';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  minPrice: string;
  maxPrice: string;
  category: string;
  condition: string;
  sortBy: string;
}

const categories = ['Все', 'Электроника', 'Одежда', 'Книги', 'Спорт'];
const conditions = ['Все', 'Новое', 'Как новое', 'Б/у'];
const sortOptions = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'price_asc', label: 'По возрастанию цены' },
  { value: 'price_desc', label: 'По убыванию цены' }
];

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minPrice: '',
    maxPrice: '',
    category: 'Все',
    condition: 'Все',
    sortBy: 'newest'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      search: '',
      minPrice: '',
      maxPrice: '',
      category: 'Все',
      condition: 'Все',
      sortBy: 'newest'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <Input
        label="Поиск"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Поиск товаров..."
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Мин. цена"
          name="minPrice"
          type="number"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="0"
        />
        <Input
          label="Макс. цена"
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="1000000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black-700 mb-1">
          Категория
        </label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-black-700 mb-1">
          Состояние
        </label>
        <select
          name="condition"
          value={filters.condition}
          onChange={handleChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {conditions.map(condition => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-black-700 mb-1">
          Сортировка
        </label>
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        variant="outline"
        onClick={handleReset}
        className="w-full"
      >
        Сбросить фильтры
      </Button>
    </div>
  );
} 