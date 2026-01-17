"use client";
import { X } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    LinkedinIcon,
    EmailIcon,
} from "react-share";

const PropertyDetailSocialModal = ({ property, showShareModal  , setShowShareModal}) => {

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const title = `${property?.title} - ${property?.city}`;

    return (
        <>
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Share this property</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-5 gap-4">
                            <FacebookShareButton url={shareUrl} quote={title}>
                                <FacebookIcon size={40} round />
                            </FacebookShareButton>

                            <TwitterShareButton url={shareUrl} title={title}>
                                <TwitterIcon size={40} round />
                            </TwitterShareButton>

                            <WhatsappShareButton url={shareUrl} title={title}>
                                <WhatsappIcon size={40} round />
                            </WhatsappShareButton>

                            <LinkedinShareButton url={shareUrl} title={title}>
                                <LinkedinIcon size={40} round />
                            </LinkedinShareButton>

                            <EmailShareButton url={shareUrl} subject={title}>
                                <EmailIcon size={40} round />
                            </EmailShareButton>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center border rounded-lg overflow-hidden">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 px-3 py-2 outline-none text-black"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(shareUrl);
                                        toast.success("Link copied to clipboard!");
                                    }}
                                    className="bg-[#1a1333] text-white px-4 py-2 cursor-pointer"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PropertyDetailSocialModal

