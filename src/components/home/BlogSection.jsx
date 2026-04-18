"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetBlogsQuery } from "@/service/blogApi"
import Link from "next/link"

const ITEMS_PER_PAGE = 4

const stripHtml = (text = "") => text.replace(/<[^>]+>/g, "").trim()
const formatBlogDate = (dateString) => {
  if (!dateString) return "Recently published"
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return "Recently published"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const BlogSection = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: apiBlogs = [], isLoading, isError } = useGetBlogsQuery({
    skip: 0,
    limit: 100,
  })
  const blogPosts = [...apiBlogs].sort((a, b) => {
    const first = new Date(b?.published_date || 0).getTime()
    const second = new Date(a?.published_date || 0).getTime()
    return first - second
  })

  const totalPages = Math.ceil(blogPosts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentPosts = blogPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  return (
    <section className="py-8 bg-gradient-to-b from-[#212121] via-[#212121] to-[#212121] relative overflow-hidden">
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
        <div
          key={currentPage}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          {isLoading && (
            <p className="col-span-full text-center text-[#F5EFE7]/70">Loading blogs...</p>
          )}

          {!isLoading && isError && (
            <p className="col-span-full text-center text-[#F5EFE7]/70">
              Unable to load blogs right now.
            </p>
          )}

          {!isLoading && !isError && currentPosts.length === 0 && (
            <p className="col-span-full text-center text-[#F5EFE7]/70">No blogs found.</p>
          )}

          {currentPosts.map((post) => (
            <div
              key={post.id ?? post.title}
              className="group w-full max-w-[320px] mx-auto sm:max-w-none"
            >
              <Link href={`/blog/${post.id}`}>
                <div className="relative h-52 sm:h-72 rounded-lg sm:rounded-xl overflow-hidden bg-[#212121] border border-[#F5EFE7]/10">
                  <img
                    src={post.image_url || "/assets/images/project/project1.webp"}
                    alt={post.title || "Blog image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/90 via-[#212121]/40 to-transparent"></div>

                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#212121]/80 backdrop-blur-sm text-[#F5EFE7] text-[11px] sm:text-xs font-medium rounded-md border border-[#F5EFE7]/10">
                      {formatBlogDate(post.published_date)}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4">
                    <h3 className="text-[#F5EFE7] font-medium text-[11px] sm:text-sm md:text-base leading-tight mb-1.5 sm:mb-3 line-clamp-2 group-hover:text-[#C6A256] transition-colors duration-300">
                      {post.title}
                    </h3>

                    

                    <div className="w-full h-px bg-[#F5EFE7]/20 mb-1.5 sm:mb-3"></div>

                    <div className="flex items-center gap-1.5 text-[#F5EFE7]/60">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs">{post.author || "Admin"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
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
        )}
      </div>
    </section>
  )
}

export default BlogSection
