'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import './cart.css'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  inStock: boolean
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/cart', { cache: 'no-store' })
        if (res.status === 401) {
          alert('Please log in to view your cart')
          window.location.href = '/login'
          return
        }
        const json = await res.json()
        if (json?.success) {
          const items: CartItem[] = json.data || []
          setCartItems(items)
          // 默认选中所有在库商品
          setSelectedItems(items.filter(i => i.inStock).map(i => i.id))
        } else {
          alert(json?.error || 'Failed to load cart')
        }
      } catch (e) {
        console.error('加载购物车失败:', e)
        alert('Failed to load cart, please try again later')
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [])

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    const item = cartItems.find(i => i.id === id)
    if (!item) return
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id, quantity: newQuantity })
      })
      if (res.status === 401) {
        alert('Please log in before managing your cart')
        window.location.href = '/login'
        return
      }
      const json = await res.json()
      if (json?.success) {
        setCartItems(items => items.map(it => it.id === id ? { ...it, quantity: newQuantity } : it))
      } else {
        alert(json?.error || 'Failed to update quantity')
      }
    } catch (e) {
      console.error('Failed to update quantity:', e)
      alert('Failed to update quantity, please try again later')
    }
  }

  const removeItem = async (id: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id })
      })
      if (res.status === 401) {
        alert('Please log in before managing your cart')
        window.location.href = '/login'
        return
      }
      const json = await res.json()
      if (json?.success) {
        setCartItems(items => items.filter(item => item.id !== id))
        setSelectedItems(selected => selected.filter(itemId => itemId !== id))
      } else {
        alert(json?.error || 'Delete failed')
      }
    } catch (e) {
      console.error('Failed to delete cart item:', e)
      alert('Failed to delete cart item, please try again later')
    }
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems(selected =>
      selected.includes(id)
        ? selected.filter(itemId => itemId !== id)
        : [...selected, id]
    )
  }

  const toggleSelectAll = () => {
    const availableItems = cartItems.filter(item => item.inStock)
    if (selectedItems.length === availableItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(availableItems.map(item => item.id))
    }
  }

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id))
  const totalPrice = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Please select items to checkout')
      return
    }
    alert('Redirecting to checkout...')
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>My Cart</h1>
          <Link href="/uk/store" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Go and buy something!</p>
            <Link href="/uk/store" className="btn btn-primary">
              Go Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-list">
              <div className="cart-list-header">
                <div className="col-select">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cartItems.filter(item => item.inStock).length && cartItems.filter(item => item.inStock).length > 0}
                    onChange={toggleSelectAll}
                  />
                  <span>Select all</span>
                </div>
                <div className="col-product">Product</div>
                <div className="col-price">Unit Price</div>
                <div className="col-quantity">Quantity</div>
                <div className="col-total">Subtotal</div>
                <div className="col-actions"></div>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className={`cart-item ${!item.inStock ? 'out-of-stock' : ''}`}>
                  <div className="col-select">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      disabled={!item.inStock}
                    />
                  </div>
                  <div className="col-product">
                    <img src={item.image} alt={item.name} className="product-image" />
                    <div className="product-info">
                      <Link href={`/uk/store/${item.productId}`} className="product-name">
                        {item.name}
                      </Link>
                      {!item.inStock && <span className="stock-status">Out of stock</span>}
                    </div>
                  </div>
                  <div className="col-price">
                    {item.originalPrice && <span className="original-price">£{item.originalPrice.toFixed(2)}</span>}
                    <span className="current-price">£{item.price.toFixed(2)}</span>
                  </div>
                  <div className="col-quantity">
                    <div className="quantity-selector">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={!item.inStock || item.quantity <= 1}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={!item.inStock}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="col-total">£{(item.price * item.quantity).toFixed(2)}</div>
                  <div className="col-actions">
                    <button onClick={() => removeItem(item.id)} className="remove-btn">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="btn btn-primary btn-checkout"
              >
                Checkout ({selectedItems.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}