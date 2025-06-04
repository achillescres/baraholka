import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '../FilterPanel';

describe('FilterPanel', () => {
  const mockOnFilterChange = jest.fn();
  const defaultProps = {
    onFilterChange: mockOnFilterChange,
    filters: {
      search: '',
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен отображать все поля фильтрации', () => {
    render(<FilterPanel {...defaultProps} />);

    expect(screen.getByPlaceholderText('Поиск по названию')).toBeInTheDocument();
    expect(screen.getByLabelText('Категория')).toBeInTheDocument();
    expect(screen.getByLabelText('Состояние')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('От')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('До')).toBeInTheDocument();
    expect(screen.getByLabelText('Сортировка')).toBeInTheDocument();
  });

  it('должен вызывать onFilterChange при изменении поиска', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Поиск по названию');
    fireEvent.change(searchInput, { target: { value: 'телефон' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      search: 'телефон'
    });
  });

  it('должен вызывать onFilterChange при изменении категории', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const categorySelect = screen.getByLabelText('Категория');
    fireEvent.change(categorySelect, { target: { value: 'Электроника' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      category: 'Электроника'
    });
  });

  it('должен вызывать onFilterChange при изменении цены', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const minPriceInput = screen.getByPlaceholderText('От');
    const maxPriceInput = screen.getByPlaceholderText('До');

    fireEvent.change(minPriceInput, { target: { value: '1000' } });
    fireEvent.change(maxPriceInput, { target: { value: '5000' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      minPrice: '1000',
      maxPrice: '5000'
    });
  });

  it('должен вызывать onFilterChange при изменении сортировки', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const sortSelect = screen.getByLabelText('Сортировка');
    fireEvent.change(sortSelect, { target: { value: 'price_asc' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      sortBy: 'price_asc'
    });
  });
}); 