"use client";

import { useState } from "react";
import { X, Save, Loader2, Edit2 } from "lucide-react";
import { updateUserProfile } from "./actions";

interface EditFieldButtonProps {
  fieldName: "name" | "email";
  currentValue: string | null;
  otherFieldName?: "name" | "email";
  otherFieldValue?: string | null;
  label: string;
  placeholder: string;
  type?: string;
}

export function EditFieldButton({ 
  fieldName, 
  currentValue,
  otherFieldName,
  otherFieldValue,
  label, 
  placeholder,
  type = "text" 
}: EditFieldButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    const result = await updateUserProfile(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 1500);
    } else {
      setError(result.error || "Failed to update");
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Edit Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
        title={`Edit ${label}`}
      >
        <Edit2 className="w-4 h-4 text-purple-300" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <div className="relative w-full max-w-md bg-gradient-to-br from-purple-900 via-violet-900 to-fuchsia-900 rounded-3xl border border-white/20 shadow-2xl animate-scaleIn">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 z-10"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                Edit {label}
              </h2>
              <p className="text-purple-200/70 mb-6">Update your {label.toLowerCase()}</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Field Input */}
                <div>
                  <label htmlFor={fieldName} className="block text-purple-200 text-sm font-medium mb-2">
                    {label}
                  </label>
                  <input
                    type={type}
                    id={fieldName}
                    name={fieldName}
                    defaultValue={currentValue || ""}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    placeholder={placeholder}
                    disabled={isLoading}
                    autoFocus
                  />
                  {/* Hidden input for the other field to maintain its value */}
                  <input
                    type="hidden"
                    name={fieldName === "name" ? "email" : "name"}
                    value={fieldName === "name" ? (otherFieldValue || "") : (otherFieldValue || "")}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                    <p className="text-green-200 text-sm">Updated successfully! ✓</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}