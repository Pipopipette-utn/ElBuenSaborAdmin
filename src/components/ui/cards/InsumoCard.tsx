import { FC } from "react";
import { IArticuloInsumo } from "../../../types/empresa";
import {
	ArticuloInsumoCard,
	ArticuloInsumoCardHeader,
	ArticuloInsumoCardMedia,
} from "../../ui/styled/StyledCard";

interface InsumoCardProps {
	insumo: IArticuloInsumo;
	onSelectInsumo: (i: IArticuloInsumo) => void;
}

export const InsumoCard: FC<InsumoCardProps> = ({ insumo, onSelectInsumo }) => {
	return (
		<ArticuloInsumoCard onClick={() => onSelectInsumo(insumo)}>
			<ArticuloInsumoCardHeader
				title={insumo.denominacion}
				subheader={`Stock actual:${insumo.stockActual}`}
			/>
			<ArticuloInsumoCardMedia
				component="img"
				image={
					insumo.imagenes &&
					insumo.imagenes.length > 0 &&
					insumo.imagenes[0].url != ""
						? insumo.imagenes[0].url
						: `https://via.placeholder.com/150/FCFCFC/FF4F33?text=${insumo.denominacion.charAt(
								0
						  )}`
				}
			/>
		</ArticuloInsumoCard>
	);
};
