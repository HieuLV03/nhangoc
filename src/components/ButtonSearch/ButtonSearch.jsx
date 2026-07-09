import React, { useState } from "react";
import { Input } from "antd";
import "./ButtonSearch.css";

const ButtonSearch = ({
  placeholder = "Tìm kiếm...",
  textButton = "Tìm",
  size = "large",
  onSearch,
}) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const keyword = e.target.value;

    setValue(keyword);
    onSearch?.(keyword);
  };

  return (
    <div className="button-search-wrapper">
      <Input.Search
        value={value}
        placeholder={placeholder}
        enterButton={textButton}
        size={size}
        allowClear
        onChange={handleChange}
        onSearch={(value) => onSearch?.(value)}
      />
    </div>
  );
};

export default ButtonSearch;