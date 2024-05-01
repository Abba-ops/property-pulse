import Image from "next/image";
import React from "react";
import { Gallery, Item } from "react-photoswipe-gallery";

export default function PropertyImages({ images }) {
  return (
    <Gallery>
      <section className="bg-blue-50 p-4">
        <div className="container mx-auto">
          {images.length === 1 ? (
            <Item
              original={images[0]}
              thumbnail={images[0]}
              width="1000"
              height="600">
              {({ ref, open }) => (
                <Image
                  alt=""
                  ref={ref}
                  width={1800}
                  height={400}
                  onClick={open}
                  src={images[0]}
                  priority={true}
                  className="object-cover h-[400px] mx-auto rounded-xl"
                />
              )}
            </Item>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`
                  ${
                    images.length === 3 && index === 2
                      ? "col-span-2"
                      : "col-span-1"
                  }
                `}>
                  <Item
                    original={image}
                    thumbnail={image}
                    width="1000"
                    height="600">
                    {({ ref, open }) => (
                      <Image
                        alt=""
                        ref={ref}
                        width={0}
                        height={0}
                        src={image}
                        sizes="100vw"
                        onClick={open}
                        priority={true}
                        className="object-cover h-[400px] w-full rounded-xl"
                      />
                    )}
                  </Item>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Gallery>
  );
}
