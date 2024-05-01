import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

const extractPublicId = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop().split(".")[0];
  const publicId = parts.pop() + "/" + fileName;
  return publicId;
};

// GET /api/properties/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const property = await Property.findById(params.id);

    if (!property) {
      return new Response("Property not found", { status: 404 });
    }

    return new Response(JSON.stringify(property), { status: 200 });
  } catch (error) {
    console.error("Error fetching property:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/properties/:id
export const DELETE = async (request, { params }) => {
  try {
    const propertyId = params.id;

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    await connectDB();

    const property = await Property.findById(propertyId);

    if (!property) {
      return new Response("Property not found", { status: 404 });
    }

    if (property.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const deletionPromises = property.images.map((imageUrl) => {
      const publicId = extractPublicId(imageUrl);
      return cloudinary.uploader.destroy(publicId);
    });

    // Wait for all image deletion promises to resolve
    await Promise.all(deletionPromises);

    await property.deleteOne();

    return new Response("Property deleted", { status: 200 });
  } catch (error) {
    console.error("Error fetching property:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { id } = params;

    const { userId } = sessionUser;

    const formData = await request.formData();

    const amenities = formData.getAll("amenities");

    const existingProperty = await Property.findById(id);

    if (!existingProperty) {
      return new Response("Property does not exist", { status: 404 });
    }

    if (existingProperty.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: Number(formData.get("beds")),
      baths: Number(formData.get("baths")),
      square_feet: Number(formData.get("square_feet")),
      amenities,
      rates: {
        weekly: Number(formData.get("rates.weekly")),
        monthly: Number(formData.get("rates.monthly")),
        nightly: Number(formData.get("rates.nightly")),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
    };

    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData);

    return new Response(JSON.stringify(updatedProperty), { status: 200 });
  } catch (error) {
    return new Response("Failed to add property", { status: 500 });
  }
};
