import { FC } from "react";
import { IEmpresa } from "../../../types/empresa";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch } from "../../../redux/hooks";
import { setEmpresa } from "../../../redux/slices/Business";
import {
	Card,
	CardActions,
	CardHeader,
	CardMedia,
	IconButton,
} from "../../ui/styled/StyledCard";
import { useNavigate } from "react-router-dom";

interface EmpresaCardProps {
	empresa: IEmpresa;
}

const EmpresaCard: FC<EmpresaCardProps> = ({ empresa }) => {
	// Obtención del despachador de acciones de Redux
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleClick = () => {
		dispatch(setEmpresa(empresa));
		navigate("/empresas/sucursales")
	};

	return (
		<Card onClick={handleClick}>
			<CardHeader title={empresa.nombre} subheader={empresa.razonSocial} />
			<CardMedia component="img" image={empresa.icon} />
			<CardActions>
				<IconButton>
					<ModeEditIcon />
				</IconButton>
				<IconButton>
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
};

export default EmpresaCard;
