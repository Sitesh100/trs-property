import Image from 'next/image';
import React from 'react';

function PropertySearchReadyProjects({ readyToMoveProjects }) {

    return (
        <>
            <div className="py-5">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">Ready to move projects</h2>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {readyToMoveProjects.map((project, index) => (
                            <div key={index} className="bg-white text-black rounded-xl overflow-hidden flex items-center p-2">
                                <div className="relative">
                                    <Image src={project.image || "/placeholder.svg"} alt={project.name} width={60} height={60}
                                        className="object-cover w-16 h-16 rounded-xl" />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-sm">{project.name}</h3>
                                    <p className="text-xs text-gray-400">{project.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
}

export default PropertySearchReadyProjects;


