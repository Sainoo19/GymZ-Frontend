import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "../../../components/admin/layout/Pagination";
import Banner from "../../../assets/images/banner.png";
import { FaSearch, FaCalendarAlt, FaUser, FaTags } from "react-icons/fa";
import { motion } from "framer-motion";

// Import dummy news data
import { newsArticles, newsCategories } from "./newsData";

const NewsPage = () => {
      const [articles, setArticles] = useState([]);
      const [filteredArticles, setFilteredArticles] = useState([]);
      const [featuredArticle, setFeaturedArticle] = useState(null);
      const [loading, setLoading] = useState(true);
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const [searchTerm, setSearchTerm] = useState("");
      const [activeCategory, setActiveCategory] = useState("all");
      const articlesPerPage = 6;
      const navigate = useNavigate();
      const location = useLocation();

      useEffect(() => {
            // Simulate loading data
            setLoading(true);
            setTimeout(() => {
                  // Set featured article (first article with featured flag)
                  const featured = newsArticles.find(article => article.featured);
                  setFeaturedArticle(featured || newsArticles[0]);

                  // Set all articles
                  setArticles(newsArticles);
                  setFilteredArticles(newsArticles);
                  setTotalPages(Math.ceil(newsArticles.length / articlesPerPage));
                  setLoading(false);
            }, 800);
      }, []);

      useEffect(() => {
            // When category or search term changes, update filtered articles
            let filtered = articles;

            // Filter by category
            if (activeCategory !== "all") {
                  filtered = filtered.filter(article =>
                        article.category === activeCategory
                  );
            }

            // Filter by search term
            if (searchTerm) {
                  const term = searchTerm.toLowerCase();
                  filtered = filtered.filter(article =>
                        article.title.toLowerCase().includes(term) ||
                        article.short_description.toLowerCase().includes(term)
                  );
            }

            setFilteredArticles(filtered);
            setTotalPages(Math.ceil(filtered.length / articlesPerPage));
            setCurrentPage(1); // Reset to first page when filters change
      }, [activeCategory, searchTerm, articles]);

      // Get current articles for pagination
      const getCurrentArticles = () => {
            const indexOfLastArticle = currentPage * articlesPerPage;
            const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
            return filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
      };

      const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      const handleCategoryChange = (category) => {
            setActiveCategory(category);
      };

      const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
      };

      const handleArticleClick = (id) => {
            navigate(`/news/${id}`);
      };

      if (loading) {
            return (
                  <div className="flex justify-center items-center h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                        <span className="ml-2 text-gray-700">Loading news...</span>
                  </div>
            );
      }

      return (
            <div className="bg-gray-50">


                  {/* Featured Article */}
                  {featuredArticle && (
                        <section className="py-12 px-4">
                              <div className="container mx-auto max-w-6xl">
                                    <h2 className="text-3xl font-bold text-primary relative mb-8 text-center">
                                          Bài Viết Nổi Bật
                                          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-secondary"></span>
                                    </h2>

                                    <motion.div
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.6 }}
                                          className="bg-white shadow-lg rounded-lg overflow-hidden md:flex"
                                          onClick={() => handleArticleClick(featuredArticle.id)}
                                    >
                                          <div className="md:w-1/2 h-80 overflow-hidden">
                                                <img
                                                      src={featuredArticle.image}
                                                      alt={featuredArticle.title}
                                                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                                />
                                          </div>
                                          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                                                <div>
                                                      <div className="flex items-center mb-2">
                                                            <span className="bg-secondary text-primary text-sm font-semibold px-3 py-1 rounded-full">
                                                                  {featuredArticle.category}
                                                            </span>
                                                      </div>
                                                      <h3 className="text-2xl font-bold text-primary mb-3 hover:text-secondary transition-colors duration-300">
                                                            {featuredArticle.title}
                                                      </h3>
                                                      <p className="text-gray-600 mb-4 line-clamp-3">
                                                            {featuredArticle.short_description}
                                                      </p>
                                                </div>
                                                <div className="flex justify-between items-center text-gray-500 text-sm">
                                                      <div className="flex items-center">
                                                            <FaUser className="mr-2" />
                                                            <span>{featuredArticle.author}</span>
                                                      </div>
                                                      <div className="flex items-center">
                                                            <FaCalendarAlt className="mr-2" />
                                                            <span>{featuredArticle.date}</span>
                                                      </div>
                                                </div>
                                          </div>
                                    </motion.div>
                              </div>
                        </section>
                  )}

                  {/* Filter and Search Section */}
                  <section className="py-8 px-4 bg-white shadow-md">
                        <div className="container mx-auto max-w-6xl">
                              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    {/* Categories Filter */}
                                    <div className="flex flex-wrap gap-2 justify-center">
                                          <button
                                                className={`px-4 py-2 rounded-full transition-all ${activeCategory === "all"
                                                      ? "bg-secondary text-primary font-semibold"
                                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                      }`}
                                                onClick={() => handleCategoryChange("all")}
                                          >
                                                Tất cả
                                          </button>
                                          {newsCategories.map((category) => (
                                                <button
                                                      key={category.id}
                                                      className={`px-4 py-2 rounded-full transition-all ${activeCategory === category.id
                                                            ? "bg-secondary text-primary font-semibold"
                                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                            }`}
                                                      onClick={() => handleCategoryChange(category.id)}
                                                >
                                                      {category.name}
                                                </button>
                                          ))}
                                    </div>

                                    {/* Search Bar */}
                                    <div className="relative w-full md:w-auto">
                                          <input
                                                type="text"
                                                placeholder="Tìm kiếm bài viết..."
                                                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                          />
                                          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* Articles List */}
                  <section className="py-12 px-4">
                        <div className="container mx-auto max-w-6xl">
                              {filteredArticles.length > 0 ? (
                                    <>
                                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {getCurrentArticles().map((article) => (
                                                      <motion.div
                                                            key={article.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.5 }}
                                                            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                                                            onClick={() => handleArticleClick(article.id)}
                                                      >
                                                            <div className="h-48 overflow-hidden">
                                                                  <img
                                                                        src={article.image}
                                                                        alt={article.title}
                                                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                                                  />
                                                            </div>
                                                            <div className="p-6">
                                                                  <div className="flex items-center justify-between mb-3">
                                                                        <span className="bg-secondary/20 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                                              {article.category}
                                                                        </span>
                                                                        <div className="text-gray-500 text-xs flex items-center">
                                                                              <FaCalendarAlt className="mr-1" />
                                                                              {article.date}
                                                                        </div>
                                                                  </div>
                                                                  <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2 hover:text-secondary transition-colors duration-300">
                                                                        {article.title}
                                                                  </h3>
                                                                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                                        {article.short_description}
                                                                  </p>
                                                                  <div className="flex justify-between items-center">
                                                                        <div className="flex items-center text-gray-500 text-xs">
                                                                              <FaUser className="mr-1" />
                                                                              {article.author}
                                                                        </div>
                                                                        <button
                                                                              className="text-primary hover:text-secondary font-semibold text-sm transition-colors"
                                                                        >
                                                                              Đọc tiếp
                                                                        </button>
                                                                  </div>
                                                            </div>
                                                      </motion.div>
                                                ))}
                                          </div>

                                          {/* Pagination */}
                                          <div className="mt-12">
                                                <Pagination
                                                      totalPages={totalPages}
                                                      currentPage={currentPage}
                                                      onPageChange={handlePageChange}
                                                />
                                          </div>
                                    </>
                              ) : (
                                    <div className="text-center py-12">
                                          <div className="text-6xl mb-4">😢</div>
                                          <h3 className="text-2xl font-bold text-primary mb-2">Không tìm thấy bài viết nào</h3>
                                          <p className="text-gray-600">
                                                Không có bài viết nào phù hợp với tiêu chí tìm kiếm của bạn.
                                          </p>
                                          <button
                                                className="mt-4 px-4 py-2 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/80 transition-colors"
                                                onClick={() => {
                                                      setSearchTerm("");
                                                      setActiveCategory("all");
                                                }}
                                          >
                                                Xem tất cả bài viết
                                          </button>
                                    </div>
                              )}
                        </div>
                  </section>

                  {/* Newsletter Section */}
                  <section className="py-16 px-4 bg-primary">
                        <div className="container mx-auto max-w-5xl text-center">
                              <h2 className="text-3xl font-bold text-white mb-6">Đăng ký nhận bản tin</h2>
                              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                                    Nhận các bài viết, mẹo tập luyện và nội dung độc quyền thẳng vào hộp thư của bạn
                              </p>
                              <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                                    <input
                                          type="email"
                                          placeholder="Email của bạn"
                                          className="flex-1 px-4 py-3 rounded-lg focus:outline-none"
                                          required
                                    />
                                    <button
                                          type="submit"
                                          className="bg-secondary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
                                    >
                                          Đăng ký
                                    </button>
                              </form>
                        </div>
                  </section>
            </div>
      );
};

export default NewsPage;