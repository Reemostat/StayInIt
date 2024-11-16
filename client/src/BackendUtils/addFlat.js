import axios from "axios";

export async function addFlatImages(flatId, images, token) {
    try {
        const formData = new FormData();

        // Append each image to the FormData
        images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/flatadmin/add-images/${flatId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return {
            success: true,
            data: response.data.data,
            message: "Images added successfully!"
        };
    } catch (error) {
        console.error("Error in addFlatImages:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Error adding images"
        };
    }
}

export default async function addFlat(flat, token) {
    try {
        // First, add the flat without images
        const flatData = { ...flat };
        delete flatData.images;  // Remove images from the initial flat data

        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/flatadmin/add`,
            flatData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // If flat is added successfully and there are images, upload them
        if (response.data.success && flat.images && flat.images.length > 0) {
            const imageUploadResponse = await addFlatImages(response.data.data._id, flat.images, token);

            if (!imageUploadResponse.success) {
                console.error("Failed to upload images:", imageUploadResponse.error);
            }
        }

        return {
            success: true,
            data: response.data.data,
            message: "Flat added successfully!"
        };
    } catch (error) {
        console.error("Error in addFlat:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Error while adding flat"
        };
    }
}