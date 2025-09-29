"use client"

import React from "react"

interface ActionButton {
  label: string
  onClick: () => void
}

interface NoticeModalProps {
  isOpen: boolean
  title: string
  description?: string
  onClose: () => void
  primaryAction?: ActionButton
  secondaryAction?: ActionButton
}

export default function NoticeModal({ isOpen, title, description, onClose, primaryAction, secondaryAction }: NoticeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-md mx-auto rounded-2xl bg-white shadow-xl border border-gray-200">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <span aria-hidden="true" className="text-orange-600 text-xl">⚠️</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {description && (
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex items-center justify-end space-x-3">
          {secondaryAction && (
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </button>
          )}
          {!primaryAction && !secondaryAction && (
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}