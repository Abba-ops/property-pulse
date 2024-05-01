"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import { fetchProperty } from "@/utils/requests";
import PropertyDetails from "@/components/PropertyDetails";
import Spinner from "@/components/Spinner";
import PropertyImages from "@/components/PropertyImages";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButtons from "@/components/ShareButtons";
import PropertyContactForm from "@/components/PropertyContactForm";

export default function PropertyPage() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;

      try {
        const property = await fetchProperty(id);
        setProperty(property);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch property data only if property is null
    if (property === null) {
      fetchPropertyData();
    }
  }, [id, property]);

  // Display a message if property is not found
  if (!property && !loading) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }

  return (
    <>
      {/* Display spinner while loading */}
      {loading && <Spinner loading={loading} />}

      {/* Display property details if not loading and property exists */}
      {!loading && property && (
        <>
          <PropertyHeaderImage image={property.images[0]} />

          {/* Back to Properties link */}
          <section>
            <div className="container m-auto py-6 px-6">
              <Link
                href="/properties"
                className="text-blue-500 hover:text-blue-600 flex items-center">
                <FaArrowLeft className="mr-2" /> Back to Properties
              </Link>
            </div>
          </section>

          {/* Main content section */}
          <section className="bg-blue-50">
            <div className="container m-auto py-10 px-6">
              <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
                {/* Property details */}
                <PropertyDetails property={property} />

                {/* Sidebar */}
                <aside className="space-y-4">
                  {/* Bookmark button */}
                  <BookmarkButton property={property} />

                  {/* Share button */}
                  <ShareButtons property={property} />
                  {/* Contact Form */}
                  <PropertyContactForm property={property} />
                </aside>
              </div>
            </div>
          </section>
          <PropertyImages images={property.images} />
        </>
      )}
    </>
  );
}
