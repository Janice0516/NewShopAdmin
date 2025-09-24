"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { menuData } from "../data/menu";
import { Menu, X } from "lucide-react"; // 汉堡菜单图标

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 鼠标进入主菜单项
  const handleMouseEnter = (itemTitle: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(itemTitle);
  };

  // 鼠标离开主菜单项或子菜单
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // 缩短延时到150ms，提高响应性
  };

  // 鼠标进入子菜单区域
  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="nav-left">
          <Link href="/" className="logo-link">
            <span className="logo">MI</span>
          </Link>
        </div>

        {/* 桌面菜单 - 居中布局 */}
        <div className="nav-center">
          <ul className="nav-menu desktop">
            {menuData.map((item, idx) => (
              <li 
                key={idx} 
                className="nav-item"
                onMouseEnter={() => item.children && handleMouseEnter(item.title)}
                onMouseLeave={handleMouseLeave}
              >
                <Link href={item.href} className="nav-link">{item.title}</Link>
                {item.children && (
                  <div 
                    className={`dropdown ${activeDropdown === item.title ? 'show' : ''}`}
                  >
                    {/* 检查是否为Store/Wearables的三栏布局或Smart Home的两栏布局 */}
                    {(item.title === "Store" || item.title === "Wearables") && typeof item.children === 'object' && 'leftColumn' in item.children ? (
                      <div 
                        className={`${item.title.toLowerCase().replace(/\s+/g, '-')}-dropdown-content`}
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* 左栏 - Key Event */}
                        <div className="dropdown-column left-column">
                          <h3 className="column-title">{item.children.leftColumn?.title}</h3>
                          <ul className="column-items">
                            {item.children.leftColumn?.items?.map((subItem, i) => (
                              <li key={i}>
                                <Link href={subItem.href} className="dropdown-link">{subItem.title}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 中栏 - Mi.com Feature */}
                        <div className="dropdown-column center-column">
                          <h3 className="column-title">{item.children.centerColumn?.title}</h3>
                          <ul className="column-items">
                            {item.children.centerColumn?.items?.map((subItem, i) => (
                              <li key={i}>
                                <Link href={subItem.href} className="dropdown-link">{subItem.title}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 右栏 - Daily Picks */}
                        <div className="dropdown-column right-column">
                          <h3 className="column-title">{item.children.rightColumn.title}</h3>
                          <div className="product-grid">
                            {item.children.rightColumn.items.map((product, i) => (
                              <div key={i} className="product-item">
                                <Link href={product.href} className="product-link">
                                  <div className="product-image">
                                    <img src={product.image} alt={product.title} />
                                  </div>
                                  <div className="product-name">{product.title}</div>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (item.title === "Smart Home" || item.title === "Lifestyle") && typeof item.children === 'object' && 'leftColumn' in item.children ? (
                      <div 
                        className={`${item.title.toLowerCase().replace(/\s+/g, '-')}-dropdown-content mega-menu`}
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="mega-menu-container">
                          {/* 左侧65%分类导航区域 */}
                          <div className="mega-menu-left">
                            <h3 className="column-title">{item.children.leftColumn?.title}</h3>
                            <div className="categories-grid">
                              {item.children.leftColumn?.categories?.map((category, categoryIndex) => (
                                <div key={categoryIndex} className="category-section">
                                  <h4 className="category-title">{category.title}</h4>
                                  <ul className="category-items">
                                    {category.items.map((subItem, i) => (
                                      <li key={i}>
                                        <Link href={subItem.href} className="dropdown-link">
                                          {subItem.title}
                                          {subItem.isNew && <span className="new-badge">New</span>}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 右侧35%新品展示区域 */}
                          <div className="mega-menu-right">
                            <h3 className="column-title">{item.children.rightColumn?.title}</h3>
                            <div className="new-products-grid">
                              {item.children.rightColumn?.items?.map((product, i) => (
                                <div key={i} className="product-item">
                                  <Link href={product.href} className="product-link">
                                    <div className="product-image">
                                      <img src={product.image} alt={product.title} />
                                    </div>
                                    <div className="product-name">{product.title}</div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 简单下拉菜单（现在不会被使用，因为只有Store有子菜单）
                      <div 
                        className="simple-dropdown"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <ul>
                          {Array.isArray(item.children) && item.children.map((subItem, i) => (
                            <li key={i}>
                              <Link href={subItem.href} className="dropdown-link">{subItem.title}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* 右侧功能区 */}
        <div className="nav-right">
          <div className="nav-actions">
            <button className="search-btn" aria-label="搜索">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <button className="cart-btn" aria-label="购物车">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
              </svg>
            </button>
            <Link href="/register" className="user-btn" aria-label="用户中心">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          </div>
        </div>

        {/* 移动端按钮 */}
        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* 移动端菜单 */}
      {isOpen && (
        <ul className="nav-menu mobile">
          {menuData.map((item, idx) => (
            <li key={idx} className="nav-item">
              <Link href={item.href}>{item.title}</Link>
              {item.children && Array.isArray(item.children) && (
                <ul className="dropdown">
                  {item.children.map((child, i) => (
                    <li key={i}>
                      <Link href={child.href}>{child.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}