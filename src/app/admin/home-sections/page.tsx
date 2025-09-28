'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  buttonLink: string;
  imageUrl: string;
}

const HomeSectionsPage = () => {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Partial<HomeSection> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/home-sections');
      if (!res.ok) {
        throw new Error('Failed to fetch sections');
      }
      const data = await res.json();
      console.log("Fetched sections data:", data); // Log fetched data
      setSections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleOpenModal = (section: Partial<HomeSection> | null = null) => {
    setCurrentSection(section ? { ...section } : { title: '', subtitle: '', buttonLink: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSection(null);
  };

  const handleSave = async () => {
    console.log('handleSave function called.');
    if (!currentSection) {
      console.error('Save failed: currentSection is null.');
      return;
    }

    console.log('Saving section:', currentSection);

    if (!currentSection.title || !currentSection.imageUrl) {
      alert('Title and Image URL are required.');
      console.error('Save failed: Title or Image URL is missing.');
      return;
    }

    const method = currentSection.id ? 'PUT' : 'POST';
    const url = currentSection.id ? `/api/home-sections/${currentSection.id}` : '/api/home-sections';

    console.log(`Attempting to ${method} to ${url}`);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSection),
      });

      console.log('Fetch response status:', res.status);

      if (!res.ok) {
        const errorBody = await res.text();
        console.error('Fetch response not OK:', errorBody);
        throw new Error('Failed to save section');
      }

      await fetchSections();
      handleCloseModal();
      console.log('Section saved successfully.');
    } catch (err) {
      console.error('Error in handleSave:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        const res = await fetch(`/api/home-sections/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error('Failed to delete section');
        }
        await fetchSections();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentSection) {
      setCurrentSection({ ...currentSection, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">首页栏目管理</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          创建新栏目
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">标题</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">副标题</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">链接</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">图片</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {sections.map((section) => (
                <tr key={section.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{section.title}</td>
                  <td className="py-3 px-4">{section.subtitle}</td>
                  <td className="py-3 px-4"><a href={section.buttonLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{section.buttonLink}</a></td>
                  <td className="py-3 px-4"><img src={section.imageUrl} alt={section.title} className="h-12 w-12 object-cover rounded-md" /></td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleOpenModal(section)} className="text-blue-500 hover:text-blue-700 mr-4"><PencilIcon className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(section.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && currentSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-gray-900">{currentSection.id ? '编辑栏目' : '创建新栏目'}</h2>
            <div className="space-y-4">
              <input type="text" name="title" value={currentSection.title || ''} onChange={handleInputChange} placeholder="标题" className="w-full p-2 border rounded text-gray-900 placeholder-gray-400" />
              <input type="text" name="subtitle" value={currentSection.subtitle || ''} onChange={handleInputChange} placeholder="副标题" className="w-full p-2 border rounded text-gray-900 placeholder-gray-400" />
              <input type="text" name="buttonLink" value={currentSection.buttonLink || ''} onChange={handleInputChange} placeholder="链接" className="w-full p-2 border rounded text-gray-900 placeholder-gray-400" />
              <input type="text" name="imageUrl" value={currentSection.imageUrl || ''} onChange={handleInputChange} placeholder="图片 URL" className="w-full p-2 border rounded text-gray-900 placeholder-gray-400" />
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={handleCloseModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">取消</button>
              <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSectionsPage;