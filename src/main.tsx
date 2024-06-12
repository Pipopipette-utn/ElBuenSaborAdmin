import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./styles/theme.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import "./main.css";
import { Auth0ProviderWithNavigate } from "./components/auth0/Auth0ProviderWithNavigate.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					<Auth0ProviderWithNavigate>
						<App />
					</Auth0ProviderWithNavigate>
				</ThemeProvider>
			</Provider>
		</BrowserRouter>
	</React.StrictMode>
);
