import * as Yup from "yup";
import { FC } from "react";

import StoreIcon from '@mui/icons-material/Store';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FaceIcon from "@mui/icons-material/Face";
import SignpostIcon from '@mui/icons-material/Signpost';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import TagIcon from '@mui/icons-material/Tag';

import { GenericForm } from "../shared/GenericForm";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ISucursal } from "../../../types/empresa";
import { SucursalService } from "../../../services/SucursalService";
import { setSucursales } from "../../../redux/slices/Business";

interface SucursalFormProps {
	sucursal: ISucursal;
	onClose: Function;
}

export const SucursalForm: FC<SucursalFormProps> = ({ sucursal, onClose }) => {
	const dispatch = useAppDispatch();
	const empresa = useAppSelector((state) => state.selectedData.empresa);

	const initialValues = {
		...sucursal,
		cp: sucursal.domicilio ? sucursal.domicilio.cp : "",
		calle: sucursal.domicilio ? sucursal.domicilio.calle : "",
		numero: sucursal.domicilio ? sucursal.domicilio.numero : "",
		piso: sucursal.domicilio ? sucursal.domicilio.piso : "",
		nroDpto: sucursal.domicilio ? sucursal.domicilio.nroDpto : "",
	};

	let sucursalSchema = Yup.object().shape({
		nombre: Yup.string().trim().required("Este campo es requerido."),
		horarioApertura: Yup.string().required("Este campo es requerido."),
		horarioCierre: Yup.string().required("Este campo es requerido."),
		icon: Yup.string(),
		cp: Yup.number()
			.typeError("Este campo sólo puede tener números")
			.required("Este campo es requerido."),
		calle: Yup.string().required("Este campo es requerido."),
		numero: Yup.number()
			.typeError("Este campo sólo puede tener números")
			.required("Este campo es requerido."),
		piso: Yup.number()
			.typeError("Este campo sólo puede tener números"),
		nroDpto: Yup.number()
			.typeError("Este campo sólo puede tener números"),
	});

	const handleSubmitForm = async (values: { [key: string]: any }) => {
		try {
			const sucursalService = new SucursalService("/sucursales");
			const sucursal: ISucursal = {
				baja: false,
				nombre: values.nombre,
				horarioApertura: values.horarioApertura,
				horarioCierre: values.horarioCierre,
				icon: values.icon,
				domicilio: {
					baja: false,
					cp: values.cp,
					calle: values.calle,
					numero: values.numero,
					piso: values.piso,
					nroDpto: values.piso,
				},
			};

			if (values.id) {
				await sucursalService.update(values.id, sucursal);
			} else {
				await sucursalService.create(sucursal);
			}
			const sucursales = await sucursalService.getAll();
			dispatch(setSucursales(sucursales));
			onClose();
		} catch (error: any) {
			throw new Error(error);
		}
	};

	const fields = [
		[
			{ label: "Nombre", name: "nombre", icon: <StoreIcon /> },
			{
				label: "Horario de apertura",
				name: "horarioApertura",
				icon: <AccessTimeIcon />,
			},
			{
				label: "Horario de cierre",
				name: "horarioCierre",
				icon: <WatchLaterIcon/>,
			},
		],
		[{ label: "Logo", name: "icon", icon: <FaceIcon /> }],
		[
			{ label: "Calle", name: "calle", icon: <AddRoadIcon /> },
			{ label: "Numero", name: "numero", icon: <SignpostIcon /> },
		],
		[
			{ label: "Código postal", name: "cp", icon: <TagIcon /> },
			{ label: "Piso", name: "piso", icon: <LocationCityIcon /> },
			{ label: "Numero de departamento", name: "nroDpto", icon: <TagIcon /> },
		],
	];

	return (
		<GenericForm
			fields={fields}
			initialValues={initialValues}
			validationSchema={sucursalSchema}
			onSubmit={handleSubmitForm}
			submitButtonText={sucursal.id ? "Editar sucursal" : "Crear sucursal"}
		/>
	);
};
