import React, { useRef, useState } from "react";
import { Input } from "antd";
import "./ButtonSearch.css";

const ButtonSearch = ({
  placeholder = "Tìm kiếm...",
  textButton = "Tìm",
  size = "large",
  onSearch,
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const keyword = e.target.value;
    setValue(keyword);
    onSearch?.(keyword);
  };

  const handleSearch = (keyword) => {
    onSearch?.(keyword);

    // Ẩn bàn phím trên điện thoại
    inputRef.current?.input?.blur();
  };

  return (
    <div className="button-search-wrapper">
      <Input.Search
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        enterButton={textButton}
        size={size}
        allowClear
        onChange={handleChange}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ButtonSearch;