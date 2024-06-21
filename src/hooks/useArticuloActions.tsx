import { useState } from "react";
import { IArticuloInsumo, IArticuloManufacturado } from "../types/empresa";

export const useArticuloActions = () => {
	const [idArticuloSeleccionado, setIdArticuloSeleccionado] =
		useState<number>();
	const [articuloSeleccionado, setArticuloSeleccionado] = useState<
		IArticuloInsumo | IArticuloManufacturado | null
	>(null);
	const [showAlertBaja, setShowAlertBaja] = useState(false);
	const [showAlertAlta, setShowAlertAlta] = useState(false);
	const [showAlertAltaSucursal, setShowAlertAltaSucursal] = useState(false);
	const [showDetailsModal, setShowDetailsModal] = useState(false);

	const onShowAlertBaja = () => setShowAlertBaja(true);
	const onHideAlertBaja = () => setShowAlertBaja(false);
	const onShowAlertAlta = () => setShowAlertAlta(true);
	const onHideAlertAlta = () => setShowAlertAlta(false);
	const onShowAlertAltaSucursal = () => setShowAlertAltaSucursal(true);
	const onHideAlertAltaSucursal = () => setShowAlertAltaSucursal(false);
	const onShowDetailsModal = () => setShowDetailsModal(true);
	const onHideDetailsModal = () => setShowDetailsModal(false);

	const onDeleteClick = (articuloId: number) => {
		onShowAlertBaja();
		setIdArticuloSeleccionado(articuloId);
	};

	const onAltaClick = (articuloId: number) => {
		onShowAlertAlta();
		setIdArticuloSeleccionado(articuloId);
	};

	const onAltaSucursalClick = (articuloId: number) => {
		onShowAlertAltaSucursal();
		setIdArticuloSeleccionado(articuloId);
	};

	return {
		idArticuloSeleccionado,
		articuloSeleccionado,
		showAlertBaja,
		showAlertAlta,
		showAlertAltaSucursal,
		showDetailsModal,
		setIdArticuloSeleccionado,
		setArticuloSeleccionado,
		onHideAlertBaja,
		onHideAlertAlta,
		onHideAlertAltaSucursal,
		onShowDetailsModal,
		onHideDetailsModal,
		onDeleteClick,
		onAltaClick,
		onAltaSucursalClick,
	};
};
