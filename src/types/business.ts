import { TimeView } from "@mui/x-date-pickers/models";
import { ReactElement } from "react";

// El fields lo manejo como un arreglo de arreglo para tener campos que se ubiquen en una misma fila, 
// si hay dos IField en un mismo indice, iran en la misma fila.
export interface IStep {
    title: string;
	fields: IField[][];
}

//El options está en el caso de que sea un select
export interface IField {
	label: string;
	name: string;
	multiline?: boolean;
	type: "text" | "number" | "email" | "select" | "time" | "image" | "date";
	timeView?: TimeView[];
    options?: string[];
	icon?: ReactElement;
	required?: boolean;
}
