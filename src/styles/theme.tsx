import { PaletteColor, PaletteColorOptions, createTheme } from "@mui/material";
import { background, info, primary, secondary } from "./palette";
import { light } from "@mui/material/styles/createPalette";

declare module "@mui/material/styles" {
	interface BreakpointOverrides {
		mobile: true;
		xs: true;
		sm: true;
		md: true;
		lg: true;
		xl: true;
		xxl: true;
	}

	interface Palette {
		bg: PaletteColor;
	}

	interface PaletteOptions {
		bg: PaletteColorOptions;
	}
}

export const theme = createTheme({
	palette: {
		primary: primary,
		secondary: secondary,
		info: info,
		bg: background,
	},
	components: {
		MuiButton: {
			defaultProps: {
				disableRipple: true,
			},
			styleOverrides: {
				root: {
					textTransform: "none",
				},
				contained: {
					backgroundColor: primary.main,
					color: "#ffffff",
				},
				text: {
					fontWeight: "lighter",
					color: "#ffffff",
					"&:focus": {
						outline: "0px",
					},
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					border: "1px solid",
					borderRadius: "50px",
				},
			}
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					backgroundColor: background.main,
					color: info.main,
					fontWeight: "bold",
					borderRadius: "10px",
					"&:hover": {
						backgroundColor: background.gray,
						color: background.light,
					},
					"&:active": {
						backgroundColor: primary.main,
						color: background.light,
					},
					"&:hover svg, &:active svg": {
						color: background.light,
					},
				},
			},
		},
		MuiLink:{
			styleOverrides: {
				root:{
					color: background.light,
					"&:hover, &:active": {
						color: background.light,
					},
				}
			}
		}
	},
	typography: {
		fontFamily: "Roboto, sans-serif",
		h5: {
			fontWeight: "bolder",
		},
	},
	breakpoints: {
		values: {
			mobile: 0,
			xs: 500,
			sm: 750,
			md: 850,
			lg: 1000,
			xl: 1200,
			xxl: 1536,
		},
	},
});
