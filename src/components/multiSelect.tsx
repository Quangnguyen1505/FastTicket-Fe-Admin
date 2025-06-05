import React from 'react';
import Select, { components, type MultiValue } from 'react-select';

import type { OptionProps } from 'react-select';

const CheckboxOption = (props: OptionProps<{ value: string; label: string }, true>) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null} // tránh lỗi warning
        style={{ marginRight: 8 }}
      />
      <label>{props.label}</label>
    </components.Option>
  );
};

const MovieMultiSelect = ({
  movies,
  selectedMovieIds,
  setSelectedMovieIds,
}: {
  movies: { id: string; movie_title: string }[];
  selectedMovieIds: string[];
  setSelectedMovieIds: (ids: string[]) => void;
}) => {
  const options = movies.map((movie) => ({
    value: movie.id,
    label: movie.movie_title,
  }));

  // Sửa đúng kiểu tham số onChange
  const handleChange = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    const ids = newValue.map((opt) => opt.value);
    setSelectedMovieIds(ids);
 };

  const selectedOptions = options.filter((opt) => selectedMovieIds.includes(opt.value));

  return (
    <Select
      options={options}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{ Option: CheckboxOption }}
      onChange={handleChange}
      value={selectedOptions}
      placeholder="Chọn phim..."
    />
  );
};

export default MovieMultiSelect;
