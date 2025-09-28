import React from 'react';
import Image from 'next/image';

interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
}

interface HomeSectionsProps {
  sections: HomeSection[];
}

const HomeSections: React.FC<HomeSectionsProps> = ({ sections }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={section.imageUrl}
                alt={section.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{section.title}</h3>
              <p className="text-gray-600 mb-4">{section.subtitle}</p>
              <a
                href={section.buttonLink}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                {section.buttonText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSections;