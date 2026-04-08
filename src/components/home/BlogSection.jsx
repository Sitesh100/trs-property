"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// Dummy blog data
const blogPosts = [
  {
    id: 1,
    title: "Commercial Space Growth Drivers, Opportunities & Challenges",
    image: "/assets/images/project/project1.webp",
    date: "Jan 2",
    views: 2,
    likes: 0,
    isLiked: false,
    slug: "commercial-space-growth"
  },
  {
    id: 2,
    title: "Exploring the Surge in India's Real Estate Market",
    image: "/assets/images/project/project2.webp",
    date: "Dec 26, 2025",
    views: 1,
    likes: 1,
    isLiked: true,
    slug: "surge-india-real-estate"
  },
  {
    id: 3,
    title: "Fractional ownership in real estate: How it works",
    image: "/assets/images/project/project3.webp",
    date: "May 23, 2025",
    views: 0,
    likes: 0,
    isLiked: false,
    slug: "fractional-ownership"
  },
  {
    id: 4,
    title: "Top reasons why homebuyers are considering smart homes",
    image: "/assets/images/project/project1.webp",
    date: "May 23, 2025",
    views: 2,
    likes: 0,
    isLiked: false,
    slug: "smart-homes-reasons"
  },
  {
    id: 5,
    title: "Real Estate Investment Tips for First-Time Buyers",
    image: "/assets/images/project/project2.webp",
    date: "Apr 15, 2025",
    views: 5,
    likes: 2,
    isLiked: false,
    slug: "investment-tips-buyers"
  },
  {
    id: 6,
    title: "Understanding Property Valuation Methods in 2025",
    image: "/assets/images/project/project3.webp",
    date: "Mar 10, 2025",
    views: 3,
    likes: 1,
    isLiked: false,
    slug: "property-valuation-methods"
  },
  {
    id: 7,
    title: "The Future of Sustainable Housing Development",
    image: "/assets/images/project/project1.webp",
    date: "Feb 28, 2025",
    views: 4,
    likes: 3,
    isLiked: true,
    slug: "sustainable-housing"
  },
  {
    id: 8,
    title: "How to Choose the Right Neighborhood for Your Family",
    image: "/assets/images/project/project2.webp",
    date: "Feb 14, 2025",
    views: 6,
    likes: 2,
    isLiked: false,
    slug: "right-neighborhood-family"
  },
]

const ITEMS_PER_PAGE = 4

const BlogSection = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [likedPosts, setLikedPosts] = useState(
    blogPosts.reduce((acc, post) => ({ ...acc, [post.id]: post.isLiked }), {})
  )

  const totalPages = Math.ceil(blogPosts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentPosts = blogPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#212121] via-[#212121] to-[#212121] relative overflow-hidden">
      {/* Background decorative elements - subtle purple */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#212121]/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#212121]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#212121]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5EFE7] tracking-wide">
            TRS ADVICE & INSIGHTS
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#212121] to-[#C6A256] mx-auto mt-4"></div>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          key={currentPage}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {currentPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              className="group"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#212121] cursor-pointer">
                  {/* Image */}
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/90 via-[#212121]/40 to-transparent"></div>
                  
                  {/* Date Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-[#212121]/80 backdrop-blur-sm text-[#F5EFE7] text-xs font-medium rounded-md border border-[#F5EFE7]/10">
                      {post.date}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {/* Title */}
                    <h3 className="text-[#F5EFE7] font-medium text-sm md:text-base leading-tight mb-3 line-clamp-2 group-hover:text-[#C6A256] transition-colors duration-300">
                      {post.title}
                    </h3>
                    
                    {/* Divider */}
                    <div className="w-full h-px bg-[#F5EFE7]/20 mb-3"></div>
                    
                    {/* Footer - Views and Likes */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#F5EFE7]/60">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">{post.views}</span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleLike(post.id)
                        }}
                        className="flex items-center gap-1.5 transition-colors duration-200"
                      >
                        {post.likes > 0 && (
                          <span className={`text-xs ${likedPosts[post.id] ? 'text-[#C6A256]' : 'text-[#F5EFE7]/60'}`}>
                            {post.likes}
                          </span>
                        )}
                        <Heart 
                          className={`w-4 h-4 transition-colors duration-200 ${
                            likedPosts[post.id] 
                              ? 'text-[#C6A256] fill-[#C6A256]' 
                              : 'text-[#F5EFE7]/60 hover:text-[#C6A256]'
                          }`} 
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: false }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-full border border-[#F5EFE7]/20 flex items-center justify-center transition-all duration-300 ${
              currentPage === 1 
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:border-[#C6A256] hover:text-[#C6A256] text-[#F5EFE7]/60'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-[#C6A256] text-[#212121]'
                    : 'text-[#F5EFE7]/60 hover:text-[#F5EFE7]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-full border border-[#F5EFE7]/20 flex items-center justify-center transition-all duration-300 ${
              currentPage === totalPages 
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:border-[#C6A256] hover:text-[#C6A256] text-[#F5EFE7]/60'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default BlogSection