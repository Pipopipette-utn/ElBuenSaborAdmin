import { FC } from "react";
import { IArticulo } from "../../../types/empresa";
import {
	ArticuloInsumoCard,
	ArticuloInsumoCardHeader,
	ArticuloInsumoCardMedia,
} from "../../ui/styled/StyledCard";

interface ArticuloCardProps {
	articulo: IArticulo;
	onSelectArticulo: (i: IArticulo) => void;
}

export const ArticuloCard: FC<ArticuloCardProps> = ({
	articulo,
	onSelectArticulo,
}) => {
	return (
		<ArticuloInsumoCard onClick={() => onSelectArticulo(articulo)}>
			<ArticuloInsumoCardHeader
				title={articulo.denominacion}
				subheader={
					"stockActual" in articulo && `Stock actual:${articulo.stockActual}`
				}
			/>
			{articulo.imagenes &&
				articulo.imagenes.length > 0 &&
				articulo.imagenes[0].url != "" && (
					<ArticuloInsumoCardMedia
						component="img"
						image={articulo.imagenes[0].url}
					/>
				)}
		</ArticuloInsumoCard>
	);
};
