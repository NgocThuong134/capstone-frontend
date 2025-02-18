import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import Store from "./redux/store";

// Tạo root từ phần tử DOM
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Render ứng dụng
root.render(
  <Provider store={Store}>
    <App />
  </Provider>
);

// Gọi reportWebVitals
reportWebVitals();