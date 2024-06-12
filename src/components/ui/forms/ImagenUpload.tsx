import { FC, useState } from "react";
import {
	Button,
	IconButton,
	Stack,
	TextField,
	Typography,
	styled,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { ErrorTypography, TextFieldStack } from "../styled/StyledForm";

interface ImageUploadProps {
	imagenes: string[];
	onBack: () => void;
	onChangeImages: (
		selectedFiles: FileList | null,
		selectedPreviews: string[]
	) => void;
	onNext: () => void;
	multiple?: boolean;
}

const RemoveButton = styled(IconButton)(({ theme }) => ({
	position: "absolute",
	bottom: "14%",
	right: "42%",
	backgroundColor: theme.palette.primary.main,
}));

const ImageUpload: FC<ImageUploadProps> = ({
	imagenes,
	onBack,
	onNext,
	onChangeImages,
	multiple,
}) => {
	const [error, setError] = useState("");
	const [images, setImages] = useState<string[]>(imagenes);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const filesArray = Array.from(event.target.files).map((file) =>
				URL.createObjectURL(file)
			);
			setImages((prevImages) => prevImages.concat(filesArray));
			onChangeImages(event.target.files, images.concat(filesArray));
			setError("");
		}
	};

	const handleRemoveImage = (index: number) => {
		setImages(images.filter((_, i) => i !== index));
		onChangeImages(
			null,
			images.filter((_, i) => i !== index)
		);
	};

	const handleSubmit = () => {
		if (images.length == 0) {
			setError("Debes ingresar una imagen.");
		} else {
			onNext();
		}
	};

	return (
		<Stack width="80%" spacing={2} alignItems="center">
			<TextFieldStack spacing={1}>
				<Typography>
					Imagen:<span style={{ color: "red" }}> *</span>
				</Typography>
				<TextField
					variant="outlined"
					type="file"
					fullWidth
					onChange={handleImageChange}
					inputProps={{
						multiple: multiple ?? true,
					}}
				/>
			</TextFieldStack>
			{error && <ErrorTypography>{error}</ErrorTypography>}
			{images.length > 0 && (
				<Stack width="30%">
					<Carousel autoPlay={true} showThumbs={false}>
						{images.map((image, index) => (
							<>
								<Stack key={index} spacing={2} width="100%" height="220px">
									<img
										src={image}
										alt={`Preview ${index + 1}`}
										style={{
											height: "180px",
											width: "100%",
											objectFit: "contain",
										}}
									/>
									<RemoveButton
										onClick={() => handleRemoveImage(index)}
										size="small"
									>
										<DeleteIcon fontSize="small" />
									</RemoveButton>
								</Stack>
							</>
						))}
					</Carousel>
				</Stack>
			)}
			<Stack direction="row" spacing={2} width="100%">
				<Button
					variant="outlined"
					sx={{ py: 1, px: 4, textTransform: "uppercase" }}
					onClick={onBack}
				>
					Volver
				</Button>
				<Button
					variant="contained"
					type="submit"
					fullWidth
					sx={{ py: 1.5, px: 4, textTransform: "uppercase" }}
					onClick={(_event) => handleSubmit()}
				>
					Siguiente
				</Button>
			</Stack>
		</Stack>
	);
};

export default ImageUpload;
